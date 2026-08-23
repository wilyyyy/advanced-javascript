// What are Symbols and BigInt?
// One DevTools snippet, built up block by block.
// Each experiment is wrapped in its own { } so the whole thing runs as one script: the block scope keeps the repeated const id from colliding, and the mixing TypeError stays in a try/catch so it prints instead of aborting the blocks below it.
// Paste a block, Cmd+Enter to run the whole snippet, read the newest lines at the bottom.

// ① Symbol: a guaranteed-unique value
{
  const id1 = Symbol("id");
  const id2 = Symbol("id");

  console.log(typeof id1);
  console.log(id1.description);
  console.log(id1 === id2);
}

// ② Symbol: a key that cannot clash
{
  const id = Symbol("id");

  const user = {
    name: "asim",
    id: "some string id",   // an ordinary string key called "id"
    [id]: 42,               // a symbol key, computed with square brackets
  };

  console.log(user.id);            // the string key
  console.log(user[id]);           // the symbol key
  console.log(Object.keys(user));
  console.log(JSON.stringify(user));
}

// ③ Symbol: the well-known ones
{
  const range = {
    from: 1,
    to: 3,
    *[Symbol.iterator]() {   // a method under the well-known Symbol.iterator key
      for (let n = this.from; n <= this.to; n++) yield n;
    },
  };

  console.log([...range]);   // spread the range object
}

// ④ BigInt: when Number runs out of road
{
  console.log(Number.MAX_SAFE_INTEGER);   // the largest integer Number can trust

  console.log(9007199254740991 + 1);
  console.log(9007199254740991 + 2);
}

// ⑤ BigInt: the n suffix is exact
{
  console.log(9007199254740991n + 1n);   // the n suffix makes it a BigInt
  console.log(9007199254740991n + 2n);
  console.log(typeof 10n);
}

// ⑥ BigInt: do not mix the two
{
  try {
    console.log(10n + 5);   // mixing a BigInt and a Number
  } catch (err) {
    console.log(err.constructor.name + ":", err.message);
  }
}

// ⑦ BigInt: convert one side first
{
  console.log(10n + BigInt(5));   // wrap the Number in BigInt()
}
