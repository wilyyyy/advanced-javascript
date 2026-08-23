// How does event delegation work?
// One DevTools snippet, built up block by block. It builds its own list in the page, so run it in the browser console (this is DOM and events), on any page or about:blank. Not a node run.
// `list` and `newItem` are vars so re-running the whole snippet on Cmd+Enter never complains about redeclaring.
// Recording protocol: each shot, select everything from the top of this file down through block N,
// then in the snippet select all, delete, paste, Cmd+Enter. Nothing else to add: no braces.

// ① a little list to play with
document.getElementById("fruit")?.remove();
var list = document.createElement("ul");
list.id = "fruit";
["apples", "pears", "plums"].forEach((t) => {
  const li = document.createElement("li");
  li.textContent = t;
  list.append(li);
});
document.body.append(list);

// ② ONE listener on the parent handles every item, now and later
list.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (li) {
    console.log("clicked:", li.textContent,
      "| target was:", e.target.tagName);
  }
});

// ③ click an item (simulated). the single parent listener catches it
list.children[1].click(); // pears

// ④ add a brand new item LATER. still works, no new listener
var newItem = document.createElement("li");
newItem.textContent = "cherries";
list.append(newItem);
newItem.click();

// ⑤ nested content: target is the inner tag, closest("li") still finds the item
list.children[0].innerHTML = "apples <b>(fresh)</b>";
list.querySelector("b").click();
