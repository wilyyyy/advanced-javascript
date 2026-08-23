// What are let and const, and what is the temporal dead zone?
// One DevTools snippet, built up block by block.
// Each experiment is wrapped in its own { } so the whole thing runs as one script.
// The blocks that throw on purpose (① as let, ③ the TDZ, ④ the const reassign) are wrapped in try/catch and print the caught error, so one raw throw can't abort every block below it in the single snippet. Blocks ① and ⑥ hold the initial var versions; the var-to-let edits are done live on camera.
// Paste a block, Cmd+Enter to run the whole snippet, read the newest lines at the bottom.

// ① var ignores blocks: it's scoped to the function, not the block
{
  try {
    if (true) {
      var a = 1;
    }
    console.log(a);
  } catch (e) {
    console.log(e.constructor.name + ": " + e.message);
  }
}

// ② var hoisting: use it before you declare it
{
  console.log(x);
  var x = 5;
}

// ③ the temporal dead zone: use a let before you declare it
{
  try {
    console.log(y);
    let y = 5;
  } catch (e) {
    console.log(e.constructor.name + ": " + e.message);
  }
}

// ④ const is a constant binding, not a frozen value
{
  try {
    const person = { name: "asim" };
    person.name = "zanete";
    console.log(person.name);
    person = {};
  } catch (e) {
    console.log(e.constructor.name + ": " + e.message);
  }
}

// ⑤ Object.freeze: locking the value itself
{
  const p2 = Object.freeze({ name: "asim" });
  p2.name = "zanete"; // change a property on the frozen object
  console.log(p2.name);

  const team = Object.freeze({ lead: { name: "asim" } });
  team.lead.name = "zanete"; // change a property one level down
  console.log(team.lead.name);
}

// ⑥ the loop: three timeouts, each logging i
{
  for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
  }
}
