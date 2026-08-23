#!/usr/bin/env node
// Repeatable verifier for the workshop tree.
//
// For every `.md` handout in the tree it extracts each ```js fenced block and
// runs it in ITS OWN `node` process (one block = one F8 press), then prints the
// real stdout/stderr. Running each block isolated is what keeps the demos honest:
// a block that swaps globals (e.g. the fake clock) can't leak into the next one,
// exactly as Code Runner runs each selection fresh.
//
// The printed output is the source of truth for the expected-output cells in the
// recording scripts. Some blocks throw on purpose (e.g. class-fields' reach-in
// attempt, which is meant to refuse to parse); the exit code is reported per
// block, never aggregated into a pass/fail.
//
// It WALKS, because the tree is `node/<exercise>/` deep and a handout is not
// always named after the folder holding it. Anything you pass is matched against
// the whole path, so a section, an exercise or a file name all narrow it.
//
// Each block runs with its CWD set to the handout's own folder, because that is
// where the handout's fixtures are: the imported 2018 files read
// `./files/demofile.txt`, which sits beside them, and running from anywhere else
// reports ENOENT on a file that is right there. The script itself is written to a
// temp dir so nothing lands in the tree.
//
// Usage:  node verify.mjs            (every handout)
//         node verify.mjs let-const  (only paths containing the argument)
//         node verify.mjs browser    (a whole section)

import { readFileSync, writeFileSync, readdirSync, mkdtempSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const filter = process.argv[2] ?? "";
const tmp = mkdtempSync(join(tmpdir(), "workshop-verify-"));

/** Every `.md` under `dir`, deepest-last, as paths relative to the workshop root.
 *
 * A README is prose ABOUT the code, never code to run: its ```js fences are
 * examples of how to use the tree, and executing them is at best noise and at
 * worst a demo that reads as broken. Skipped at any depth. */
function handouts(dir) {
  const found = [];
  for (const e of readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (e.name.startsWith(".") || e.name === "node_modules") continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) found.push(...handouts(full));
    else if (e.name.endsWith(".md") && e.name.toLowerCase() !== "readme.md") found.push(relative(root, full));
  }
  return found;
}

const lectures = handouts(root).filter((p) => p.includes(filter));

console.log(`Node: ${process.version}   (${new Date().toISOString()})`);
console.log("=".repeat(70));

for (const mdRel of lectures) {
  const md = readFileSync(join(root, mdRel), "utf8");
  const slug = mdRel.split(sep).join("-").replace(/\.md$/, "");

  const blocks = [...md.matchAll(/```js\n([\s\S]*?)```/g)].map((m) => m[1]);
  const beside = join(root, dirname(mdRel));
  console.log(`\n##### ${mdRel}, ${blocks.length} block(s)`);

  blocks.forEach((src, i) => {
    const file = join(tmp, `${slug}-${i + 1}.js`);
    writeFileSync(file, src);
    let out, code = 0;
    try {
      out = execFileSync(process.execPath, [file], { cwd: beside, encoding: "utf8", timeout: 10_000, stdio: ["ignore", "pipe", "pipe"] });
    } catch (err) {
      out = `${err.stdout ?? ""}${err.stderr ?? ""}`;
      code = err.status ?? 1;
    }
    console.log(`\n----- block ${i + 1} -----`);
    process.stdout.write(out.endsWith("\n") || out === "" ? out : out + "\n");
    console.log(`(exit ${code})`);
  });
}

rmSync(tmp, { recursive: true, force: true });
