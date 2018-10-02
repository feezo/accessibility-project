// set up service worker
if ("serviceWorker" in navigator){
  navigator.serviceWorker.register("/sw.js")
  .then(reg => {
    console.log("service worker registration is successful" + reg.scope);
  })
  .catch(error => {
    console.log("registration failed" + error);
  })
}
