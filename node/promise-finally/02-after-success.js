// nothing throws this time, .finally still runs
Promise.resolve("some data")
  .then((val) => console.log("got:", val))
  .finally(() => console.log("cleaning up"));
