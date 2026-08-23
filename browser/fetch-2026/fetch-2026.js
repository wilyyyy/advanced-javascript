// How does fetch work in 2026?
// One DevTools snippet, built up block by block.
// Async topic, so every block uses .then() / .catch(), never top-level await.
// It hits our own teaching endpoint (worker.js next to this file), so the demo never depends on a public API that might vanish.
// Run `just workshop-serve` first, then open http://localhost:8787/browser/fetch-2026/ and put this snippet in DevTools. The page and the API come off that one server, so /api below is a same-origin URL: no CORS, and no Chrome local network access prompt mid-lecture.
// Real network, so latency varies between blocks: each log is tagged with its block number, and you can press Cmd+K to clear before the next one.
// Recording protocol: each shot, select everything from the top of this file down through block N,
// then in the snippet select all, delete, paste, Cmd+Enter. Nothing else to add: no braces, no separate setup line.
// No block declares a variable, so the states never collide.

const API = "/api";

// ① fetch hands you a Response, not the data
fetch(`${API}/users/1`)
  .then((res) =>
    console.log("①", res.constructor.name, "status", res.status))
  .catch((err) => console.log("① network error:", err.message));

// ② the body is a second step: res.json()
fetch(`${API}/users/1`)
  .then((res) => res.json())
  .then((user) => console.log("②", user))
  .catch((err) => console.log("② network error:", err.message));

// ③ a 404: does this land in .then or .catch?
fetch(`${API}/status/404`)
  .then((res) => console.log("③ .then ran, res.ok:", res.ok))
  .catch((err) => console.log("③ .catch ran:", err.message));

// ④ so you decide what counts as a failure
fetch(`${API}/status/404`)
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then((data) => console.log("④", data))
  .catch((err) => console.log("④ handled:", err.message));

// ⑤ sending data with POST
fetch(`${API}/users`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "zanete" }),
})
  .then((res) => res.json())
  .then((created) => console.log("⑤ created:", created))
  .catch((err) => console.log("⑤ error:", err.message));

// ⑥ a slow request, with a deadline
fetch(`${API}/slow?ms=3000`, {
  signal: AbortSignal.timeout(1000),
})
  .then((res) => res.json())
  .then((data) => console.log("⑥ finished:", data))
  .catch((err) => console.log("⑥ gave up:", err.name));
