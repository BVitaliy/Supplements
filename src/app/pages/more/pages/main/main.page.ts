import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import {
  ACCESS_TOKEN_STORAGE_NAME,
  APP_AUTH_REDIRECT_URL,
} from 'src/app/app.config';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  profile: any;
  backBtnSubscription!: Subscription;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private storage: Storage,
    private alertController: AlertController
  ) {}

  public ngOnInit(): void {
    this.profile = {
      photo: './assets/img/temp/photo.png' || '',
      name: 'Anna Armas' || '',
      email: 'annaarmas@email.com' || '',
    };
  }

  // Вихід
  async logOut() {
    this.storage.remove(ACCESS_TOKEN_STORAGE_NAME);
    this.navCtrl.navigateRoot([APP_AUTH_REDIRECT_URL]);
  }

  // Алерт із підвердженням виходу
  async logoutAlert() {
    // subscribe to HardwereBackBatton
    this.backBtnSubscription = this.platform.backButton.subscribeWithPriority(
      9998,
      () => {
        this.closeAlert();
      }
    );

    const alert = await this.alertController.create({
      // cssClass: 'delete-alert',
      header: 'Log out profile?',
      message: 'Do you really want to log out?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: ['danger'],
        },
        {
          text: 'Log out',
          cssClass: ['secondary'],
          handler: () => {
            this.logOut();
          },
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
          cssClass: ['danger'],
        },
        {
          text: 'Delete',
          role: 'confirm',
          cssClass: ['secondary'],
          handler: (): void => {
            // delete account
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
}
