import {Injectable} from '@angular/core';
import {AlertController, ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class AlertService {
  constructor(
    private toastController: ToastController,
    private alertController: AlertController
  ) {
  }

  async presentErrorAlert(err: any) {
    if (err?.status === 0 || err?.status === 401) {
      return;
    }
    if (err.loaded === 0 && err.total === 0) {
      return;
    }
    let mess;
    const errCode = err.error && err.error.code ? err.error.code : err.code;
    const buttonsArr: any = ['OK'];

    if (typeof (err?.error?.message) === 'string') {
      mess = err.error.message;
    } else if (typeof (err.message) === 'string') {
      mess = err.message;
    } else if (typeof (err) === 'string') {
      mess = err;
    }

    const alert = await this.alertController.create({
      header: 'Error',
      message: mess ? mess : 'An unknown error has occurred',
      buttons: buttonsArr,
      mode: 'ios'
    });

    await alert.present();
  }

  async presentNetworkError(cb?: any) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Lost connection',
      backdropDismiss: false,
      mode: 'ios'
    });
    await alert.present();
    if (cb) {
      cb(alert);
    }
  }

  async createAlert(options: any) {
    const {header, message, backdropDismiss, buttons, cssClass} = options;
    const alert = await this.alertController.create({
      header,
      message,
      backdropDismiss,
      buttons,
      cssClass,
      mode: 'ios'
    });
    await alert.present();
  }

  async createToast(options: any) {
    const {header, mode, position} = options;
    const toast = await this.toastController.create({
      header,
      mode,
      position,
      color: 'dark',
      duration: 2500,
      buttons: [
        {
          icon: 'close',
          side: 'end',
          role: 'cancel'
        },
      ],
    });
    await toast.present();
  }

  async warning(message: string) {
    const alert = await this.alertController.create({
      header: 'Warning!',
      message,
      mode: 'ios',
      buttons: ['OK']
    });
    await alert.present();
  }
}
