import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  public profile: any;

  constructor(public navCtrl: NavController, private alertController: AlertController) {}

  public ngOnInit(): void {
    this.profile = {
      photo: './assets/img/temp/photo.png' || '',
      name: 'Anna Armas' || '',
      email: 'annaarmas@email.com' || '',
    };
  }

  public async handleDeleteAccount(): Promise<void> {
    const alert: HTMLIonAlertElement = await this.alertController.create({
      header: 'Delete Account?',
      message: 'Are you sure you would like to delete your account?',
      buttons: [
        {
          text: 'Delete',
          role: 'confirm',
          cssClass: 'alert-button-delete',
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
        },
      ],
    });
    alert.onDidDismiss().then(data => {
      if (data?.role === 'confirm') {
        // delete account
      }
    });

    return  await alert.present();
  }
}
