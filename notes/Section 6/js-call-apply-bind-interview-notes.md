# JavaScript `.call()`, `.apply()`, and `.bind()`

These methods let you explicitly set `this` for a **regular function**. `this` becomes the first argument you pass to the method.

| Method | Main use | Syntax | Runs immediately? |
| --- | --- | --- | --- |
| `.call()` | Call a function with a chosen `this`. | `fn.call(thisArg, arg1, arg2)` | Yes |
| `.apply()` | Call a function with a chosen `this` when arguments are in an array. | `fn.apply(thisArg, [arg1, arg2])` | Yes |
| `.bind()` | Create a function with a fixed `this` for later use. | `fn.bind(thisArg, arg1, arg2)` | No; returns a function |

## `.call()`

**Main use:** Invoke a function now, setting `this` to an object you choose. Pass other arguments one by one.

**Interview use case: borrowing a method from another object**

```js
const person = {
  name: "William",
  introduce(greeting) {
    return `${greeting}, I'm ${this.name}`;
  },
};

const interviewer = { name: "Alex" };

person.introduce.call(interviewer, "Hi"); // "Hi, I'm Alex"
```

`this` inside `introduce` is `interviewer`, because `.call(interviewer, ...)` explicitly sets it.

## `.apply()`

**Main use:** Invoke a function now with a chosen `this`, passing its arguments as an array or array-like object.

**Interview use case: arguments already collected in an array**

```js
function describeJob(title, level) {
  return `${this.company}: ${level} ${title}`;
}

const employer = { company: "Autodesk" };
const details = ["Developer", "Backend"];

describeJob.apply(employer, details); // "Autodesk: Backend Developer"
```

`this` is `employer`; `details[0]` becomes `title` and `details[1]` becomes `level`. In modern JavaScript, `describeJob.call(employer, ...details)` is often easier to read.

## `.bind()`

**Main use:** Return a new function with `this` fixed, so you can call or pass it around later.

**Interview use case: keeping `this` when passing an object method as a callback**

```js
const candidate = {
  name: "William",
  introduce() {
    console.log(`I'm ${this.name}`);
  },
};

const callback = candidate.introduce.bind(candidate);
setTimeout(callback, 1000); // Later: "I'm William"
```

Without `.bind(candidate)`, `setTimeout` calls the extracted method without `candidate` as its receiver. `.bind(candidate)` creates a new function whose `this` stays `candidate`.

## Interview answer to memorize

> `.call()` and `.apply()` immediately invoke a regular function with an explicit `this`. `.call()` takes arguments individually; `.apply()` takes them in an array. `.bind()` returns a new function with `this` fixed for later calls.

**Exception:** Arrow functions get `this` from their surrounding scope. These three methods cannot change an arrow function's `this`.
