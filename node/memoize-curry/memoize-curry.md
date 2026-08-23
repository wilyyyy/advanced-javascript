# Exercise: implement memoize and curry

Two function transformers that come up together in interviews. A memoize wrapper, so a slow function never does the same work twice. A curry wrapper, so you can lock in some arguments now and pass the rest later. Both are closures underneath, which is the whole hint.

Select a code block and press **F8** to run it. Output shows in the Output panel.

## memoize, the problem: paying for the same answer twice

Here is a function doing some expensive work. The counter lets us see how many times it actually runs. We call it three times, with the same argument.

① Same input, three times. How many times does the expensive work run?

```js
let work = 0;
function slowSquare(n) {
  work++;            // count every real computation
  return n * n;      // pretend this is slow: a database call, a heavy sum
}

console.log(slowSquare(9));
console.log(slowSquare(9));
console.log(slowSquare(9));
console.log("work ran:", work);
```

## memoize, the fix: remember what you worked out

memoize takes a function and hands back a smarter version. Inside, a cache. Every call, check the cache first: seen this argument before, hand back the stored answer and skip the work.

② Same three calls, but now the work runs once.

```js
function memoize(fn) {
  const cache = new Map();
  return function (n) {
    if (cache.has(n)) return cache.get(n);   // seen it? hand back the stored answer
    const result = fn(n);                    // new one? do the work, just once
    cache.set(n, result);                    // and remember it for next time
    return result;
  };
}

let work = 0;
function slowSquare(n) {
  work++;
  return n * n;
}

const fastSquare = memoize(slowSquare);
console.log(fastSquare(9));
console.log(fastSquare(9));
console.log(fastSquare(9));
// try it: add console.log(fastSquare(4)) above this line and watch work go to 2
console.log("work ran:", work);
```

## curry, the problem: passing the same thing every time

A little log function. It takes a level and a message. Watch the first argument: it is "ERROR" every single time.

③ Same first argument, over and over.

```js
function log(level, message) {
  return `[${level}] ${message}`;
}

console.log(log("ERROR", "disk full"));
console.log(log("ERROR", "out of memory"));
console.log(log("ERROR", "connection lost"));
```

## curry, the fix: lock in some arguments now, the rest later

curry takes a function and collects arguments until it has enough to run. "Enough" is `fn.length`, the number of parameters the function was written with. log has two, so curry runs the moment the second one arrives.

④ Lock in "ERROR" once, then only ever pass the message.

```js
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);   // enough args? run it
    return (...more) => curried(...args, ...more);      // not yet? collect more, then try again
  };
}

function log(level, message) { return `[${level}] ${message}`; }

const curriedLog = curry(log);
const logError = curriedLog("ERROR");   // lock "ERROR" in, once
console.log(logError("disk full"));
console.log(logError("out of memory"));
```

## The one line to remember

Both are closures holding on to something between calls. memoize remembers a result. curry remembers an argument.
