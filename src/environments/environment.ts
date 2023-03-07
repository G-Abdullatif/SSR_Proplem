// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appVersion: '3.5',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: false,
  // TFS
    apiUrl: "https://tuliptechsapi.azurewebsites.net/",
    googleRecaptchaSiteKey: "6LfnqMUaAAAAABmrgCtmvDdNI-Xop1zk2PviQisZ",
  firebase: {
    apiKey: "AIzaSyDkVpPglD3sOlwew4T6chh8M2Zpf10EFwY",
    authDomain: "dratneed-4bedf.firebaseapp.com",
    databaseURL: "https://dratneed-4bedf.firebaseio.com",
    projectId: "dratneed-4bedf",
    storageBucket: "dratneed-4bedf.appspot.com",
    messagingSenderId: "199933238242",
    appId: "1:199933238242:web:513d2eb532edda722fb7bb",
    measurementId: "G-QWMM7CKGPD"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
