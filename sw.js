var APP_PREFIX = 'todoapp'     // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = 'version_05'              // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [    
  'https://j-m-c-b.github.io/todo',                        // Add URL you want to cache in this list.
'https://j-m-c-b.github.io/todo/',                // If you have separate JS/CSS files,
  'https://j-m-c-b.github.io/todo/index.html',            // add path to those files here 
  'https://j-m-c-b.github.io/todo/js/vue.global.js',
  'https://j-m-c-b.github.io/screenCalulator',                        // Add URL you want to cache in this list.
  'https://j-m-c-b.github.io/screenCalulator/',                // If you have separate JS/CSS files,
]

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
})

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME);
      console.log(URLS);
      return cache.addAll(URLS)
      .catch(function (error) {
        console.error('Cache addAll error:', error)
      });
      
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create white list
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      // add current cache name to white list
      cacheWhitelist.push(CACHE_NAME)

      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] )
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})