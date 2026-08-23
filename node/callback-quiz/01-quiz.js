// quiz: fix this code so it does not error out
function doAsyncTask(cb) {
  console.log("Async Task Calling Callback");
  cb();
}

doAsyncTask(() => console.log(message));

// this must stay the last line of the file
message = "Callback Called";
