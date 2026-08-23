# Exercise: polyfill Promise.all

A classic interview build: you get handed `Promise.all` and asked to write it yourself. It takes an array of promises, waits for all of them, and resolves to an array of their values in the ORIGINAL order. If any single one rejects, the whole thing rejects straight away with that reason.

Select a code block and press **F8** to run it. Output shows in the Output panel.

## The target: what Promise.all does

Before we write a line, let's pin down the behaviour we're copying. Three promises that settle at different times. The values come back in input order, not in the order they finished.

① The first in the array is the slowest to settle, the last is the quickest.

```js
const slow = new Promise((resolve) => setTimeout(() => resolve("slow"), 30));
const medium = new Promise((resolve) => setTimeout(() => resolve("medium"), 20));
const fast = new Promise((resolve) => setTimeout(() => resolve("fast"), 10));

Promise.all([slow, medium, fast]).then((values) => {
  console.log(values);
});
```

## The build: a results array, a counter, and order by index

`myPromiseAll` returns a brand new promise. Inside, a `results` array and a `completed` counter. For each input, by its index `i`, we wait on it and stash the value at `results[i]`, so order follows the input and not the clock. We resolve only when `completed` reaches the input length. And we pass `reject` straight through, so any rejection rejects the lot.

② Same three promises, same order out, but now it's our version.

```js
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    promises.forEach((promise, i) => {
      Promise.resolve(promise).then((value) => {
        results[i] = value; // stash by index, so order follows the input
        completed++; // count how many have settled
        if (completed === promises.length) resolve(results);
      }, reject); // pass reject straight through, so we fail fast
    });
  });
}

const slow = new Promise((resolve) => setTimeout(() => resolve("slow"), 30));
const medium = new Promise((resolve) => setTimeout(() => resolve("medium"), 20));
const fast = new Promise((resolve) => setTimeout(() => resolve("fast"), 10));

myPromiseAll([slow, medium, fast]).then((values) => {
  console.log(values);
});
```

## Fail fast: one rejection sinks the whole thing

The second argument to `.then` is an onRejected handler. We hand it `reject` directly, so the first input to reject rejects our outer promise immediately. The ones still pending never get a say. `allSettled` is the version that waits for every promise and reports each outcome instead.

③ The middle one rejects, so the whole thing rejects with its reason.

```js
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    promises.forEach((promise, i) => {
      Promise.resolve(promise).then((value) => {
        results[i] = value;
        completed++;
        if (completed === promises.length) resolve(results);
      }, reject);
    });
  });
}

const ok = new Promise((resolve) => setTimeout(() => resolve("ok"), 10));
const boom = new Promise((resolve, reject) => setTimeout(() => reject(new Error("boom")), 20));
const late = new Promise((resolve) => setTimeout(() => resolve("late"), 30));

myPromiseAll([ok, boom, late])
  .then((values) => console.log("resolved:", values))
  .catch((err) => console.log("rejected:", err.message));
```

## The one line to remember

Promise.all is a closure over a results array and a counter. Order comes from stashing each value at its input index. Fail fast comes from passing reject straight through. allSettled would wait for every promise and report each outcome instead of bailing on the first rejection.
