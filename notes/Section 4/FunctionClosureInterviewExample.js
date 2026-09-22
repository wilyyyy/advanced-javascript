/** 
 * This example demonstrates a common closure interview question.
 * The loop creates functions that return the value of `i`.
 * However, due to `var` scoping, all functions will return 10.
 */
/**
var foo = [];

for (var i = 0; i < 10; i++) {
  foo[i] = function() {return i; };
}

console.log(foo[0]());
console.log(foo[1]());
console.log(foo[2]());

this prints out 

10
10
10
 */

var foo = [];

for (var i = 0; i < 10; i++) {
  (function (j){
    foo[j] = function() {return j; };
  })(i);
}

console.log(foo[0]());
console.log(foo[1]());
console.log(foo[2]());

// modern approach using `let` instead of `var`
// var foo = [];

// for (let i = 0; i < 10; i++) {
//   foo[i] = function() {return i; };
// }

// console.log(foo[0]());
// console.log(foo[1]());
// console.log(foo[2]());
