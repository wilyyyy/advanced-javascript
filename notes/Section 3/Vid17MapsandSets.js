const m = new Map();
m.set("name", "William"); // key, value. string key
m.set(1, "one"); // number key
m.set(true, "yes"); // boolean key

console.log(m.get("name")); // read back with get (key)
console.log(m.get(1)); // read back with get (key) but with a number
console.log(m.size); // length of the map


// -----------------------

const first = { id: 1 };
const second = { id: 2 };

const scores = new Map();
scores.set(first, 10); // keyed on actual reference
scores.set(second, 20); // a different reference, a different key

console.log(scores.get(first)); // read back the score for the first object
console.log(scores.get(second)); // read back the score for the second object
console.log(scores.size); // length of the scores map