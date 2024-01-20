import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import {
  emailPattern,
  onlyLetters,
} from 'src/app/core/validators/email.validator';
import { matchFieldsValidator } from 'src/app/core/validators/password.validator';

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

  constructor(public navCtrl: NavController, private datePipe: DatePipe) {}

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
      'MM/dd/yyyy'
    );
  }

  ionViewDidLeave() {
    this.form.reset();
  }
}
