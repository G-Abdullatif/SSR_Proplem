importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyDkVpPglD3sOlwew4T6chh8M2Zpf10EFwY",
  authDomain: "dratneed-4bedf.firebaseapp.com",
  databaseURL: "https://dratneed-4bedf.firebaseio.com",
  projectId: "dratneed-4bedf",
  storageBucket: "dratneed-4bedf.appspot.com",
  messagingSenderId: "199933238242",
  appId: "1:199933238242:web:513d2eb532edda722fb7bb",
  measurementId: "G-QWMM7CKGPD"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

/* messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
}); */