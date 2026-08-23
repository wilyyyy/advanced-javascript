// change a inside foo: only the copy changes
var a = 1;

function foo(a) {
  a = 2;
}

foo(a);
console.log(a);
