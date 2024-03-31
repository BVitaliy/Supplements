import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert.service';
import { ProfileService } from '../../profile.service';
import { matchFieldsValidator } from 'src/app/core/validators/password.validator';
import { finalize } from 'rxjs';

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
  loading = false;
  modalHeight: number = 0;
  showPassword: string = '';

  constructor(
    public navCtrl: NavController,
    private profileService: ProfileService,
    private alertService: AlertService
  ) {}

  public ngOnInit(): void {
    this.form = new FormGroup(
      {
        old_password: new FormControl(null, [
          Validators.required,
          Validators.pattern(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
          ),
        ]),
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
  }

  toggleShowPassword(field: string) {
    if (this.showPassword === field) {
      this.showPassword = '';
    } else {
      this.showPassword = field;
    }
  }

  public handleSaveChanges(): void {
    // save changes
    this.loading = true;
    console.log('form', this.form.value);
    this.profileService
      .updatePassword(this.form.value)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.form.reset();
          this.alertService.createToast({
            header: 'Password was successfully updated!',
            mode: 'ios',
            position: 'bottom',
          });
        },
        (error: any) => {
          if (error.status === 401) {
            this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }
}
