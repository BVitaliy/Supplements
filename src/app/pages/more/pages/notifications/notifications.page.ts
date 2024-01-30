import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ProfileDetailsFields } from '../profile-details/profile-details.models';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage {
  constructor(public navCtrl: NavController) {}

  public handleSaveChanges(): void {
    // save changes
  }

  protected readonly ProfileDetailsFields = ProfileDetailsFields;
}
