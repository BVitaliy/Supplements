import { Component } from '@angular/core';
import { ManageFavoriteListModel, ManageFavoriteListModes } from '../manage-favorite-list/manage-favorite-list.models';
import { ManageFavoriteListPage } from '../manage-favorite-list/manage-favorite-list.page';
import { ModalController } from '@ionic/angular';
import { FavoritesList } from '../favorites.models';

@Component({
  selector: 'app-add-favorite-list-product',
  templateUrl: './add-favorite-list-product.page.html',
  styleUrls: ['./add-favorite-list-product.page.scss'],
})
export class AddFavoriteListProductPage {
  public favoritesList: FavoritesList[] = [
    {
      id: 1,
      listName: 'My favorite supplements',
      listDescription: 'Only favorite supplements will be in this list',
      products: [],
    },
    {
      id: 2,
      listName: 'My favorite supplements 2',
      listDescription: 'Only favorite supplements will be in this list 2',
      products: [],
    },
  ];
  public selectedListsIds: number[] = [];

  constructor(private modalCtrl: ModalController) { }

  public async showCreateListModal(): Promise<void> {
    const dialogConf: ManageFavoriteListModel = {
      mode: ManageFavoriteListModes.create,
      titleText: 'Create new list',
      buttonText: 'Create',
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
        // create favorite list
      }
    });
    return await modal.present();
  }

  public handleApply(): void {
    this.modalCtrl.dismiss({
      selectedListsIds: this.selectedListsIds,
    });
  }

  public checkboxChangeState(_e: any, id: number): void {
    if (!!this.selectedListsIds.find((el: number): boolean => el === id)) {
      this.selectedListsIds = this.selectedListsIds.filter((el: number): boolean => el !== id);
    } else {
      this.selectedListsIds.push(id);
    }
  }
}
