const version = '0.0.8'

const cacheName = 'static'
const cacheFiles = [
    '/',
    '/index.html',
    '/src/js/app.js',
    '/src/css/app.css',
    '/src/images/pwa.jpg',
    // '/manifest.json',
    // '/sw.js',
    'https://fonts.googleapis.com/css?family=Raleway:400,700'
]

self.addEventListener('install', (event) => {
    console.log('SW installed')

    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                cache.addAll(cacheFiles)
            })
    )


})

self.addEventListener('activate', (event) => {
    console.log('SW activated')
    // https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker
    let cachesKeepingList = [cacheName]
    console.log('cachesKeepingList', cachesKeepingList)

    event.waitUntil(
        caches.keys()
            .then(keyList => {
                console.log('SW caches', keyList)
                return Promise.all(
                    keyList.map(key => {
                        if (cachesKeepingList.includes(key) === false) {
                            console.log('caches will delete', key)
                            return caches.delete(key)
                        }
                    })
                )
            })
    )
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('SW fetch from caches', event.request.url)
                    return response
                }
                console.log('SW fetch from network', event.request.url)
                return fetch(event.request)
            })
    )
})

self.addEventListener('message', (event) => {
    if (event.data.action === 'skipWaiting') {
        console.log('SW skip waiting')
        self.skipWaiting()
    }
})