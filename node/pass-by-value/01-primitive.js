// a is a primitive: foo is handed a COPY of it
var a = 1;

function foo(a) {
}

foo(a);
console.log(a);
