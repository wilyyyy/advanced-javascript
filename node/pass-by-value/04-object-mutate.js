// an object: change a PROPERTY through the copy
var a = {};

function foo(a) {
  a.moo = false;
}

foo(a);
console.log(a);
