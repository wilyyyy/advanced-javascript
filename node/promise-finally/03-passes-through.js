// finally gets nothing, and passes the value through
Promise.resolve(42)
  .finally((x) => console.log("finally sees:", x))
  .then((val) => console.log("value still here:", val));
