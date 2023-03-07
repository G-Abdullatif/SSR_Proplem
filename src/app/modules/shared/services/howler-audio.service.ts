import { Injectable } from '@angular/core';
import {Howl, Howler} from 'howler';

@Injectable({
  providedIn: 'root'
})
export class HowlerAudioService {
  notificationSound = new Howl({
    src: ['../../../../assets/media/audio/been_tree.mp3'],
    html5: true
  });
  incomingCallSound = new Howl({
    src: ['../../../../assets/media/audio/hangouts-incoming-call.mp3'],
    html5: true,
    loop: true
  });
  
  constructor() { }

  playNotificationSound() {
    this.notificationSound.play();
    Howler.volume(0.5);
  }

  playIncomingCallSound() {
    this.incomingCallSound.play();
    Howler.volume(0.5);
  }

  stopIncomingCallSound() {
    this.incomingCallSound.stop();
  }
}
