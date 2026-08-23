// whatever the first .then returns is passed on
Promise.resolve("done")
  .then((val) => {
    console.log(val);
    return "done 2";
  })
  .then((val) => console.log(val));
