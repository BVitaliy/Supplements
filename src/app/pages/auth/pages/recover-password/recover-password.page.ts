import { Component, OnInit, ViewChild } from '@angular/core';
import {
  LoadingController,
  ModalController,
  NavController,
  Platform,
  ViewWillEnter,
  ViewWillLeave,
} from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { matchFieldsValidator } from '../../../../core/validators/password.validator';
import { emailPattern } from '../../../../core/validators/email.validator';

import { Subscription } from 'rxjs';
import { ThankComponent } from '../../../../shared/components/thank/thank.component';
// import { CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { APP_AUTH_REDIRECT_URL } from 'src/app/app.config';
// import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.page.html',
  styleUrls: ['./recover-password.page.scss'],
})
export class RecoverPasswordPage
  implements OnInit, ViewWillLeave, ViewWillEnter
{
  // @ViewChild('countdown', { static: false })
  // private countdown: CountdownComponent;
  step = 3;
  recoverForm: FormGroup;
  inputFocusClass = false;
  submitTouched = false;
  backBtnSubscribtion!: Subscription;

  countDone = false;

  otpConfig = {
    allowNumbersOnly: true,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '48px',
      height: '56px',
      background: 'none',
    },
  };
  isOtpTouched = false;
  codeValid: boolean = false;
  showPassword: string = '';

  constructor(
    public navCtrl: NavController,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private platform: Platform // private translate: TranslateService, // private authService: AuthenticationService
  ) {
    this.recoverForm = new FormGroup(
      {
        email: new FormControl(null, [
          Validators.required,
          Validators.pattern(emailPattern),
        ]),
        code: new FormControl(null, [
          Validators.required,
          Validators.minLength(4),
        ]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirm_password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
      },
      { validators: matchFieldsValidator('password', 'confirm_password') }
    );
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.backBtnSubscribtion = this.platform.backButton.subscribeWithPriority(
      9991,
      () => {
        this.back();
      }
    );

    this.countDone = false;
  }

  back() {
    if (this.step === 1) {
      this.navCtrl.back();
      return;
    } else if (this.step === 2) {
      this.step = 1;
      return;
    } else if (this.step === 3) {
      this.step = 1;
      return;
    }
  }

  // handleCountDownEvent($event: CountdownEvent) {
  //   const done = $event.action === 'done';
  //   if (done) {
  //     this.countDone = true;
  //   }
  // }

  onOtpChange(code: string) {
    this.codeValid = false;
    this.isOtpTouched = true;
    this.recoverForm.get('code')?.setValue(code);
    // if (this.recoverForm.get('code')?.valid) {
    //   this.authService.checkRestoreValidCode({email: this.recoverForm.get('email').value, code: this.recoverForm.get('code').value})
    //   .pipe(finalize(() => {
    this.codeValid = true;
    // }))
    //   .subscribe(
    //     (data: any) => {
    //       if (data !== true) {
    //         this.recoverForm.get('code').setErrors({incorrect: this.translate.instant('RECOVER.incorrect')});
    //       }
    //     },
    //     (error: any) => {}
    //   );
    // }
  }

  backToAuth() {
    this.navCtrl.navigateForward([APP_AUTH_REDIRECT_URL]);
  }

  async sendEmail() {
    // this.recoverForm.get('code').reset();
    // const loading = await this.loadingController.create({
    // message: this.translate.instant('RECOVER.wait'),
    // duration: 2000,
    // });
    // await loading.present().then(() => {
    //   if (this.recoverForm.get('email').valid) {
    //     this.authService.forgotPassword(this.recoverForm.value)
    //     .pipe(finalize(() => {
    //       loading.dismiss();
    //     }))
    //     .subscribe(
    //       (data: any) => {
    this.step = 2;
    //         this.countDone = false;
    //         setTimeout(() => {
    //           this.countdown.restart();
    //         }, 100);
    //       },
    //       (error: any) => {}
    //     );
    //   }
    // });
  }

  async checkCode() {
    // if (this.recoverForm.get('code').valid) {
    this.step = 3;
    // } else {
    //   this.recoverForm
    //     .get('code')
    //     .setErrors({ incorrect: this.translate.instant('RECOVER.incorrect') });
    // }
  }

  async saveNewPassword() {
    this.step = 4;
    // const loading = await this.loadingController.create({
    //   message: this.translate.instant('RECOVER.wait'),
    //   // duration: 2000,
    // });
    // await loading.present().then(() => {
    //   if (this.recoverForm.valid) {
    //     this.authService.restorePassword(this.recoverForm.value)
    //     .pipe(finalize(() => {
    //       loading.dismiss();
    //     }))
    //     .subscribe(
    //       (data: any) => {
    // this.presentModal();
    //       },
    //       (error: any) => { }
    //     );
    //   }
    // });
  }

  toggleShowPassword(field: string) {
    if (this.showPassword === field) {
      this.showPassword = '';
    } else {
      this.showPassword = field;
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ThankComponent,
      cssClass: 'full-screen-modal',
      mode: 'ios',
      componentProps: {
        header: 'Вітаємо',
        title: 'Ваш пароль успішно змінено',
        description:
          'Тепер ви можете увійти у свій профіль за допомогою нового паролю',
        buttonRouterUrl: APP_AUTH_REDIRECT_URL,
        icon: './assets/img/icon/password-recover.svg',
        hasCloseBtn: false,
        buttonText: 'увійти',
      },
    });
    return await modal.present();
  }

  ionViewWillLeave() {
    this.step = 1;
    this.recoverForm.reset();
    if (this.backBtnSubscribtion) {
      this.backBtnSubscribtion.unsubscribe();
    }
  }
}
