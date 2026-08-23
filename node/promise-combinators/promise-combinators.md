# What do allSettled, any and withResolvers do?

You already know `Promise.all` and `Promise.race`, the two combinators that take a list of promises and give you back one. Three newer statics round out the set. `Promise.allSettled` never rejects and reports every result. `Promise.any` gives you the first one that succeeds and ignores the failures. And `Promise.withResolvers` hands you the `resolve` and `reject` functions directly, so you stop reaching into the executor.

Select a code block and press **F8** to run it. Output shows in the Output panel.

## Promise.all bails the moment one input rejects

`Promise.all` waits for every promise to fulfil, then gives you an array of the values. But if any single one rejects, the whole thing rejects immediately with that reason, and the results you did get are thrown away.

① One rejection sinks the batch.

```js
const ok = (v, ms) =>
  new Promise((res) => setTimeout(() => res(v), ms));
const fail = (v, ms) =>
  new Promise((_, rej) => setTimeout(() => rej(v), ms));

Promise.all([
  ok("users loaded", 10),
  fail("payments API down", 20),
  ok("settings loaded", 30),
])
  .then((results) => console.log("all resolved:", results))
  .catch((err) => console.log("Promise.all rejected:", err));
```

## Promise.allSettled reports every result, win or lose

`Promise.allSettled` never rejects. It waits for every promise to settle, then gives you an array of little report objects, one per input, in the original order. A fulfilled one is `{ status: "fulfilled", value }`, a rejected one is `{ status: "rejected", reason }`. So one failure doesn't sink the batch, and you never need a `.catch`.

② Same three promises, every result reported.

```js
const ok = (v, ms) =>
  new Promise((res) => setTimeout(() => res(v), ms));
const fail = (v, ms) =>
  new Promise((_, rej) => setTimeout(() => rej(v), ms));

Promise.allSettled([
  ok("users loaded", 10),
  fail("payments API down", 20),
  ok("settings loaded", 30),
]).then((results) => console.log(results));
```

## Promise.any resolves with the first one that succeeds

`Promise.any` gives you the first promise that *fulfils*, and ignores rejections along the way. So if the fast one fails, `any` doesn't care, it waits for the first success. Think of it as racing for a winner, where a loser dropping out doesn't end the race.

③ The first promise rejects, and `any` ignores it.

```js
const ok = (v, ms) =>
  new Promise((res) => setTimeout(() => res(v), ms));
const fail = (v, ms) =>
  new Promise((_, rej) => setTimeout(() => rej(v), ms));

Promise.any([
  fail("cache miss", 10),
  ok("from the database", 20),
  ok("from the backup", 30),
]).then((winner) => console.log("any resolved with:", winner));
```

## Promise.any only rejects when they all reject

The only way `Promise.any` rejects is if *every* promise rejects. And it doesn't hand you one reason, it hands you an `AggregateError`: a single error whose `.errors` property is the array of all the individual reasons.

④ Everything fails, so `any` rejects with an `AggregateError`.

```js
const fail = (v, ms) =>
  new Promise((_, rej) => setTimeout(() => rej(v), ms));

Promise.any([
  fail("cache down", 10),
  fail("database down", 20),
  fail("backup down", 30),
]).catch((err) => {
  console.log("name:", err.constructor.name);
  console.log("message:", err.message);
  console.log("errors:", err.errors);
});
```

## Promise.race settles on the first to settle, win or lose

`Promise.race` is the one to contrast `any` with. Race settles as soon as *any* promise settles, and it takes whatever that first one did. If the first to finish rejected, race rejects. Same inputs as the `any` demo above: the rejection lands first, so where `any` ignored it, race takes it.

⑤ The fastest promise rejected, so race rejects too.

```js
const ok = (v, ms) =>
  new Promise((res) => setTimeout(() => res(v), ms));
const fail = (v, ms) =>
  new Promise((_, rej) => setTimeout(() => rej(v), ms));

Promise.race([
  fail("cache miss", 10),
  ok("from the database", 20),
  ok("from the backup", 30),
])
  .then((first) => console.log("race resolved with:", first))
  .catch((err) => console.log("race rejected with:", err));
```

## The old way: escaping the executor

Sometimes you need a promise you can resolve from somewhere else, outside its executor function. The old trick was to declare a variable, then reach into the executor and assign the `resolve` function to it, so you can call it later. It works, but it's an awkward little dance.

⑥ Declare a variable, then smuggle `resolve` out of the executor.

```js
let resolveIt;
const promise = new Promise((resolve) => {
  resolveIt = resolve;
});

promise.then((value) => console.log("resolved with:", value));

resolveIt("done, at last");
```

## Promise.withResolvers: the same thing, without the dance

`Promise.withResolvers()` returns an object with three things: `{ promise, resolve, reject }`. You get the promise and both of its controls in one line, no executor to reach into. Same result as the block above, none of the ceremony.

⑦ One line, and you've got the promise plus its controls.

```js
const { promise, resolve, reject } = Promise.withResolvers();

promise.then((value) => console.log("resolved with:", value));

resolve("done, at last");
```

## The one line to remember

`allSettled` never rejects and reports every result, so one failure doesn't sink the batch. `any` gives you the first success and only rejects, with an `AggregateError`, when they all fail. And `withResolvers` hands you `{ promise, resolve, reject }`, so you never have to escape the executor again.
