import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { APP_HOME_REDIRECT_URL } from 'src/app/app.config';
import {
  emailPattern,
  onlyLetters,
} from 'src/app/core/validators/email.validator';
import { matchFieldsValidator } from 'src/app/core/validators/password.validator';
import { DoneComponent } from 'src/app/shared/components/done/done.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  form!: FormGroup;
  showPassword: string = '';
  formattedDate!: string | null;
  modalHeight!: number;

  constructor(
    public navCtrl: NavController,
    private datePipe: DatePipe,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.form = new FormGroup(
      {
        name: new FormControl(null, [
          Validators.required,
          Validators.pattern(onlyLetters),
        ]),
        email: new FormControl(null, [
          Validators.required,
          Validators.pattern(emailPattern),
        ]),
        birth_date: new FormControl(null, [Validators.required]),
        sex: new FormControl(null, [Validators.required]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirm_password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
      },
      {
        validators: matchFieldsValidator('password', 'confirm_password'),
      }
    );
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
    this.form
      .get('birth_date')!
      .setValue(new Date(event?.detail?.value).toISOString());
    this.formattedDate = this.datePipe.transform(
      new Date(event?.detail?.value),
      'dd/MM/yyyy'
    );
  }

  createAccount() {
    this.presentModal();
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
