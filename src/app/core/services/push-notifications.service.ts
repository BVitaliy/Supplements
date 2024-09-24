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

import { NavController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationsService {
  FCMtoken: string | null = null;

  constructor(
    // private oneSignal: OneSignal,
    private platform: Platform,
    private navCtrl: NavController,
    private router: Router
  ) {}

  getIds() {
    // return new Promise((resolve, reject) => {
    //   OneSignal.getDeviceState((response: any) => {
    //     resolve(response);
    //   })
    // });
  }

  async setupPush() {
    console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    // PushNotifications.checkPermissions;
    // PushNotifications.requestPermissions().then((result) => {
    //   console.log(JSON.stringify(result));
    //   if (result.receive === 'granted') {
    //     // Register with Apple / Google to receive push via APNS/FCM
    //     PushNotifications.register();
    //   } else {
    //     // Show some error
    //   }
    // });

    await this.registerNotifications();

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + JSON.stringify(token));
      this.FCMtoken = token.value;
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
        // this.inAppRouting(notification?.notification);
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
        this.inAppRouting(notification?.notification);
      }
    );

    this.getDeliveredNotifications();
  }

  inAppRouting(notification: any) {
    console.log('notification' + JSON.stringify(notification));
    if (notification?.data?.notification_type === 'favorite_list') {
      this.router.navigateByUrl('home/tabs/tab/favorites');
    }
    if (notification?.data?.notification_type === 'product_request') {
      if (notification?.data?.product_id) {
        this.router.navigateByUrl(
          '/product/detail/' + notification?.data?.product_id
        );
      }
      if (notification?.data?.request_id) {
        this.navCtrl.navigateForward([
          '/home/tabs/tab/more/submitted-products',
          {
            openId: notification?.data?.request_id,
          },
        ]);
      }
    }
    if (
      notification?.data?.notification_type === 'product_promo' ||
      notification?.data?.notification_type === 'info'
    ) {
      if (notification?.data?.product_id) {
        this.router.navigateByUrl(
          '/product/detail/' + notification?.data?.product_id
        );
      }
      console.log('/product/detail/' + notification?.data?.product_id)
    }
  }

  async registerNotifications() {
    let permStatus = await PushNotifications.checkPermissions();
    console.log(JSON.stringify(permStatus));
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
    console.log(JSON.stringify(permStatus));

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }

  async getDeliveredNotifications() {
    const notificationList =
      await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  }
}
