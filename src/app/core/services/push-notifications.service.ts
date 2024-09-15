import { Injectable } from '@angular/core';
// // import { OneSignal } from '@ionic-native/onesignal/ngx';
// import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { environment } from '../../../environments/environment';
import {
  DEVICE_ID_STORAGE_NAME,
  VOIP_TOKEN_STORAGE_NAME,
} from 'src/app/app.config';

import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationsService {
  constructor(
    // private oneSignal: OneSignal,
    private platform: Platform,
    private storage: Storage,
    private router: Router
  ) {}

  getIds() {
    // return new Promise((resolve, reject) => {
    //   OneSignal.getDeviceState((response: any) => {
    //     resolve(response);
    //   })
    // });
  }

  setupPush() {
    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then((result) => {
      console.log(result);
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }
}
