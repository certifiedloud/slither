import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { SlitherAppComponent, environment } from './app/';
import { FIREBASE_PROVIDERS, defaultFirebase } from 'angularfire2';

if (environment.production) {
  enableProdMode();
}

bootstrap(SlitherAppComponent, [
  FIREBASE_PROVIDERS,
  // Initialize Firebase app
  defaultFirebase({
    apiKey: "AIzaSyBOZlu3pZWL8LYL0_IVYBcLKAYXVOnOvis",
    authDomain: "igslither.firebaseapp.com",
    databaseURL: "https://igslither.firebaseio.com",
    storageBucket: "igslither.appspot.com"
  })
]);
