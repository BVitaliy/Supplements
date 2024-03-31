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
  showPassword: string = '';
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
        date_of_birth_text: new FormControl(null, [Validators.required]),
        date_of_birth: new FormControl(null, [Validators.required]),
        gender: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [
          Validators.required,
          Validators.pattern(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
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
    this.modalHeight =
      Math.floor(
        (100 * (270 + (this.platform.is('ios') ? 34 : 0))) / window.innerHeight
      ) / 100;
  }

  toggleShowPassword(field: string) {
    if (this.showPassword === field) {
      this.showPassword = '';
    } else {
      this.showPassword = field;
    }
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

    this.authService
      .signup(this.form.value)
      .pipe(
        finalize(() => {
          loading?.dismiss();
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);

          this.storage.set(ACCESS_TOKEN_STORAGE_NAME, data?.token?.access);
          this.navCtrl.navigateForward([APP_HOME_REDIRECT_URL]);
          this.presentModal();
        },
        (error: any) => {
          console.log(error);

          if (error?.error?.email) {
            this.form?.setErrors({
              wrong: error?.error?.email?.error,
            });
          }
          // this.alertService.presentErrorAlert(error?.email?.error);

          console.log(this.form);

          if (error.status === 401) {
            this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
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
