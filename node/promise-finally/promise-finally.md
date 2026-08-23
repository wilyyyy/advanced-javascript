# What does Promise.finally do?

You already have `.then` for success and `.catch` for failure. `finally` is the third one: a block that runs after the promise settles, no matter which way it went. It is the promise version of try / catch / finally, and it is for cleanup.

Select a code block and press **F8** to run it. Output shows in the Output panel.

## finally runs after an error

Here a promise throws in its `.then`, the `.catch` handles it, and `.finally` runs at the end to clean up.

```js
Promise.resolve()
  .then(() => { throw new Error("the request failed"); })
  .catch((err) => console.log("caught:", err.message))
  .finally(() => console.log("cleaning up"));
```

## finally runs after a success too

Same chain, but nothing throws. `.then` handles the value, and `.finally` still runs. That is the whole point: it runs either way.

```js
Promise.resolve("some data")
  .then((val) => console.log("got:", val))
  .finally(() => console.log("cleaning up"));
```

## finally gets nothing, and passes the value through

This is the part that separates people. `.finally` is handed no argument (it is not `.then`, it does not see the value, and it is not `.catch`, it does not see the error). And it passes whatever came before straight through, so the chain carries on with the original value.

```js
Promise.resolve(42)
  .finally((x) => console.log("finally sees:", x))
  .then((val) => console.log("value still here:", val));
```

## The one line to remember

`.then` is for the value, `.catch` is for the error, `.finally` is for cleanup that has to happen either way. It sees neither the value nor the error, and it never swallows them.
