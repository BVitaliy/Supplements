import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  LoadingController,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular';
import { finalize } from 'rxjs';
import {
  ACCESS_TOKEN_STORAGE_NAME,
  APP_HOME_REDIRECT_URL,
} from 'src/app/app.config';
import { AlertService } from 'src/app/core/services/alert.service';
import {
  emailPattern,
  onlyLetters,
} from 'src/app/core/validators/email.validator';
import { matchFieldsValidator } from 'src/app/core/validators/password.validator';
import { DoneComponent } from 'src/app/shared/components/done/done.component';
import { AuthenticationService } from '../../authentication.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  form!: FormGroup;
  showPassword: boolean = false;
  showPasswordRepeat: boolean = false;
  public showRepeatNewPassword: boolean = false;
  formattedDate!: string | null;
  modalHeight!: number;

  constructor(
    public navCtrl: NavController,
    private datePipe: DatePipe,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private authService: AuthenticationService,
    private alertService: AlertService,
    private storage: Storage,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.modalHeight =
      Math.floor(
        (100 * (270 + (this.platform.is('ios') ? 34 : 0))) / window.innerHeight
      ) / 100;

    this.form = new FormGroup(
      {
        first_name: new FormControl(null, [
          Validators.required,
          Validators.pattern(onlyLetters),
        ]),
        last_name: new FormControl(null, [
          Validators.required,
          Validators.pattern(onlyLetters),
        ]),
        email: new FormControl(null, [
          Validators.required,
          Validators.pattern(emailPattern),
        ]),
        // date_of_birth_text: new FormControl(null),
        date_of_birth: new FormControl(null, [Validators.required]),
        gender: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [
          Validators.required,
          Validators.pattern(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,}/
          ),
        ]),
        confirm_password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
        ]),
      },
      {
        validators: matchFieldsValidator('password', 'confirm_password'),
      }
    );
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  toggleShowPasswordRepeat() {
    this.showPasswordRepeat = !this.showPasswordRepeat;
  }
  // Фотматування дати народження
  setFormattedBirth(event: any) {
    // this.form
    //   .get('date_of_birth')!
    //   .setValue(new Date(event?.detail?.value).toISOString());
    this.formattedDate = this.datePipe.transform(
      new Date(event?.detail?.value),
      'yyyy-MM-dd'
    );
    this.form.get('date_of_birth')!.setValue(this.formattedDate);
  }

  async createAccount() {
    const loading = await this.loadingController.create({
      message: 'Wait...',
      mode: 'ios',
    });
    await loading.present().then(() => {
      let date = null;
      if (
        this.form.value?.date_of_birth
        // && this.form.value?.date_of_birth?.length === 8
      ) {
        const birth = this.form.value?.date_of_birth;
        const year = birth.substring(0, 4);
        const month = birth.substring(4, 6);
        const day = birth.substring(6, 8);
        date = year + '-' + month + '-' + day;
      }

      this.authService
        .signup({ ...this.form.value, date_of_birth: date })
        .pipe(
          finalize(() => {
            loading?.dismiss();
          })
        )
        .subscribe(
          (data: any) => {
            this.storage.set(ACCESS_TOKEN_STORAGE_NAME, data?.token?.access);
            this.navCtrl.navigateForward([APP_HOME_REDIRECT_URL]);
            this.presentModal();
            if (this.platform.is('hybrid')) {
              setTimeout(() => {
                this.authService.handleRegisterDevice();
              }, 1000);
            }
          },
          (error: any) => {
            if (error?.error?.email) {
              this.form?.get('email')?.setErrors({
                wrong: error?.error?.email[0],
              });
            }
            if (error?.error?.date_of_birth) {
              this.form?.get('date_of_birth')?.setErrors({
                wrong: error?.error?.date_of_birth[0],
              });
            }
            this.form?.setErrors(error?.error);
            // this.alertService.presentErrorAlert(error?.email?.error);

            if (error.status === 401) {
              this.alertService.presentErrorAlert('Something went wrong');
            }
          }
        );
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: DoneComponent,
      cssClass: 'ios-modal-safe-top-offset thank-modal full-screen-modal',
      mode: 'ios',
      componentProps: {
        buttonRouterUrl: APP_HOME_REDIRECT_URL,
        imgSrc: './assets/img/icons/icon-done-signup.svg',
      },
    });
    return await modal.present();
  }

  ionViewDidLeave() {
    this.form.reset();
  }
}
