const APP_PREFIX = 'BudgetTracker-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

const FILES_TO_CACHE = [
    "./js/idb.js",
    "./js/index.js",
    "./index.html",
    "./css/styles.css"
  ];

//Install a service worker
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
          console.log('installing cache : ' + CACHE_NAME)
          return cache.addAll(FILES_TO_CACHE)
        })
      )
});

//Find all resources with app pre-fix, push them to cache
self.addEventListener('activate', function(e) {
  e.waitUntil(
    //Array of all cache names keys
    caches.keys().then(function(keyList) {

      //filter out only the ones with matching pre-fix
      let cacheKeeplist = keyList.filter(function(key) {
        return key.indexOf(APP_PREFIX);
      });
      cacheKeeplist.push(CACHE_NAME);

      //Delete all old cache version and return a promise.
      return Promise.all(
        keyList.map(function(key, i) {
          if (cacheKeeplist.indexOf(key) === -1) {
            console.log('deleting cache : ' + keyList[i]);
            return caches.delete(keyList[i]);
          }
        })
      );
    })
  );
});