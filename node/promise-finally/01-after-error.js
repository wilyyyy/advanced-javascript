// the .then throws, .catch catches, .finally still runs
Promise.resolve()
  .then(() => { throw new Error("the request failed"); })
  .catch((err) => console.log("caught:", err.message))
  .finally(() => console.log("cleaning up"));
