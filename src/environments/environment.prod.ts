export let environment = {
  production: true,
  appVersion: '3.5',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  // TFS
  apiUrl: "https://tuliptechsapi.azurewebsites.net/",
  googleRecaptchaSiteKey: "6Le_EqQkAAAAANaQuRj7gzmXI_FLu6gPc3N9eqJC",
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
try {
  let systemConfig = JSON.parse(localStorage.getItem("systemConfiguration"));
  environment.googleRecaptchaSiteKey = systemConfig.find(con => con.key == 'CaptchaKey').value
}
catch {
  environment.googleRecaptchaSiteKey = "6Le_EqQkAAAAANaQuRj7gzmXI_FLu6gPc3N9eqJC"
}
