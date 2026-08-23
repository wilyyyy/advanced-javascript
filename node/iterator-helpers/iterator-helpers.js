// What are iterator helpers?
// One DevTools snippet, built up block by block.
// Each experiment is wrapped in its own { } so the whole thing runs as one script: the block scope keeps the repeated const result / function* naturals from colliding.
// Paste a block, Cmd+Enter to run the whole snippet, read the newest lines at the bottom.

// ① the helpers live on iterators now: map and filter straight on a Set
{
const ids = new Set([1, 2, 3, 4, 5, 6]);

const result = ids.values()       // an iterator, not an array
  .map((n) => n * 2)              // map, straight on the iterator
  .filter((n) => n > 6)           // filter, straight on the iterator
  .toArray();                     // pull it into a real array

console.log(result);
}

// ② take and drop: grab some, skip some
{
  const letters = ["a", "b", "c", "d", "e", "f"];

  console.log(letters.values().take(3).toArray());   // first three
  console.log(letters.values().drop(3).toArray());   // skip the first three
}

// ③ laziness: chaining over a sequence that never ends
{
  function* naturals() {
    let i = 1;
    while (true) yield i++;         // 1, 2, 3, ... forever
  }

  const result = naturals()
    .map((n) => n * n)             // square every one
    .filter((n) => n % 2 === 1)    // keep the odd squares
    .take(5)                       // stop after five
    .toArray();                    // pull those five through

  console.log(result);
}

// ④ the receipt: lazy pulls what it needs, eager computes everything
{
  let lazyCalls = 0;
  function* naturals() {
    let i = 1;
    while (true) yield i++;
  }
  naturals()
    .map((n) => {
      lazyCalls++;
      return n * n;
    })
    .filter((n) => n % 2 === 1)
    .take(5)
    .toArray();

  let eagerCalls = 0;
  const range = Array.from({ length: 1000 }, (_, i) => i + 1);
  range
    .map((n) => {
      eagerCalls++;
      return n * n;
    })
    .filter((n) => n % 2 === 1)
    .slice(0, 5);

  console.log("lazy map calls: ", lazyCalls);
  console.log("eager map calls:", eagerCalls);
}
