import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AudioMessageService {
  audioRef: HTMLAudioElement = new Audio();
  oldAudio: any;

  constructor( ) { }

  async playFile(audio: any) {
    console.log('audio ', audio);
    // this.audioRef.src = audio?.url;
    // this.audioRef.oncanplaythrough = () => this.audioRef.play();
    // this.audioRef.load();

    // this.audioRef.src = audio?.url;
    // this.audioRef.onloadedmetadata = () => {
    //   this.audioRef.play();
    // };

    if (this.oldAudio) {
      this.oldAudio.pause();
    }
    if (audio) {
      audio?.play();
    }
    this.oldAudio = audio;
  }
}
