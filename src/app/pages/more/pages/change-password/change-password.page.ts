import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage {
  public form!: FormGroup;
  public showCurrentPassword: boolean = false;
  public showNewPassword: boolean = false;
  public showRepeatNewPassword: boolean = false;

  constructor(public navCtrl: NavController) {}

  public ngOnInit(): void {
    this.form = new FormGroup(
      {
        currentPassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        newPassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        repeatNewPassword: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
      },
    );
  }

  public handleSaveChanges(): void {
    // save changes
    console.log('form', this.form);
  }
}
