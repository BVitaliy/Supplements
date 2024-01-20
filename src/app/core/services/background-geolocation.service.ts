import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
 
import { ACCESS_TOKEN_STORAGE_NAME, USER_ID_STORAGE_NAME } from 'src/app/app.config';

import { registerPlugin } from "@capacitor/core";
import { ThemeOptionsService } from './theme-options.service';
import { Subscription } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';

import { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
// // const BackgroundGeolocation = registerPlugin("BackgroundGeolocation");
const backgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");

@Injectable({
  providedIn: 'root'
})
export class BackgroundGeolocationService {
  driverPosition: any;
  // driverPositionArray: Array<any> = [];
  watcherId!: string;
  interval: any;
  tokenSubscription!: Subscription;

  constructor(
    private platform: Platform,
    private storage: Storage,
    private themeOptionsService: ThemeOptionsService, 
  ) { }

  // https://prnt.sc/I6UceDQdPyGi - проблема із геолокацією у тому що не встигає прийти відповідь а вже починається новий запит!!!!!
  async startWatch() {
    // this.tokenSubscription = this.themeOptionsService.userToken.subscribe((token: string) => {
    //   if (token) {
        if (!this.watcherId && this.platform.is('hybrid')) {
          const coordinates: any = await Geolocation.getCurrentPosition();
          console.log('Current position:', coordinates);
          this.driverPosition = {lat: coordinates?.coords?.latitude, lng: coordinates?.coords?.longitude};
  

          this.startWatchBackgroundGeolocation();
        }
    //   }
    // })
  }

  startWatchBackgroundGeolocation() {
    if (this.platform.is('hybrid')) {
      backgroundGeolocation.addWatcher(
        {
          // If the "backgroundMessage" option is defined, the watcher will
          // provide location updates whether the app is in the background or the
          // foreground. If it is not defined, location updates are only
          // guaranteed in the foreground. This is true on both platforms.

          // On Android, a notification must be shown to continue receiving
          // location updates in the background. This option specifies the text of
          // that notification.
          backgroundMessage: 'Cancel to prevent battery drain.',

          // The title of the notification mentioned above. Defaults to "Using
          // your location".
          backgroundTitle: 'Tracking You.',

          // Whether permissions should be requested from the user automatically,
          // if they are not already granted. Defaults to "true".
          requestPermissions: true,

          // If "true", stale locations may be delivered while the device
          // obtains a GPS fix. You are responsible for checking the "time"
          // property. If "false", locations are guaranteed to be up to date.
          // Defaults to "false".
          stale: false,

          // The minimum number of metres between subsequent locations. Defaults to 0.
          distanceFilter: 10
        },
        (location, error) => {
          if (error) {
            // Попап який попередажає що ТРЕБА увімкнена локація в налаштуваннях!!!
            // if (error.code === 'NOT_AUTHORIZED') {
            //   if (
            //     window.confirm('This app needs your location, ' + 'but does not have permission.\n\n' + 'Open settings now?')
            //   ) {
            //     // It can be useful to direct the user to their device's settings when location permissions have been denied.
            //     // The plugin provides the 'openSettings' method to do exactly this.
            //     backgroundGeolocation.openSettings();
            //   }
            // }
            return console.error(error);
          }

          this.driverPosition = {lat: location?.latitude, lng: location?.longitude};
          console.log('Current position:', this.driverPosition);

          return
        }
      ).then((data: any) => {
        this.watcherId = data;
        // console.log('watcherId -> ', this.watcherId);
      })
 
    }
  }

  stopWatchBackgroundGeolocation(clear?: boolean) {
    if (this.platform.is('hybrid') && this.watcherId) {
      backgroundGeolocation.removeWatcher({ id: this.watcherId });
      if (clear) {
        clearInterval(this.interval);
      }
      if (this.tokenSubscription) {
        this.tokenSubscription.unsubscribe();
      }
    }
  }
}
