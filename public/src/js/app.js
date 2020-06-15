var pwaCard = document.querySelector('#pwa');
var pwaCardContent = pwaCard.querySelector('.card__content');
var pwaCardDetails = pwaCard.querySelector('.card__details');
var detailsShown = false;

let newWorker;
let refreshing;

// the click event on the notification
let reloadElement = document.getElementById('reload')
if (reloadElement) {
  reloadElement.addEventListener('click', () => {
    newWorker.postMessage({ action: 'skipWaiting' })
  })
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('SW registered', registration.scope)
      registration.addEventListener('updatefound', (event) => {
        // An updated service worker has appeared
        newWorker = registration.installing

        newWorker.addEventListener('statechange', () => {
          // Has service worker state changed?
          switch (newWorker.state) {
            case 'installed': {
              // there is a new service worker available, show the notification
              if (navigator.serviceWorker.controller) {
                let notificationElement = document.getElementById('notification')
                if (notificationElement) {
                  notificationElement.className = 'show'
                }
              }
              break
            }
          }
        })
      })
    })
    .catch(err => {
      console.log('SW registered fail', err)
    })

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) {
      return
    }

    window.location.reload()
    refreshing = true
  })
}

pwaCard.addEventListener('click', function (event) {
  if (!detailsShown) {
    detailsShown = true;
    pwaCardContent.style.opacity = 0;
    pwaCardDetails.style.display = 'block';
    pwaCardContent.style.display = 'none';
    setTimeout(function () {
      pwaCardDetails.style.opacity = 1;
    }, 300);
  } else {
    detailsShown = false;
    pwaCardDetails.style.opacity = 0;
    pwaCardContent.style.display = 'block';
    pwaCardDetails.style.display = 'none';
    setTimeout(function () {
      pwaCardContent.style.opacity = 1;
    }, 300);
  }
});