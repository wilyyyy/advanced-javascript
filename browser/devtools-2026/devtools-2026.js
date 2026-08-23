// How do I run JavaScript in Chrome DevTools in 2026?
// A THIN snippet. Most of this lecture is a live tour of the console and DevTools UI (the $ helpers, $0, live expressions, the Network tab), which you do against a real page, not from a snippet. These are the two self-contained bits worth pasting.
// Paste a block, Cmd+Enter, read the console.

// ① the console echoes the result of an expression, no console.log needed (this is a REPL behaviour: a plain node run prints nothing here, DevTools shows 1024)
2 ** 10;

// ② console.table lays an array of objects out as a real, sortable table
{
  const users = [
    { id: 1, name: "asim" },
    { id: 2, name: "zanete" },
  ];
  console.table(users);
}
