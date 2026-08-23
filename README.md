# Advanced JavaScript, the code

Every piece of code I show you on the course is in here, as a real file, in the folder the
video shows. Clone it once and you can follow along in whichever way you like.

```bash
git clone https://github.com/jawache/advanced-javascript.git
cd advanced-javascript
node hello.js
```

If that printed `hello asim`, you're done setting up. There's nothing to install, no build
step, and no dependencies: it's plain JavaScript files all the way down.

## What you need

**Node 24 or newer.** Check with `node --version`. Everything in here is verified against
Node 24, and a few of the later lectures use language features that only landed recently, so
an older Node will run most of this and then surprise you on the new stuff.

**Chrome**, for the lectures taught in DevTools.

**VS Code** is optional. It's what I use on screen, and there's a one-extension setup below
if you want the exact same F8 workflow, but you never need it. A file and `node` always works.

## How the folders work

Two folders at the top, and the split is about what *runs* the code:

- **`node/`** is code that runs in Node: `node <file>`, or select a block and press F8 in
  VS Code.
- **`browser/`** is code that runs in a browser: open the `.html`, or paste the `.js` into a
  Chrome DevTools snippet.

Inside each one there's a folder per exercise, named after the exercise and nothing else.
No numbers, no lecture codes, no chapters. A lecture code in a folder name would mean
renaming folders every time I reorder the course, and I reordered it twice while making it.
Some exercises are walked by one lecture, some by a lot: `node/promises/` is one handout that
eleven lectures work through.

You'll meet four shapes inside those folders:

| Shape | What it is | How you run it |
| --- | --- | --- |
| a single `.js` under `browser/` | a DevTools snippet, built up block by block | paste it into Sources > Snippets, Cmd+Enter |
| a `.md` handout under `node/` | markdown prose with runnable code blocks in it | select a block, press F8 (or copy it into a file) |
| numbered files (`01-`, `02-`) | one file per step, in the order I show them on screen | `node 01-primitive.js` |
| a demo page, or a set of modules | an `.html` you open, or `.cjs` / `.mjs` files shown side by side | open it, or `node main.mjs` |

A few folders have a `files/`, `assets/` or `answers/` folder next to the handout. Those are
fixtures the code reads and the answers to the exercises, and they need to sit exactly where
they are.

## The four ways code runs on this course

### 1. A file and node

The simplest one, and the one I'd start with.

```bash
node node/map-set/map-set.js
node node/promise-finally/02-after-success.js
node node/top-level-await/top-level-await.mjs
```

That's it. It works for every `.js`, `.cjs` and `.mjs` file under `node/`. The `.md` handouts
are the one exception, and they're the next section.

One thing to expect: some of these throw on purpose, because the error *is* the lesson. A
temporal dead zone `ReferenceError` in `node/let-const/let-const.js`, an unhandled rejection in
`node/promise-chaining/01-immediate.js`. If a file blows up in a way the lecture just told you
it would, nothing is wrong with your setup.

### 2. VS Code, select a block, press F8

This is what you see me doing in the Node chapters. Open **this folder** in VS Code (the
folder matters, see the gotchas), then:

Install Code Runner:

```bash
code --install-extension formulahendry.code-runner
```

Bind F8 to it, in `keybindings.json` (Cmd+Shift+P, "Open Keyboard Shortcuts (JSON)"):

```json
{ "key": "f8", "command": "code-runner.run", "when": "editorTextFocus" }
```

And add these to your `settings.json` (Cmd+Shift+P, "Open User Settings (JSON)"):

```json
"code-runner.runInTerminal": false,
"code-runner.clearPreviousOutput": true,
"code-runner.showExecutionMessage": false,
"code-runner.fileDirectoryAsCwd": true,
"code-runner.executorMap": {
  "javascript": "node",
  "markdown": "node"
}
```

Now open any `.md` handout, select a code block, press F8, and the output appears in the
Output panel. Each block runs on its own in a fresh `node` process, exactly as if you'd
copied it into an empty file.

Four gotchas, all of which have bitten me:

- **`"markdown": "node"` is the line that matters.** Without it, F8 inside a `.md` file just
  says "Code language not supported or defined" and nothing runs. Code Runner ships a
  `javascript` mapping out of the box and no `markdown` one.
- **`fileDirectoryAsCwd` is the second line that matters.** Some handouts read a fixture next
  to them, like `./files/demofile.txt`. Without this setting your selection runs from
  whatever folder you opened in VS Code, and you get `ENOENT: no such file or directory` on a
  file that's sitting right there.
