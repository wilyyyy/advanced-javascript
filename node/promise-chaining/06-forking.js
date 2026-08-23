// two .then on the SAME promise: a fork, not a chain
const promise = Promise.resolve("done");
promise.then((val) => {
  console.log(val);
  return "done 2";
});
promise.then((val) => console.log(val));
