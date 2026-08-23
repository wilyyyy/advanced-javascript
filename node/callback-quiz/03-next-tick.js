// fix two: defer the callback with process.nextTick
function doAsyncTask(cb) {
  console.log("Async Task Calling Callback");
  process.nextTick(() => cb());
}

doAsyncTask(() => console.log(message));

message = "Callback Called";
