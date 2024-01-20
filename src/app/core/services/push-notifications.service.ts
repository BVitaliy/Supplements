import { Injectable } from '@angular/core';
// // import { OneSignal } from '@ionic-native/onesignal/ngx';
// import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import { DEVICE_ID_STORAGE_NAME, VOIP_TOKEN_STORAGE_NAME } from 'src/app/app.config';


import OneSignal from 'onesignal-cordova-plugin';
import NotificationReceivedEvent from 'onesignal-cordova-plugin/dist/NotificationReceivedEvent';
 
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {

  constructor(
    // private oneSignal: OneSignal,
    private platform: Platform,
    private storage: Storage,
    private router: Router
  ) { }

  // setupPush() {
  //   // I recommend to put these into your environment.ts
  //   this.oneSignal.startInit(environment.oneSignalAppId, environment.googleFirebaseSenderId);

  //   this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

  //   this.oneSignal.getIds().then((ids: any) => {
  //     this.storage.set(DEVICE_ID_STORAGE_NAME, ids?.userId);
  //   });

  //   // Notifcation was received in general
  //   // DONT DELETE!!!!
  //   // this.oneSignal.handleNotificationReceived().subscribe(data => {
  //   //   // const msg = data.payload.body;
  //   //   // const title = data.payload.title;
  //   //   // const additionalData = data.payload.additionalData;

  //   //   console.log('handleNotificationReceived: ', data);
  //   // });

  //   // Notification was really clicked/opened
  //   this.oneSignal.handleNotificationOpened().subscribe((data: any) => {
  //     // const additionalData = data.notification.payload.additionalData;
  //     console.log('handleNotificationOpened: ', data);
  //     //
  //     let url = data.notification.payload.launchURL;
  //     // launchURL param starts with 'x:/' + route to necessary page
  //     if (url && url.substring(0, 3) === 'x:/') {
  //       url = url.substring(3);
  //       // user clicks notification while the app is opened
  //       if (data.notification.isAppInFocus) {
  //         this.router.navigateByUrl(url);
  //         // user clicks notification while the app is closed
  //       } else {
  //         function delay(ms: number) {
  //           return new Promise(resolve => setTimeout(resolve, ms));
  //         }
  //         // firstly navigate to home page, if some necessary data for app to work correctly is loaded there
  //         this.router.navigateByUrl('route-to-home-main-page').then(() => {
  //           delay(1000).then(() => this.router.navigateByUrl(url));
  //         });
  //       }
  //     }
  //   });

  //   // DONT DELETE!!!! In - App message
  //   // this.oneSignal.handleInAppMessageClicked().subscribe(action => {
  //   //     console.log('handleInAppMessageClicked: ', action);
  //   //     let innerUrl = action.click_name;
  //   //     if (innerUrl && innerUrl.substring(0, 7) === 'route:/') {
  //   //         innerUrl = innerUrl.substring(7);
  //   //         action.closes_message = true;
  //   //         this.router.navigateByUrl(innerUrl);
  //   //     }
  //   // });

  //   this.oneSignal.endInit();
  // }

  getIds() {
    return new Promise((resolve, reject) => {
      OneSignal.getDeviceState((response: any) => {
        resolve(response);
      })
    });
  }

  setupPush() {
    OneSignal.setAppId(environment.oneSignalAppId);

    this.getIds().then((ids: any) => {
      this.storage.set(DEVICE_ID_STORAGE_NAME, ids?.userId);
    });

 

    // Prompts the user for notification permissions.
    //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
    OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
      console.log("User accepted notifications: " + accepted);
    });

    OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent: NotificationReceivedEvent) => {
      console.log('setNotificationWillShowInForegroundHandler: ' + JSON.stringify(notificationReceivedEvent));
      console.log('setNotificationWillShowInForegroundHandler1: ' + notificationReceivedEvent);
      notificationReceivedEvent.complete(notificationReceivedEvent.getNotification());
    });

    OneSignal.setNotificationOpenedHandler((data) => {
      console.log('notificationOpenedCallback: ' + JSON.stringify(data));
      console.log('notificationOpenedCallback1: ' + data);
      // console.log('notificationOpenedCallback: ' + data);
      // let data = JSON.stringify(jsonData);
      // let url = data.notification.launchURL;
      let url: any = data.notification.additionalData;
      // launchURL param starts with 'x:/' + route to necessary page
      if (url?.app_data_url && url?.app_data_url.substring(0, 11) === 'https://x:/') {
        url.app_data_url = url?.app_data_url.substring(11);
        // user clicks notification while the app is opened
        console.log('URL ', url?.app_data_url);


        this.router.navigateByUrl(url?.app_data_url);
        // if (data.notification.isAppInFocus) {
        //   this.router.navigateByUrl(url);
        //   // user clicks notification while the app is closed
        // } else {
        //   // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        //   function delay(ms) {
        //     return new Promise(resolve => setTimeout(resolve, ms));
        //   }
        //   // firstly navigate to home page, if some necessary data for app to work correctly is loaded there
        //   this.router.navigateByUrl(url).then(() => {
        //     delay(1000).then(() => this.router.navigateByUrl(url));
        //   });
        // }
      }
    });
  }
}
