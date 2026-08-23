/**
 * S13E04 · Live demo: stepping through the event loop
 *
 * Open this file in VS Code and press F5 (Node debug). The `debugger;` lines
 * stop you at every point where the loop hands control somewhere new, so you
 * can watch the order happen rather than take my word for it.
 *
 * Verified on Node 24.1.0. Real output is at the bottom of this file.
 *
 * PART TWO lives on line 24. Leave it commented for the first run through.
 */

console.log('script start');

// A repeating macro-task. Timer is 0, so it is ready on every trip round the loop.
const interval = setInterval(() => {
  debugger; // (4) a macro-task: the interval callback
  console.log('setInterval');

  // ── PART TWO ──────────────────────────────────────────────────────────── Uncomment the next line and run again. It is the whole point of the lecture: this micro-task fires BEFORE 'set timeout one', not after it.
  // Promise.resolve().then(() => console.log('  interval microtask')); ────────────────────────────────────────────────────────────────────────
}, 0);

// A one-shot macro-task, queued in the same phase as the interval above.
setTimeout(() => {
  debugger; // (5) the next macro-task, and its micro-tasks drain right after it
  console.log('set timeout one');

  Promise.resolve()
    .then(() => {
      debugger;
      console.log('promise three');
    })
    .then(() => console.log('promise four'))
    .then(() => setTimeout(() => {
      debugger; // (8) queued from INSIDE a micro-task, so it waits for the next trip
      console.log('set timeout two');

      Promise.resolve()
        .then(() => console.log('promise five'))
        .then(() => console.log('promise six'))
        .then(() => clearInterval(interval)); // nothing pending, so Node exits
    }, 0));
}, 0);

// Micro-tasks queued by the top-level script. These run once the script finishes, before the loop reaches any timer at all.
Promise.resolve()
  .then(() => {
    debugger;
    console.log('promise one');
  }) // (2)
  .then(() => console.log('promise two')); // (3)

/*
Verified output, Node 24.1.0, PART TWO still commented:

  script start
  promise one
  promise two
  setInterval
  set timeout one
  promise three
  promise four
  setInterval
  set timeout two
  promise five
  promise six

Verified output, Node 24.1.0, PART TWO uncommented:

  script start
  promise one
  promise two
  setInterval
    interval microtask     <- lands HERE, between the two timers
  set timeout one
  promise three
  promise four
  setInterval
    interval microtask
  set timeout two
  promise five
  promise six

That indented line is the whole lesson. Node drains micro-tasks after EVERY
macro-task callback, not after the whole queue of them. Before Node 11 (2018)
it batched, and that line would have printed after 'set timeout one'.
*/