- **Always select before you press F8 in a markdown file.** With nothing selected, Code
  Runner sends the *whole* markdown file to node, prose and all, and it falls over.
- **No top level `await` and no `import` / `export` in a selection.** A selection runs as
  plain CommonJS, so those are syntax errors. Where a lecture genuinely needs them there's a
  real `.mjs` file to run instead, like `node/top-level-await/top-level-await.mjs`, and I run
  it with `node`.

### 3. Chrome DevTools snippets

A good chunk of this course is taught in Chrome's console, because for some topics that's where
the thing lives.
Open DevTools with **Cmd+Option+J** (Ctrl+Shift+J on Windows), go to **Sources > Snippets**,
hit **New snippet**, paste the contents of a file from `browser/`, and press **Cmd+Enter**
(Ctrl+Enter on Windows) to run it.

```text
browser/array-methods/array-methods.js
browser/devtools-2026/devtools-2026.js
browser/event-delegation/event-delegation.js
```

Those files are built up block by block, so you can paste one block, run it, read the output,
then paste the next one underneath. Cmd+Enter always runs the whole snippet from the top, so
the newest output is at the bottom of the console.

The `.html` demos in `browser/` need no snippet at all. Double click the file, or drag it into
Chrome, and it runs:

```text
browser/blocking/blocking-with-while.html
browser/blocking/blocking-with-set-timeout.html
browser/blocking/fib-calculations.html
browser/raf-vs-set-timeout/raf-vs-set-timeout.html
browser/debounce-throttle/debounce-throttle.html
```

Two of them are the exception, and they want the little server in the next section:
`browser/web-worker/web-worker-example.html` and the answer page beside it. A web worker is a
separate script, and Chrome treats every `file://` page as its own locked-down origin, so
opening those two off your disk gets you `SecurityError: Failed to construct 'Worker'` rather
than the demo. Serve them over http and they're fine.

### 4. The local server

Two lectures want a real `http://` origin rather than a file on your disk: the fetch one,
because it asks for a relative `/api` URL and I want that same origin (no CORS to explain away,
and no browser permission prompt in the middle of a demo), and the web worker one, for the
reason just above. There's a tiny server here for exactly that:

```bash
node serve.mjs
```

Then open one of these:

```text
http://localhost:8787/browser/fetch-2026/                          the fetch lecture
http://localhost:8787/browser/web-worker/web-worker-example.html   the web worker demo
http://localhost:8787/                                             everything else, browsable
```

The API the fetch snippet talks to is `/api/users/1` on that same origin, served straight out of
`browser/fetch-2026/worker.js`, which is the very same file that runs on Cloudflare:

```bash
curl http://localhost:8787/api/users/1
```

Ask for a user that doesn't exist and you get a 404, which is the whole point of one of the
lecture's demos. Pass a port if 8787 is busy: `node serve.mjs 9000`.

## Running everything at once

`verify.mjs` re-runs every code block in every markdown handout and prints what it actually
outputs. It's how I keep this repo honest, and it's useful to you when you want to see all the
output for a topic in one go:

```bash
node verify.mjs                # every handout
node verify.mjs promises       # only paths containing "promises"
node verify.mjs browser        # a whole section
```

Each block runs in its own `node` process, from its own folder, which is the same thing F8
does. A handful of blocks fail on purpose, because failing *is* the lesson (an exercise stub
you're meant to finish, a temporal dead zone error, reading a file that isn't there). The exit
code is printed per block and never rolled up into a pass or a fail, so a non-zero in the
output isn't necessarily a problem.

## Why there's a package.json here

It has no dependencies and no scripts. Its whole job is one line:

```json
{ "type": "commonjs" }
```

Please don't delete it, and don't change it to `"type": "module"`. Two things lean on it:

1. **The early lectures are recorded in the DevTools console**, which is sloppy mode
   CommonJS. Sloppy mode is what makes some of the demos behave the way you see them behave
   on screen, so the files have to run the same way under node.
2. **F8 in a markdown file stops working without it.** Code Runner hands node a temporary
   `.md` file, and node will only run an unknown extension like that as CommonJS. Under
   `"type": "module"` you get `ERR_UNKNOWN_FILE_EXTENSION` and nothing else.

There's one exception, and it's deliberate: `browser/fetch-2026/package.json` opts that single
folder back into `"type": "module"`, because `worker.js` in there is a Cloudflare Worker and
the Worker format is an ES module. That's the only folder with its own package.json.

## If something doesn't work

Check `node --version` first: most of the surprises are an old Node. If a file still
misbehaves, that's worth telling me about, because every block in here is meant to run exactly
as the video shows it.
