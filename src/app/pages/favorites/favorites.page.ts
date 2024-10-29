import { Component } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { ManageFavoriteListPage } from './manage-favorite-list/manage-favorite-list.page';
import {
  ManageFavoriteListModel,
  ManageFavoriteListModes,
} from './manage-favorite-list/manage-favorite-list.models';
import { FavoritesList } from './favorites.models';
import { Products } from '../../../mock/products';
import { finalize } from 'rxjs';
import { FavoriteService } from './favorites.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { ThemeOptionsService } from 'src/app/core/services/theme-options.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage {
  loading = true;
  public favoritesList: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private favoriteService: FavoriteService,
    private alertService: AlertService,
    private platform: Platform,
    private themeOptions: ThemeOptionsService
  ) {}

  public async showCreateListModal(): Promise<void> {
    const dialogConf: ManageFavoriteListModel = {
      mode: ManageFavoriteListModes.create,
      titleText: 'Create new list',
      buttonText: 'Create',
    };
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: ManageFavoriteListPage,
      // breakpoints: [0, 0.3, 0.6, 0.8, 1],
      // initialBreakpoint: 0.6,
      cssClass: 'auto-height',
      componentProps: {
        mode: dialogConf.mode,
        titleText: dialogConf.titleText,
        buttonText: dialogConf.buttonText,
      },
    });
    modal.onDidDismiss().then((data) => {
      if (data?.data) {
        if (data?.data?.mode === 'Create') {
          this.createList(data?.data);
        }
      }
    });
    return await modal.present();
  }

  public handleOpenListDetails(listId: number): void {
    let detail = this.favoritesList.find((el) => el.id === listId);
    detail.favoriteId = detail.id;
    this.navCtrl.navigateForward([
      `home/tabs/tab/favorites/favorite-list-details/${listId}`,
      { item: JSON.stringify(detail) },
    ]);
  }

  ionViewWillEnter() {
    this.getFavorites();
    if (this.platform.is('hybrid')) {
      this.themeOptions.setStatusBarWhite();
    }
  }

  // Рефреш даних
  doRefresh(event: any) {
    this.getFavorites(true, () => event.target.complete());
  }

  getFavorites(refresh?: boolean, callbackFunction?: () => void) {
    this.loading = true;
    this.favoriteService
      .getFavorites(refresh)
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
          console.log(data);
          this.favoritesList = data.results;
        },
        (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  createList(data: any) {
    this.loading = true;
    this.favoriteService
      .createFavList(data)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          // this.favoritesList = data.results;
          this.alertService.createToast({
            header: `List ${data?.name} was successfully created!`,
            mode: 'ios',
            position: 'bottom',
          });
          this.getFavorites();
        },
        (error: any) => {}
      );
  }
}
