var asim = {
  checkThis: function () {
    const checkOther = () => {
      console.log(this);
    };

    checkOther();
  }
};

asim.checkThis(); // logs asim