// set up service worker
if ("serviceWorker" in navigator){
  navigator.serviceWorker.register("/sw.js" , {scope: "/" })
  .then(reg => {
    console.log("service worker registration is successful: " + reg.scope);
  })
  .catch(error => {
    console.log("registration failed: " + error);
  })
}
