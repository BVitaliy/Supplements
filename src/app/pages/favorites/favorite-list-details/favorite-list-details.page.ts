import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { FavoriteListActionsPage } from '../favorite-list-actions/favorite-list-actions.page';
import { ManageFavoriteListModel, ManageFavoriteListModes } from '../manage-favorite-list/manage-favorite-list.models';
import { ManageFavoriteListPage } from '../manage-favorite-list/manage-favorite-list.page';
import { Products } from '../../../../mock/products';

@Component({
  selector: 'app-favorite-list-details',
  templateUrl: './favorite-list-details.page.html',
  styleUrls: ['./favorite-list-details.page.scss'],
})
export class FavoriteListDetailsPage {
  public listProducts: any[] = [ ...Products ];

  constructor(public navCtrl: NavController, private modalCtrl: ModalController) { }

  public async showListActionsModal(): Promise<void> {
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: FavoriteListActionsPage,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.3,
    });
    modal.onDidDismiss().then(data => {
      if (data?.data) {
        switch (data?.data.action) {
          case ManageFavoriteListModes.update: {
            this.showUpdateListModal();
            break;
          }
          case ManageFavoriteListModes.delete: {
            // delete favorite list
            break;
          }
        }
      }
    });
    return await modal.present();
  }

  public async showUpdateListModal(): Promise<void> {
    const dialogConf: ManageFavoriteListModel = {
      mode: ManageFavoriteListModes.update,
      titleText: 'Edit list',
      buttonText: 'Save',
    };
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: ManageFavoriteListPage,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.5,
      componentProps: {
        mode: dialogConf.mode,
        titleText: dialogConf.titleText,
        buttonText: dialogConf.buttonText,
      },
    });
    modal.onDidDismiss().then(data => {
      if (data?.data) {
        // update favorite list
      }
    });
    return await modal.present();
  }
}
