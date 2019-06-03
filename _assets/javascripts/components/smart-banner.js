// detect android OS
var ua = window.navigator.userAgent;
var isiOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
var isWebkit = !!ua.match(/WebKit/i);
var isSafari = isiOS && isWebkit && !ua.match(/CriOS/i);

if (!isSafari && window.innerWidth <= 768) {
  // call smart-banner
  new SmartBanner({
    daysHidden: 15,   // days to hide banner after close button is clicked (defaults to 15)
    daysReminder: 90, // days to hide banner after "VIEW" button is clicked (defaults to 90)
    appStoreLanguage: 'us', // language code for the App Store (defaults to user's browser language)
    title: 'Crossroads Anywhere',
    author: 'Crossroads Community Church, Inc',
    button: 'VIEW',
    store: {
        ios: 'On the App Store',
        android: 'In Google Play',
        windows: 'In Windows store'
    },
    price: {
        ios: 'FREE',
        android: 'FREE',
        windows: 'FREE'
    }, 
    theme: 'ios', // put platform type ('ios', 'android', etc.) here to force single theme on all device
    icon: 'https://is2-ssl.mzstatic.com/image/thumb/Purple113/v4/34/26/88/342688dd-1678-80f9-6b6a-28badaf7f629/AppIcon-0-1x_U007emarketing-0-85-220-0-10.png/230x0w.jpg', // full path to icon image if not using website icon image
    // force: 'ios' // Uncomment for platform emulation
  });

  
  // // fire ananlytics track here
  // var cta = document.querySelector('.smartbanner-button');
  // cta.setAttribute('data-track-click', 'smartBannerConversion');  
}
