// Define the Caches
var staticCacheName = 'mws-restaurant-static-v';

//  Get Random number for Cache ID
 var randomNumberBetween0and19999 = Math.floor(Math.random() * 20000);
 var cache_id = randomNumberBetween0and19999;
 staticCacheName += cache_id;

 self.addEventListener('install', event => {
   event.waitUntil(
     caches.open(staticCacheName).then(cache => {
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


 // event.respondWith(
 //     // First we have to open a specific cache.
 //     caches.open(staticCacheName).then((cache) => {
 //       // Then we try to match the request url within cache.
 //       return cache.match(cacheRequest.url).then((response) => {
 //         // If we match the url within cache, return the cached response.
 //         if (response) return response;
 //
 //         // If url was not matched we try to request it over the netrwork.
 //         return fetch(cacheRequest).then((fetchResponse) => {
 //           // If fetch was successfull we store the response clone in cache.
 //           cache.put(cacheRequest.url, fetchResponse.clone());
 //           // After storing it in cache we return the original response.
 //           return fetchResponse;
 //         })
 //         .catch(error => {
 //           // If fetch failed we respond with an error.
 //           return new Response("Application is not connected to the internet", {
 //             status: 404,
 //             statusText: "Application is not connected to the internet"
 //           });
 //         });
 //       });
 //     })
 //   )
