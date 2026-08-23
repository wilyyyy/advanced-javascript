// fix one: defer the callback with setImmediate
function doAsyncTask(cb) {
  console.log("Async Task Calling Callback");
  setImmediate(() => cb());
}

doAsyncTask(() => console.log(message));

message = "Callback Called";
