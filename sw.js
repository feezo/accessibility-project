//const cacheID = "mws-restaurant-001";
// Define the Caches
var staticCacheName = 'mws-restaurant-static-v';
// Set Get Random number for Cache ID
 var randomNumberBetween0and19999 = Math.floor(Math.random() * 20000);
 var cache_id = randomNumberBetween0and19999;
 staticCacheName += cache_id;











self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      // '/',
      return cache.addAll ([
        "/index.html",
        "/restaurant.html",
        "/css/styles.css",
        "/js",
        "/js/dbhelper.js",
        "/js/main.js",
        "js/restaurant_info.js",
        "/js/register.js"
      ]).catch(error => {
        console.log('Caches open failed')
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('mws-restaurant-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  let cacheRequest = event.request;
  let cacheUrlObj = new URL(event.request.url);
  if(event.request.url.indexOf('restaurant.html') > -1){
    const cacheURL = 'restaurant.html';
    cacheRequest = new Request(cacheURL)
  }
  if(cacheUrlObj.hostname !== 'localhost'){
    event.request.mode = 'no cors';
  }


event.respondWith(
  caches.match(cacheRequest).then(response => {
    return (
      response ||
      fetch(event.request)
      .then(fetchResponse => {
        return Caches.open(cacheID).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      })
    .catch(error => {
     return new Response("Application is not connected to the internet", {
       status: 404,
       statusText: "Application is not connected to the internet"
     });
    })
  );
  })
  );
});
