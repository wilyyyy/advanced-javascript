// Stable teaching endpoint for the "How does fetch work in 2026?" lecture (#16).
// Zero dependencies, read-mostly, and written against web-standard Request/Response only, so
// the very same file runs two ways with no edit:
//
//   locally   `just workshop-serve` mounts this handler at /api on the same origin that
//             serves the demo pages (../../serve.mjs). Same origin means the lecture needs no
//             CORS and never trips Chrome's local network access prompt.
//   published as a Cloudflare Worker on a route like  learn.asim.dev/advjs/api/*  when the
//             demo needs a public home.
//
// Deploy (Wrangler):
//   npx wrangler deploy worker.js --name advjs-api
//   then add a route  learn.asim.dev/advjs/api/*  ->  advjs-api  in the Cloudflare dashboard.
//
// The CORS headers below are belt and braces: same-origin local serving does not need them,
// but they keep the published Worker usable straight from a console on any origin.
//
// Routes used by the lecture:
//   GET  /api/users            list of users
//   GET  /api/users/:id        one user (404 if missing)  <- the res.ok gotcha
//   POST /api/users            echoes back the created record with a new id
//   GET  /api/posts?page=N     paginated list (10 per page)
//   GET  /api/slow?ms=N        waits N ms, then responds  <- AbortSignal.timeout demo
//   GET  /api/status/:code     responds with exactly that HTTP status

const USERS = [
  { id: 1, name: "asim", email: "asim@example.com" },
  { id: 2, name: "zanete", email: "zanete@example.com" },
  { id: 3, name: "sam", email: "sam@example.com" },
];

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body, status = 200, extra = {}) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "Content-Type": "application/json", ...CORS, ...extra },
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const method = request.method;

    // preflight
    if (method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

    // work whether mounted at /api/*, under a course prefix like /advjs/api/*, or at the root
    let path = url.pathname.replace(/^(?:\/[^/]+)*?\/api(?=\/|$)/, "");
    if (path === "") path = "/";
    const seg = path.split("/").filter(Boolean); // e.g. ["users","1"]

    // GET /slow?ms=2000
    if (seg[0] === "slow") {
      const ms = Math.min(Number(url.searchParams.get("ms")) || 1000, 10000);
      await sleep(ms);
      return json({ ok: true, waited: ms });
    }

    // GET /status/:code
    if (seg[0] === "status" && seg[1]) {
      const code = Number(seg[1]) || 200;
      return json({ status: code, message: `you asked for a ${code}` }, code);
    }

    // /users and /users/:id
    if (seg[0] === "users") {
      if (method === "POST") {
        let sent = {};
        try { sent = await request.json(); } catch (_) { /* empty body is fine */ }
        const created = { id: USERS.length + 1, ...sent };
        return json(created, 201);
      }
      if (seg[1]) {
        const user = USERS.find((u) => String(u.id) === seg[1]);
        return user ? json(user) : json({ error: "user not found" }, 404);
      }
      return json(USERS);
    }

    // GET /posts?page=N  (10 per page, 47 total)
    if (seg[0] === "posts") {
      const total = 47, perPage = 10;
      const pages = Math.ceil(total / perPage);
      const page = Math.min(Math.max(Number(url.searchParams.get("page")) || 1, 1), pages);
      const start = (page - 1) * perPage;
      const items = Array.from({ length: Math.min(perPage, total - start) }, (_, i) => {
        const id = start + i + 1;
        return { id, title: `Post number ${id}`, userId: ((id - 1) % USERS.length) + 1 };
      });
      return json({ page, pages, total, perPage, items });
    }

    // index
    if (path === "/") {
      return json({
        name: "learn.asim.dev/advjs teaching API",
        routes: ["/users", "/users/:id", "/users (POST)", "/posts?page=N", "/slow?ms=N", "/status/:code"],
      });
    }

    return json({ error: "not found", path }, 404);
  },
};
