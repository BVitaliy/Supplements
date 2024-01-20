import { Injectable } from '@angular/core';
import { Browser, OpenOptions } from '@capacitor/browser';
import { environment } from 'src/environments/environment';
import { Dialog } from '@capacitor/dialog';
import { PopoverController } from '@ionic/angular';
import { CallPopoverComponent } from 'src/app/shared/components/call-popover/call-popover.component';

@Injectable({
  providedIn: 'root'
})
export class InAppBrowserService {
  canOpen = true;
  ringtone!: HTMLAudioElement;

  constructor(
    private popoverController: PopoverController,
  ) { }

  // Підняти/скинути дзвінок
  // async acceptCall(room_id: string, user_id: number) {
  //   if (this.canOpen) {
  //     this.canOpen = false;
  //     const { value } = await Dialog.confirm({
  //       title: `Call from ${user_id}`,
  //       message: `Do you want to take the call?`,
  //       cancelButtonTitle: 'Cancel',
  //       okButtonTitle: 'Accept'
  //     });

  //     if (value) {
  //       this.canOpen = true;
  //       this.open(`${environment.socketServerCall}/call/${room_id}/${user_id}/0`);
  //     } else {
  //       this.canOpen = true;
  //     }
  //   }
  // }
  async acceptCall(room_id: string, user_id: number, title: string, disableRingtone?: boolean) {
    if (this.canOpen) {
      if (!disableRingtone) {
        this.ringtone = new Audio('./assets/audio/ringtone.mp3');
        this.ringtone.loop = true;
        this.ringtone.defaultMuted = false;
        this.ringtone.muted = false;
        this.ringtone?.play();
      }

      this.canOpen = false;
      const popover = await this.popoverController.create({
        component: CallPopoverComponent,
        cssClass: 'information-popover',
        showBackdrop: true,
        backdropDismiss: false,
        mode: 'ios',
        componentProps: {
          title,
          message: `Click on the camera icon if you want to start a video call`,
        }
      });

      popover.onDidDismiss().then((dataReturned: any) => {
        if (!disableRingtone) {
          this.ringtone?.pause();
        }
        if (dataReturned && dataReturned?.data) {
          if (dataReturned?.data?.accept) {
            this.canOpen = true;
            this.open(`https://finhubss.co.uk/call/${room_id}/${user_id}/${dataReturned?.data?.type}`);
          } else {
            this.canOpen = true;
          }
        } else {
          this.canOpen = true;
        }
      });

      return await popover.present();
    }
  }

  async open(url: string) {
    if (this.canOpen) {
      this.canOpen = false;
      const options: OpenOptions = {
        url,
        windowName: '_blank', // _self _parent _top _system
        toolbarColor: 'transparent',
        presentationStyle: 'fullscreen'
      }
      await Browser.open(options);
    }

    await Browser.addListener('browserPageLoaded', () => { this.canOpen = false; });

    await Browser.addListener('browserFinished', () => { this.canOpen = true; });
  }
}
