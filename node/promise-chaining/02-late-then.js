// already resolved; a late .then still fires
const promise = Promise.resolve("done");
promise.then((val) => console.log(val));
