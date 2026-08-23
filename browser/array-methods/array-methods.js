// What are the modern array methods?
// One DevTools snippet, built up block by block.
// Each experiment is wrapped in its own { } so the whole thing runs as one script: the block scope keeps the repeated const scores / const nums from colliding.
// Paste a block, Cmd+Enter to run the whole snippet, read the newest lines at the bottom.

// ① at: reach into an array from either end
{
  const scores = [10, 20, 30, 40];

  console.log(scores[-1]);
  console.log(scores.at(-1));   // at() counts back from the end
  console.log(scores.at(-2));   // second from the end
}

// ② findLast: search from the back
{
  const nums = [5, 12, 8, 3, 18, 7];

  console.log(nums.find((n) => n > 10));           // first match from the front
  console.log(nums.findLast((n) => n > 10));       // first match from the back
  console.log(nums.findLastIndex((n) => n > 10));  // and its index
}

// ③ sort: what happens to the array you gave it
{
  const scores = [30, 10, 20];

  const sorted = scores.sort();
  console.log("returned:", sorted);
  console.log("original:", scores);
}

// ④ sort with no comparator
{
  const nums = [1, 5, 10, 2, 25];

  console.log(nums.sort());
}

// ⑤ sort with a comparator
{
  const nums = [1, 5, 10, 2, 25];

  console.log(nums.sort((a, b) => a - b));
}

// ⑥ toSorted and toReversed: the copying versions
{
  const scores = [30, 10, 20];

  const sorted = scores.toSorted((a, b) => a - b);   // same comparator as sort
  console.log("sorted copy:", sorted);
  console.log("original:  ", scores);

  console.log("reversed copy:", scores.toReversed());
  console.log("original:     ", scores);
}

// ⑦ the rest, briefly: flat, flatMap, groupBy
{
  console.log([1, [2, 3], [4, [5, 6]]].flat());           // one level deep by default
  console.log([1, [2, 3], [4, [5, 6]]].flat(Infinity));   // all the way down
  console.log([1, 2, 3].flatMap((n) => [n, n * 2]));      // map, then flatten one level

  const people = [
    { name: "asim", team: "js" },
    { name: "zanete", team: "knits" },
    { name: "moo", team: "js" },
  ];
  console.log(Object.groupBy(people, (p) => p.team));     // was Array.prototype.group
}
