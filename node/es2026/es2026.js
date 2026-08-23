// What's in ES2026, and what's coming next?
// Run the whole file: `node es2026.js`.
// Each of the four ES2026 wins gets its own block, and each block PROVES itself: it shows the
// old way first, then the new one, so you can see what the feature actually buys you.
// Two of the four are still landing in runtimes. Rather than pretend, each block checks for the
// feature and tells you what it found, so this file runs today and gets better as your Node
// catches up. Node 24 has Error.isError and RegExp.escape outright; it has the Base64 methods
// behind `node --js-base-64 es2026.js`, and Math.sumPrecise not yet.

// ① Error.isError: a check that holds up across realms
// instanceof asks "was this made by MY Error constructor?". A worker, an iframe or a vm context
// has its own, so a perfectly real Error from over there fails the test. isError asks the only
// question you meant: is this an Error at all.
{
  const vm = require("node:vm");
  const fromOverThere = vm.runInNewContext("new Error('from another realm')");

  console.log("① instanceof says:", fromOverThere instanceof Error);   // false, and it IS an Error
  console.log("① Error.isError says:", Error.isError(fromOverThere));

  console.log("① a plain lookalike:", Error.isError({ name: "Error", message: "not really" }));
}

// ② RegExp.escape: stop hand-rolling the escape regex
// Building a pattern out of user input is the classic footgun: any regex metacharacter in the
// string quietly changes what you match. Everyone has copy-pasted the same replace() for this.
{
  const typed = "1 + 1 (really?)";

  const handRolled = typed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");   // the one you have pasted
  console.log("② hand rolled:", handRolled);
  console.log("② RegExp.escape:", RegExp.escape(typed));

  const pattern = new RegExp(RegExp.escape(typed));
  console.log("② matches literally:", pattern.test("what is 1 + 1 (really?)"));
}

// ③ Base64 on a Uint8Array, both directions
// The old route goes through a string: btoa, atob, charCodeAt, a map, a spread. The new one is
// a method on the bytes themselves, which is where it always belonged.
{
  const bytes = new TextEncoder().encode("hello");

  const oldWay = btoa(String.fromCharCode(...bytes));
  console.log("③ the old gymnastics:", oldWay);

  if (typeof bytes.toBase64 === "function") {
    console.log("③ bytes.toBase64():", bytes.toBase64());
    console.log("③ back again:", new TextDecoder().decode(Uint8Array.fromBase64(oldWay)));
  } else {
    console.log("③ toBase64 is not in this runtime yet. On Node 24 try: node --js-base-64 es2026.js");
  }
}

// ④ Math.sumPrecise: add floats and get the right answer
// Adding left to right loses bits at every step. sumPrecise sums the list exactly and rounds
// once, at the end, which is the answer you meant all along.
{
  const values = [0.1, 0.2, 0.3];

  console.log("④ reduce:", values.reduce((a, b) => a + b, 0));   // 0.6000000000000001

  if (typeof Math.sumPrecise === "function") {
    console.log("④ Math.sumPrecise:", Math.sumPrecise(values));
  } else {
    console.log("④ Math.sumPrecise is not in this runtime yet. It is the newest of the four.");
  }
}

// ⑤ What is on the 2027 train, and why
// Temporal and the `using` keyword both reached Stage 4 in early 2026, so by the yearly rule
// they join the edition AFTER the one they landed in. Stage 4 is not "shipped everywhere",
// though, and these two show the gap from opposite ends: Node 24 already runs `using`, and
// Temporal is still not here.
// The `using` half is a feature check rather than a demonstration on purpose. `using` is SYNTAX,
// so a runtime without it would refuse this whole file at parse time, and then none of the four
// blocks above would run either. Try it yourself in a file of its own:
//   { using handle = { [Symbol.dispose]() { console.log("cleaned up"); } }; }
{
  console.log("⑤ Temporal here yet?", typeof globalThis.Temporal !== "undefined");
  console.log("⑤ Symbol.dispose, which `using` calls:", typeof Symbol.dispose !== "undefined");
}
