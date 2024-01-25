import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ManageFavoriteListModes } from '../manage-favorite-list/manage-favorite-list.models';

@Component({
  selector: 'app-favorite-list-actions',
  templateUrl: './favorite-list-actions.page.html',
  styleUrls: ['./favorite-list-actions.page.scss'],
})
export class FavoriteListActionsPage {
  public listActions: typeof ManageFavoriteListModes = ManageFavoriteListModes;

  constructor(public modalCtrl: ModalController) { }

  public handleAction(action: ManageFavoriteListModes): void {
    this.modalCtrl.dismiss({
      action,
    });
  }

}
