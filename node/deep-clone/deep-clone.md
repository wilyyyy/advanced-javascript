# Exercise: implement deep clone

Copy an object so that nothing is shared with the original. A shallow copy (spread or `Object.assign`) only copies the top level, so any nested object is still the same object, shared between the two. Deep clone recurses all the way down, so the copy stands entirely on its own. The primitive underneath is recursion, plus a `typeof` check to tell an object from a primitive.

Select a code block and press **F8** to run it. Output shows in the Output panel.

## The trap: a shallow copy still shares its nested objects

A spread looks like a full copy, but it only copies the top layer. The nested `address` object is the same object in both. Change a top-level field and you are fine. Change a nested one and you have quietly changed the original too.

① Rename is safe. Change the nested city, and watch the original.

```js
const original = {
  name: "asim",
  address: { city: "london" },
};

const copy = { ...original };   // a shallow copy: spread only goes one level deep

copy.name = "zanete";           // a top-level change, safe
copy.address.city = "paris";    // a nested change, watch the original

console.log("copy.name:    ", copy.name);
console.log("original.name:", original.name);
console.log("copy.city:    ", copy.address.city);
console.log("original.city:", original.address.city);
```

## The fix: recurse, and copy every level

`deepClone` calls itself all the way down. Primitives come back as-is. An array is rebuilt with every element cloned. An object is rebuilt with every value cloned. Nothing that was nested is ever shared.

② Change the clone's nested object and array. The original stays put.

```js
function deepClone(value) {
  // primitives copy as-is: string, number, boolean, null, undefined
  if (value === null || typeof value !== "object") {
    return value;
  }

  // an array? rebuild it, cloning every element
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item));
  }

  // an object? rebuild it, cloning every value
  const result = {};
  for (const key of Object.keys(value)) {
    result[key] = deepClone(value[key]);
  }
  return result;
}

const original = {
  name: "asim",
  address: { city: "london" },
  hobbies: ["code", "coffee"],
};

const copy = deepClone(original);

copy.address.city = "paris";    // change the clone's nested object
copy.hobbies.push("cats");      // and the clone's nested array

console.log("copy.city:       ", copy.address.city);
console.log("original.city:   ", original.address.city);
console.log("copy.hobbies:    ", copy.hobbies);
console.log("original.hobbies:", original.hobbies);
```

## One step further: the built-in, and the circular case

`structuredClone` is the modern built-in that does all of this for you. It also handles a case our hand-written version cannot: a circular reference, an object that points back at itself. The naive recursion follows the loop forever and blows the stack. `structuredClone` walks it safely.

③ The built-in clones cleanly, survives the loop, and keeps the circular link.

```js
function deepClone(value) {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((item) => deepClone(item));
  const result = {};
  for (const key of Object.keys(value)) result[key] = deepClone(value[key]);
  return result;
}

// the built-in does the whole job, no hand-written recursion
const original = { name: "asim", address: { city: "london" } };
const copy = structuredClone(original);
copy.address.city = "paris";
console.log("built-in clone, original.city:", original.address.city);

// a circular reference: an object that points back at itself
const loop = { name: "asim" };
loop.self = loop;

try {
  deepClone(loop);
} catch (err) {
  console.log("our deepClone:  ", err.name);
}

const safe = structuredClone(loop);
console.log("structuredClone:", safe.self === safe);
```

## The one line to remember

A shallow copy shares its nested objects. Deep clone recurses so nothing is shared, and `structuredClone` is the built-in that does it, circular references and all. </content> </invoke>
