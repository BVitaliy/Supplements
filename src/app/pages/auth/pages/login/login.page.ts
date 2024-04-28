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
  REFRESH_TOKEN_STORAGE_NAME,
} from 'src/app/app.config';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from '../../authentication.service';
import { Capacitor } from '@capacitor/core';
// import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

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
  user: any = null;
  platformName: any = null;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private loadingController: LoadingController,
    private storage: Storage,
    private alertService: AlertService,
    public authService: AuthenticationService
  ) {
    this.platformName = Capacitor.getPlatform();
  }

  async ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(emailPattern),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
    if (this.platform.is('hybrid')) {
      this.storage.get(DEVICE_ID_STORAGE_NAME).then((playerID) => {
        if (playerID) {
          this.playerID = playerID;
          // this.faceId();
        }
      });
    }
  }
  googleSignIn() {
    this.authService.googleSignIn();
  }

  ionViewWillEnter() {
    // this.storage.set(ACCESS_TOKEN_STORAGE_NAME, 'adasdasdasd');
    // this.storage.set(REFRESH_TOKEN_STORAGE_NAME, 'asd8762837h8as7dh');
  }

  async logIn() {
    const loading = await this.loadingController.create({
      message: 'Wait...',
      mode: 'ios',
    });

    this.authService
      .login(this.loginForm.value)
      .pipe(
        finalize(() => {
          loading?.dismiss();
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);

          this.storage.set(ACCESS_TOKEN_STORAGE_NAME, data?.access);
          this.storage.set(REFRESH_TOKEN_STORAGE_NAME, data?.refresh);
          this.navCtrl.navigateForward([APP_HOME_REDIRECT_URL]);
          this.loginForm?.setErrors(null);
        },
        (error: any) => {
          console.log(error);
          this.loginForm?.setErrors({
            wrongLogin: error?.error?.detail,
          });
          console.log(this.loginForm);

          // if (error.status === 401) {
          //   this.alertService.presentErrorAlert(error?.error?.detail);
          // }
        }
      );
  }

  appleSignIn() {
    console.log(Capacitor.getPlatform());
    // this.platformName = Capacitor.getPlatform();
    // if (Capacitor.getPlatform() === 'web') {
    //   this.authService.signInWithAppleWeb();
    // } else {
    this.authService.signInWithAppleNative();
    // }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  ionViewDidLeave() {
    this.loginForm.reset();
  }
}
