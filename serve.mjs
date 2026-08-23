#!/usr/bin/env node
// Local host for the workshop demos. Sibling of verify.mjs: that one runs the blocks, this
// one puts them on an origin.
//
// One server, one origin, everything the recording needs:
//   /                                                  index of the workshop tree
//   /browser/fetch-2026/                               snippet host page for the fetch lecture
//   /api/users/1                                       that same folder's worker.js, the file Cloudflare runs
//   /browser/web-worker/web-worker-example.html        the web worker demo page
//   /browser/debounce-throttle/debounce-throttle.html  the debounce demo page
// (all off http://localhost:8787, or whatever port you pass)
//
// Same origin is the entire point of this file. The fetch snippet asks for a relative
// "/api/users/1", so nothing it does is cross-origin: no CORS preflight to explain away
// mid-lecture, and no Chrome local network access permission prompt (shipping in Chrome 142)
// popping up over the recording.
//
// TWO kinds of page need this server, not one. The fetch demo needs it for the same origin
// above. The web worker pages need it too, for a different reason: Chrome gives every
// file:// page an OPAQUE origin, and "new Worker(...)" throws there, so opening that html
// off the disk fails before any of the lesson happens. Serve it and it just works. The rest
// of the workshop is happy off file:// and stays that way.
//
// Usage:  node serve.mjs [port]      (default 8787, or $PORT)
//         just workshop-serve        (the front door)

import { createServer } from "node:http";
import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import worker from "./browser/fetch-2026/worker.js";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)));
const PORT = Number(process.argv[2] || process.env.PORT || 8787);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

const escape = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function send(res, status, body, type = "text/plain; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store" });
  res.end(body);
}

// Bridge a Node request into the Worker's web-standard fetch handler and back out again.
// worker.js sees a normal Request and returns a normal Response, exactly as on Cloudflare.
async function callWorker(req, res, url) {
  const chunks = [];
  if (req.method !== "GET" && req.method !== "HEAD") {
    for await (const chunk of req) chunks.push(chunk);
  }
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (value === undefined || name.startsWith(":")) continue;
    if (name === "host" || name === "connection" || name === "transfer-encoding") continue;
    for (const one of Array.isArray(value) ? value : [value]) headers.append(name, one);
  }
  const out = await worker.fetch(
    new Request(url, {
      method: req.method,
      headers,
      body: chunks.length ? Buffer.concat(chunks) : undefined,
    }),
  );
  const body = Buffer.from(await out.arrayBuffer());
  res.writeHead(out.status, { ...Object.fromEntries(out.headers), "Cache-Control": "no-store" });
  res.end(req.method === "HEAD" ? undefined : body);
}

async function autoIndex(res, urlPath, dir) {
  const entries = (await readdir(dir, { withFileTypes: true }))
    .filter((e) => !e.name.startsWith("."))
    .sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name));
  const rows = entries
    .map((e) => {
      const name = e.name + (e.isDirectory() ? "/" : "");
      return `<li><a href="${escape(encodeURIComponent(e.name) + (e.isDirectory() ? "/" : ""))}">${escape(name)}</a></li>`;
    })
    .join("\n");
  const html = `<!doctype html><meta charset="utf-8"><title>${escape(urlPath)}</title>
<style>body{font:15px/1.7 ui-monospace,monospace;background:#0a0e12;color:#e6edf3;margin:0;padding:2rem}
h1{font-size:1rem;color:#7d8896;font-weight:400;margin:0 0 1rem}a{color:#36e794;text-decoration:none}
a:hover{text-decoration:underline}ul{list-style:none;padding:0;margin:0}li{padding:.15rem 0}</style>
<h1>adv-js workshop ${escape(urlPath)}</h1>
<ul>
${urlPath === "/" ? "" : '<li><a href="../">../</a></li>'}
${rows}
</ul>`;
  send(res, 200, html, "text/html; charset=utf-8");
}

async function serveStatic(req, res, url) {
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return send(res, 400, "bad request\n");
  }
  const target = resolve(ROOT, "." + pathname);
  if (target !== ROOT && !target.startsWith(ROOT + sep)) return send(res, 403, "forbidden\n");

  let info;
  try {
    info = await stat(target);
  } catch {
    return send(res, 404, `not found: ${pathname}\n`);
  }

  if (info.isDirectory()) {
    if (!url.pathname.endsWith("/")) {
      res.writeHead(301, { Location: url.pathname + "/" + url.search });
      return res.end();
    }
    try {
      const index = await readFile(join(target, "index.html"));
      return send(res, 200, index, TYPES[".html"]);
    } catch {
      return autoIndex(res, pathname, target);
    }
  }

  const body = await readFile(target);
  send(res, 200, req.method === "HEAD" ? "" : body, TYPES[extname(target)] ?? "application/octet-stream");
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      await callWorker(req, res, url);
    } else {
      await serveStatic(req, res, url);
    }
  } catch (err) {
    send(res, 500, `${err.name}: ${err.message}\n`);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`workshop  http://localhost:${PORT}/`);
  console.log(`fetch demo  http://localhost:${PORT}/browser/fetch-2026/   (API at /api, same origin)`);
  console.log(`web worker demo  http://localhost:${PORT}/browser/web-worker/web-worker-example.html   (workers need an origin)`);
  console.log(`debounce demo  http://localhost:${PORT}/browser/debounce-throttle/debounce-throttle.html`);
  console.log("Ctrl+C to stop.");
});
