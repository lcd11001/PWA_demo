self.addEventListener('install', (event) => {
    console.log('SW installed')

    event.waitUntil(
        caches.open('static')
            .then(cache => {
                // cache.add('/')
                // cache.add('/index.html')
                // cache.add('/src/js/app.js')
                cache.addAll([
                    '/',
                    '/index.html',
                    '/src/js/app.js',
                    '/src/css/app.css',
                    '/src/images/pwa.jpg',
                    // '/manifest.json',
                    // '/sw.js',
                    'https://fonts.googleapis.com/css?family=Raleway:400,700'
                ])
            })
    )


})

self.addEventListener('activate', () => {
    console.log('SW activated')
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