import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  NavController,
  Platform,
  ViewDidLeave,
} from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { emailPattern } from 'src/app/core/validators/email.validator';
import { finalize } from 'rxjs/operators';
import {
  ACCESS_TOKEN_STORAGE_NAME,
  APP_HOME_REDIRECT_URL,
  DEVICE_ID_STORAGE_NAME,
  USER_ID_STORAGE_NAME,
  USER_STORAGE_NAME,
  VOIP_TOKEN_STORAGE_NAME,
} from 'src/app/app.config';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from '../../authentication.service';
import { ThemeOptionsService } from 'src/app/core/services/theme-options.service';
import { PushNotificationsService } from 'src/app/core/services/push-notifications.service';

import { PushNotifications } from '@capacitor/push-notifications';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, ViewDidLeave {
  loginForm!: FormGroup;
  playerID: string = '';
  voIPToken: string = '';
  showPassword: boolean = false;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private loadingController: LoadingController,
    private storage: Storage,
    private alertService: AlertService,
    private themeOptionsService: ThemeOptionsService,
    private authenticationService: AuthenticationService,
    private pushNotificationsService: PushNotificationsService
  ) {}

  async ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(emailPattern),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
    if (this.platform.is('hybrid')) {
      this.storage.get(DEVICE_ID_STORAGE_NAME).then((playerID) => {
        if (playerID) {
          this.playerID = playerID;
          // this.faceId();
        } else {
          this.pushNotificationsService.getIds().then((ids: any) => {
            this.playerID = ids?.userId;
            this.storage.set(DEVICE_ID_STORAGE_NAME, ids?.userId);
          });
        }
      });
    }
  }

  async logIn() {
    this.storage.set(ACCESS_TOKEN_STORAGE_NAME, 'test-token');
    this.navCtrl.navigateForward([APP_HOME_REDIRECT_URL]);
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  ionViewDidLeave() {
    this.loginForm.reset();
  }
}
