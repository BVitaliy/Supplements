import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Platform, PopoverController } from '@ionic/angular';
import { AlertService } from './alert.service';
// import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { App } from '@capacitor/app';
import { InformationPopoverComponent } from 'src/app/shared/components/information-popover/information-popover.component';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  newAppVersion = true;

  constructor(
    private http: HttpClient,
    private platform: Platform,
    private popoverController: PopoverController,
    private alertService: AlertService,
    private appVersion: AppVersion
  ) {
  }

  getOptions() {
    return this.http.post(`${environment.origin}/api/driver/cabinet/getAppConfigsByTypes`, { types: ['updates_popup'] })
    .pipe(map((data: any) => data[0].value))
    .subscribe(
      (data: any) => {
        if (data) {
          /// Перевірка версії апки
          this.checkVersion(data);
          App.addListener('appStateChange', ({ isActive }) => {
            if (isActive && !this.newAppVersion) {
              this.newAppVersion = true;
              this.checkVersion(data);
            }
          });
        }
      },
      error => {
        this.alertService.presentErrorAlert(error);
      }
    );
  }

  checkVersion(popup: any) {
    this.platform.ready().then(() => {
      if (this.platform.is('hybrid')) {
        this.appVersion.getVersionNumber().then((version: any) => {
          // console.log('version', version);
          if (version < popup?.android?.version && popup?.android?.enable && this.platform.is('android')) {
            popup.buttonsArray = [
              {
                icon: '',
                name: popup?.android?.button_text,
                route: popup?.android?.link
              }
            ];
            // this.presentPopover('./assets/img/emblema.jpg', popup?.android?.title, '', popup?.android?.text, popup?.buttonsArray, !popup?.android?.critical, true);
            this.presentPopover(popup?.android?.title, popup?.android?.text, popup?.buttonsArray, !popup?.android?.critical, true);
          }
          if (version < popup?.ios?.version && popup?.ios?.enable && this.platform.is('ios')) {
            popup.buttonsArray = [
              {
                icon: '',
                name: popup?.ios?.button_text,
                route: popup?.ios?.link
              }
            ];
            // this.presentPopover('./assets/img/emblema.jpg', popup?.title, '', popup?.text, popup?.buttonsArray, !popup?.app_version_ios?.critical, true);
            this.presentPopover(popup?.ios?.title, popup?.ios?.text, popup?.buttonsArray, !popup?.ios?.critical, true);
          }
        });
      }
    });
  }

  async presentPopover(
    // icon?: string, title?: string, imgSrc?: string, text?: string, button?: any, closeEnable?: boolean, version?: boolean
    title?: string, text?: string, buttons?: Array<any>, closeEnable?: boolean, version?: boolean
  ) {
    const popover = await this.popoverController.create({
      component: InformationPopoverComponent,
      cssClass: 'information-popover',
      showBackdrop: true,
      backdropDismiss: closeEnable,
      mode: 'ios',
      componentProps: {
        // icon,
        title,
        // imgSrc,
        text,
        buttons,
        closeEnable
      }
    });

    popover.onDidDismiss().then((dataReturned) => {
      if (version) {
        this.newAppVersion = false;
      }
    });

    return await popover.present();
  }
}
