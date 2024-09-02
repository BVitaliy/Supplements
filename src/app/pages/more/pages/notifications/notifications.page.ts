import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { ProfileService } from '../../profile.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  form!: FormGroup;
  loading = false;

  constructor(
    public navCtrl: NavController,
    private profileService: ProfileService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      favorite_products: new FormControl(false),
      submission_in_db: new FormControl(false),
      promotional: new FormControl(false),
    });
  }

  public handleSaveChanges(): void {
    this.loading = true;
    this.profileService
      .setNotifications(this.form.value)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (data: any) => {
          this.alertService.createToast({
            header: 'Notifications was successfully updated!',
            mode: 'ios',
            position: 'bottom',
          });
        },
        (error: any) => {}
      );
  }

  // Рефреш даних користувача
  doRefresh(event: any) {
    this.getData(() => event.target.complete());
  }

  getData(callbackFunction?: () => void) {
    this.loading = true;
    this.profileService
      .getNotifications()
      .pipe(
        finalize(() => {
          this.loading = false;
          if (callbackFunction) {
            callbackFunction();
          }
        })
      )
      .subscribe(
        (data: any) => {
          this.form.patchValue(data);
        },
        (error: any) => {}
      );
  }
}
