// reassign a inside foo: the caller's a is untouched
var a = { moo: 2 };

function foo(a) {
  a = { two: 'moo' };
}

foo(a);
console.log(a);
