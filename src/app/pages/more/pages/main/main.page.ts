import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import {
  AlertController,
  LoadingController,
  NavController,
  Platform,
} from '@ionic/angular';
import { finalize, Subscription } from 'rxjs';
import {
  ACCESS_TOKEN_STORAGE_NAME,
  ACCESS_WITH_APPLE,
  ACCESS_WITH_GOOGLE,
  APP_AUTH_REDIRECT_URL,
  DEVICE_ID_STORAGE_NAME,
  REFRESH_TOKEN_STORAGE_NAME,
} from 'src/app/app.config';
import { ProfileService } from '../../profile.service';
import { AlertService } from 'src/app/core/services/alert.service';

import { jwtDecode } from 'jwt-decode';
import { AuthenticationService } from 'src/app/pages/auth/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { PushNotificationsService } from 'src/app/core/services/push-notifications.service';
// import { AppRate } from '@awesome-cordova-plugins/app-rate/ngx';

import { RateApp } from 'capacitor-rate-app';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  profile: any;
  backBtnSubscription!: Subscription;
  appleLogin = false;
  googleLogin = false;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private storage: Storage,
    private alertController: AlertController,
    private profileService: ProfileService,
    private loadingController: LoadingController,
    private alertService: AlertService,
    public route: ActivatedRoute,
    private pushNotificationsService: PushNotificationsService,
    public authService: AuthenticationService,
    // private appRate: AppRate,
  ) {
    // this.storage.get(ACCESS_WITH_APPLE).then((login) => {
    //   console.log(login);
    //   this.appleLogin = login;
    // });
    // this.storage.get(ACCESS_WITH_GOOGLE).then((login) => {
    //   console.log(login);
    //   this.googleLogin = login;
    // });
  }

  ionViewWillEnter() {
    this.storage.get('user').then((user) => {
      if (user) {
        this.profile = JSON.parse(user);
      } else {
        this.getUser();
      }
      console.log(this.profile);
    });
  }

  public ngOnInit(): void {}
  

  async logOut() {
    // this.storage.remove(ACCESS_TOKEN_STORAGE_NAME);
    // this.navCtrl.navigateRoot([APP_AUTH_REDIRECT_URL]);
    this.removeDevice();
    setTimeout(async () => {
      const loading = await this.loadingController.create({
        message: 'Wait...',
        mode: 'ios',
      });
      await loading.present().then(() => {
        this.authService.logOut();
        this.profileService
          .logout({})
          .pipe(
            finalize(() => {
              loading?.dismiss();
            })
          )
          .subscribe(
            (data: any) => {
              console.log(data);
              this.storage.remove(ACCESS_TOKEN_STORAGE_NAME);
              this.storage.remove(ACCESS_TOKEN_STORAGE_NAME);
              this.storage.remove('user');
              this.navCtrl.navigateRoot([APP_AUTH_REDIRECT_URL]);
              // this.removeDevice();
            },
            (error: any) => {
              // this.alertService.presentErrorAlert(error?.email?.error);

              if (error.status === 401) {
                this.alertService.presentErrorAlert('Something went wrong');
              }
            }
          );
      });
    }, 300);
  }

  removeDevice() {
    this.storage.get(DEVICE_ID_STORAGE_NAME).then((token: any) => {
      if (token) {
        this.authService.removeDevice(token).subscribe(
          (data: any) => {
            console.log('removed Device id ' + token);
          },
          (error: any) => {}
        );
      }
    });
  }

  getUser() {
    this.storage.get(ACCESS_TOKEN_STORAGE_NAME).then((token) => {
      if (token) {
        const decoded: any = jwtDecode(token);

        this.profileService.getProfile(decoded?.user_id).subscribe(
          (data: any) => {
            this.storage.set('user', JSON.stringify(data));
            this.profile = data;
            console.log(this.profile);
          },
          (error: any) => {
            // this.alertService.presentErrorAlert(error?.email?.error);

            if (error.status === 401) {
              this.alertService.presentErrorAlert('Something went wrong');
            }
          }
        );
      }
    });
  }

  async logoutAlert() {
    // subscribe to HardwereBackBatton
    this.backBtnSubscription = this.platform.backButton.subscribeWithPriority(
      9998,
      () => {
        this.closeAlert();
      }
    );

    const alert = await this.alertController.create({
      cssClass: 'delete-alert',
      header: 'Log out profile?',
      message: 'Do you really want to log out?',
      mode: 'ios',
      buttons: [
        {
          text: 'Log out',
          cssClass: ['alert-button-delete'],
          handler: () => {
            this.logOut();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: ['alert-button-cancel'],
        },
      ],
    });

    alert.onDidDismiss().then(() => {
      this.backBtnSubscription.unsubscribe();
    });

    await alert.present();
  }

  // Закривання всіх алертів
  async closeAlert() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
    await this.alertController?.dismiss();
  }

  // Вихід
  async delete() {
    // this.storage.remove(ACCESS_TOKEN_STORAGE_NAME);
    // this.navCtrl.navigateRoot([APP_AUTH_REDIRECT_URL]);
    const loading = await this.loadingController.create({
      message: 'Wait...',
      mode: 'ios',
    });

    this.profileService
      .delete()
      .pipe(
        finalize(() => {
          loading?.dismiss();
        })
      )
      .subscribe(
        (data: any) => {
          this.storage.remove(ACCESS_TOKEN_STORAGE_NAME);
          this.storage.remove(REFRESH_TOKEN_STORAGE_NAME);
          this.navCtrl.navigateRoot([APP_AUTH_REDIRECT_URL]);
        },
        (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  public async handleDeleteAccount(): Promise<void> {
    this.backBtnSubscription = this.platform.backButton.subscribeWithPriority(
      9998,
      (): void => {
        this.closeAlert();
      }
    );

    const alert: HTMLIonAlertElement = await this.alertController.create({
      header: 'Delete Account?',
      message: 'Are you sure you would like to delete your account?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: ['alert-button-delete'],
        },
        {
          text: 'Delete',
          role: 'confirm',
          cssClass: ['alert-button-cancel'],
          handler: (): void => {
            this.delete();
          },
        },
      ],
    });
    alert.onDidDismiss().then((data): void => {
      this.backBtnSubscription.unsubscribe();
    });

    return await alert.present();
  }

  ionViewDidLeave() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
  }

  goToArticle(slug: any) {
    this.navCtrl.navigateForward(['article', { slug }]);
  }


  promptForRating() {
    RateApp.requestReview();
    // this.platform.ready().then(() => {
      // this.appRate.setPreferences({
      //   usesUntilPrompt: 1,  // How many times a user must use the app before being prompted
      //   storeAppURL: {
      //     ios: 'com.supplementsocre.ss',
      //     android: 'market://details?id=com.supplementsocre.ss',
      //   },
      //   customLocale: {
      //     title: "Rate us",
      //     message: "If you enjoy using this app, would you mind taking a moment to rate it? Thanks for your support!",
      //     cancelButtonLabel: "No, thanks",
      //     laterButtonLabel: "Remind me later",
      //     rateButtonLabel: "Rate it now",
      //   }
      // });
      // this.appRate.promptForRating(true); // true for forcing the prompt to show
    // });
  }
}
