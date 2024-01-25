import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ManageFavoriteListPage } from './manage-favorite-list/manage-favorite-list.page';
import { ManageFavoriteListModel, ManageFavoriteListModes } from './manage-favorite-list/manage-favorite-list.models';
import { FavoritesList } from './favorites.models';
import { Products } from '../../../mock/products';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage {
  public favoritesList: FavoritesList[] = [
    {
      id: 1,
      listName: 'My favorite supplements',
      listDescription: 'Only favorite supplements will be in this list',
      products: [ ...Products, ...Products ],
    },
    {
      id: 2,
      listName: 'My favorite supplements 2',
      listDescription: 'Only favorite supplements will be in this list 2',
      products: [ ...Products ],
    },
    {
      id: 3,
      listName: 'My favorite supplements 3',
      listDescription: 'Only favorite supplements will be in this list 3',
      products: [],
    },
  ];

  constructor(public navCtrl: NavController, private modalCtrl: ModalController) { }

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
        this.favoritesList.push({
          id: Math.random(),
          listName: data?.data?.listName,
          listDescription: data?.data?.listDescription,
          products: [],
        });
      }
    });
    return await modal.present();
  }

  public handleOpenListDetails(listId: number): void {
    this.navCtrl.navigateRoot(`home/tabs/tab/favorites/favorite-list-details/${listId}`);
  }
}
