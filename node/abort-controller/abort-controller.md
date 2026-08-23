# How do you cancel async work with AbortController?

Starting async work is the easy part: call `fetch`, kick off a timer, off it goes. The hard part is stopping it once it's already running. The one standard way to do that, across the whole platform, is `AbortController`: a little handle with a `signal` you pass into the async work, and an `abort()` you call when you want to stop.

Select a code block and press **F8** to run it. Output shows in the Output panel.

## A cancellable delay, left to finish

The `delay` helper is our something-cancellable: it resolves after `ms` milliseconds, unless the signal it was handed aborts first. It checks `signal.aborted` up front, in case the cancel already happened before the work even started, and when the abort arrives it clears the timer and rejects with `signal.reason`, the error `abort()` carried. The listen line is the whole trick, and it tells you something: the signal is an event target, the same kind of thing a button is, so you can add an event listener to it. First, the baseline: no abort, so the timer wins.

① A cancellable delay, with nobody cancelling it.

```js
function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const timer =
      setTimeout(() => resolve("delay finished"), ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });
}

const controller = new AbortController();

delay(20, controller.signal)
  .then((value) => console.log("resolved:", value))
  .catch((err) => console.log("rejected:", err.name));
```

## abort() cancels it, and a cancel is a rejection

Same setup, but the delay is a full second, and forty milliseconds in we call `controller.abort()`. The promise does not resolve: it **rejects**, with a ready-made error whose `name` is `AbortError`. So you catch a cancel exactly like any other rejection, and you can tell a real failure from a cancel just by checking that name.

Each block here runs on its own, so this one opens with the same `delay` helper as block ①. Skim past it: the new part is underneath.

② The cancel lands while the work is still running.

```js
function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const timer =
      setTimeout(() => resolve("delay finished"), ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });
}

const controller = new AbortController();

delay(1000, controller.signal)
  .then((value) => console.log("resolved:", value))
  .catch((err) =>
    console.log("rejected:", err.name, "-", err.message));

setTimeout(() => controller.abort(), 40);
```

## The signal is an event target

`abort()` does two things, and it does them straight away: it flips the `aborted` flag, and it fires an `abort` event that anything listening can react to. This exact same signal is what you'd hand to `fetch`, as its `signal` option, to cancel a real network request. We cancel a local timer here so every run is deterministic, but it is the identical mechanism.

③ Listen to the signal directly, and watch the flag flip.

```js
const controller = new AbortController();
const { signal } = controller;

signal.addEventListener("abort", () => {
  console.log("abort event fired");
  console.log("signal.aborted:", signal.aborted);
});

setTimeout(() => {
  console.log("signal.aborted:", signal.aborted);
  controller.abort();
}, 60);
```

## AbortSignal.timeout: a signal with a built-in deadline

For the really common case of "I just want a deadline", skip the controller and the hand-rolled `setTimeout`: `AbortSignal.timeout(ms)` hands you a signal that aborts itself after the time you give it. And look closely at the rejection: it's a `TimeoutError`, not an `AbortError`. Same signal machinery underneath, different reason on the way out, so "something cancelled this" and "this ran out of time" stay distinguishable.

Same story as block ②: the `delay` helper is repeated so the block stands alone, and the new part is the single call at the bottom.

④ A self-cancelling signal, and a different error name.

```js
function delay(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }
    const timer =
      setTimeout(() => resolve("delay finished"), ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });
}

delay(1000, AbortSignal.timeout(80))
  .then((value) => console.log("resolved:", value))
  .catch((err) =>
    console.log("rejected:", err.name, "-", err.message));
```
