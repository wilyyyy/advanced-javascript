// the same holds for every primitive type
var a = true;

function foo(a) {
  a = false;
}

foo(a);
console.log(a);
