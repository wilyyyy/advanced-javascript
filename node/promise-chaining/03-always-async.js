// always asynchronous: message is set at the bottom
function doAsyncTask() {
  return Promise.resolve();
}

doAsyncTask().then(() => console.log(message));

var message = "promise resolved";
