// detect android OS
var isAndroid = /(android)/i.test(navigator.userAgent);
if(isAndroid) {
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
    // theme: 'android', // put platform type ('ios', 'android', etc.) here to force single theme on all device
    icon: 'https://lh3.googleusercontent.com/hNGOOKOLpB_4tRv__LRpQSp9QxbwCTCsFbzpeYFxd6YvtJ-6lF6ttqPHbQbDQ7K07vA=s180-rw', // full path to icon image if not using website icon image
    // force: 'android' // Uncomment for platform emulation
  });
}
