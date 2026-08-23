// same chain, but the first .then returns nothing
Promise.resolve("done")
  .then((val) => {
    console.log(val);
    // return "done 2";
  })
  .then((val) => console.log(val));
