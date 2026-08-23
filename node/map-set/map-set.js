// How do you use Map and Set?
// One DevTools snippet, built up block by block.
// Each experiment is wrapped in its own { } so the whole thing runs as one script: the block scope keeps the repeated const first / second / scores / map from colliding.
// Paste a block, Cmd+Enter to run the whole snippet, read the newest lines at the bottom.

// ① map: set, get, and any key type
{
  const m = new Map();
  m.set("name", "asim");   // string key
  m.set(1, "one");         // number key
  m.set(true, "yes");      // boolean key

  console.log(m.get("name"));   // read back with get(key)
  console.log(m.get(1));        // the number key
  console.log(m.size);          // a property, no brackets
}

// ② an object as a key on a plain object: the collision
{
  const first = { id: 1 };
  const second = { id: 2 };

  const scores = {};
  scores[first] = 10;
  scores[second] = 20;

  console.log(scores);
  console.log(scores[first]);
  console.log(Object.keys(scores).length);
}

// ③ the same two objects, but a Map keys on identity
{
  const first = { id: 1 };
  const second = { id: 2 };

  const scores = new Map();
  scores.set(first, 10);    // keyed on the actual reference
  scores.set(second, 20);   // a different reference, a different key

  console.log(scores.get(first));
  console.log(scores.get(second));
  console.log(scores.size);
}

// ④ iterating a map: for...of and spread
{
  const stock = new Map();
  stock.set("apples", 3);
  stock.set("pears", 5);
  stock.set("figs", 2);

  for (const [item, qty] of stock) {   // each entry is a [key, value] pair
    console.log(item, qty);
  }

  console.log([...stock]);   // spread to an array of pairs
}

// ⑤ set: unique values, and dedupe
{
  const tags = ["js", "css", "js", "html", "css", "js"];
  const unique = [...new Set(tags)];
  console.log(unique);

  const seen = new Set();
  seen.add("asim");
  seen.add("asim");
  console.log(seen.size);
  console.log(seen.has("asim"));
  seen.delete("asim");
  console.log(seen.has("asim"));
}

// ⑥ why not just an object? no inherited keys, honest size
{
  const obj = {};
  console.log("toString" in obj);
  console.log(Object.keys(obj).length);

  const map = new Map();
  console.log(map.has("toString"));
  console.log(map.size);
}

// ⑦ converting back: fromEntries and spread
{
  const map = new Map([["asim", 10], ["zanete", 20]]);
  console.log(Object.fromEntries(map));   // Map to a plain object

  const set = new Set(["a", "b", "c"]);
  console.log([...set]);                  // Set to an array
}
