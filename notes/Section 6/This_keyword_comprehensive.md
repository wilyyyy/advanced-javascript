# JavaScript `this`: How the call determines its value

## The core idea

For a **regular function**, JavaScript determines `this` when the function is **called**. The function does not permanently remember the object where it was defined or found.

Think of the difference as:

- `asim.checkThis()` → “Call this function **through `asim`**.”
- `func()` → “**Just call the function**.”

```js
var asim = {
  checkThis: function () {
    console.log(this);
  },
};

asim.checkThis(); // this is asim

var func = asim.checkThis;
func(); // this is undefined in strict mode
```

`var func = asim.checkThis` copies a **reference to the function**, without binding `asim` to it. They point to the same function:

```js
console.log(func === asim.checkThis); // true
```

Each call supplies its own `this`. In a browser classic script without strict mode, the standalone `func()` uses `window`. In strict mode, including JavaScript modules, it uses `undefined`.

## Ways `this` gets its value

Listed roughly from most common to least common.

### 1. Called through an object: `object.method()`

The object used to make the call becomes `this`.

```js
const asim = {
  name: "Asim",
  checkThis() {
    console.log(this.name);
  },
};

asim.checkThis(); // "Asim" — this is asim

const other = { name: "Other", checkThis: asim.checkThis };
other.checkThis(); // "Other" — this is other
```

The same function can have a different `this` depending on the object that calls it. For a chain, use the object immediately before the call:

```js
const wrapper = { person: asim };
wrapper.person.checkThis(); // this is asim, not wrapper
```

### 2. Called alone: `func()`

No object supplies `this`.

```js
const check = asim.checkThis;
check(); // this is undefined in strict mode
```

In a browser classic script without strict mode, `this` becomes `window`. This is why extracting a method often changes its behavior.

### 3. Set explicitly: `call`, `apply`, and `bind`

`call` and `apply` run the function immediately. `bind` creates a **new function** whose `this` is fixed for later calls.

```js
function greet(greeting) {
  console.log(`${greeting}, ${this.name}`);
}

const person = { name: "Asim" };

greet.call(person, "Hi");      // "Hi, Asim"
greet.apply(person, ["Hello"]); // "Hello, Asim"

const boundGreet = greet.bind(person);
boundGreet("Hey");            // "Hey, Asim"
```

A bound function keeps its bound `this` even if you call it through another object. A call with `new` is an exception: it creates a new instance for `this`.

### 4. Called as a constructor: `new FunctionName()`

`new` creates an object and makes it `this` inside a regular constructor function.

```js
function Person(name) {
  this.name = name;
}

const person = new Person("Asim");
console.log(person.name); // "Asim"
```

### 5. Arrow function: `this` comes from its surroundings

An arrow function has **no `this` of its own**. It uses the `this` from the surrounding scope where it was created. Calling the arrow through another object, or using `call`, does not replace that value.

```js
const asim = {
  name: "Asim",
  makeArrow() {
    return () => console.log(this.name);
  },
};

const arrow = asim.makeArrow(); // makeArrow's this is asim
arrow();                       // "Asim"
arrow.call({ name: "Other" }); // still "Asim"
```

Be careful: an arrow placed directly in an object literal does **not** receive that object's `this` just because it appears inside the object.

### 6. An API calls your callback

When you pass a regular function to an API, check how **that API** invokes it. For example, a DOM event listener calls a regular function with `this` set to the element handling the event.

```js
button.addEventListener("click", function (event) {
  console.log(this === event.currentTarget); // true
});
```

An arrow callback would retain its surrounding `this` instead.

## Quick decision guide

1. **Arrow function?** Use the surrounding `this` from where it was created.
2. **Bound function?** Use the value fixed by `bind` (except when constructed with `new`).
3. **Called with `new`?** Use the newly created instance.
4. **Called with `call` or `apply`?** Use the explicitly supplied value.
5. **Called as `object.method()`?** Use `object`.
6. **Otherwise called as `func()`?** Use `undefined` in strict mode, or the global object in non-strict mode.

**Interview takeaway:** For a regular function, inspect the expression that actually **calls** it, not the object where it was originally stored.
