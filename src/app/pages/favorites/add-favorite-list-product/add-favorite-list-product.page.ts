import { Component, Input } from '@angular/core';
import {
  ManageFavoriteListModel,
  ManageFavoriteListModes,
} from '../manage-favorite-list/manage-favorite-list.models';
import { ManageFavoriteListPage } from '../manage-favorite-list/manage-favorite-list.page';
import { ModalController } from '@ionic/angular';
import { FavoritesList } from '../favorites.models';
import { finalize } from 'rxjs';
import { FavoriteService } from '../favorites.service';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-add-favorite-list-product',
  templateUrl: './add-favorite-list-product.page.html',
  styleUrls: ['./add-favorite-list-product.page.scss'],
})
export class AddFavoriteListProductPage {
  @Input() product: any;
  public favoritesList: FavoritesList[] = [];
  public selectedListsIds: number[] = [];
  isLoading = false;

  constructor(
    private modalCtrl: ModalController,
    private favoriteService: FavoriteService,
    private alertService: AlertService
  ) {
    this.getFavorites();
  }

  public async showCreateListModal(): Promise<void> {
    const dialogConf: ManageFavoriteListModel = {
      mode: ManageFavoriteListModes.create,
      titleText: 'Create new list',
      buttonText: 'Create',
    };
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: ManageFavoriteListPage,
      // breakpoints: [0, 0.3, 0.6, 0.8],
      // initialBreakpoint: 0.6,
      cssClass: 'auto-height',
      componentProps: {
        mode: dialogConf.mode,
        titleText: dialogConf.titleText,
        buttonText: dialogConf.buttonText,
      },
    });
    modal.onDidDismiss().then((data) => {
      if (data?.data?.mode === 'Create') {
        this.createList(data?.data);
      }
    });
    return await modal.present();
  }

  createList(data: any) {
    this.isLoading = true;
    this.favoriteService
      .createFavList(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
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

  public handleApply(): void {
    this.modalCtrl.dismiss({
      selectedListsIds: this.selectedListsIds,
    });
  }

  public checkboxChangeState(_e: any, id: number): void {
    if (!!this.selectedListsIds.find((el: number): boolean => el === id)) {
      this.selectedListsIds = this.selectedListsIds.filter(
        (el: number): boolean => el !== id
      );
    } else {
      this.selectedListsIds.push(id);
    }
  }

  getFavorites() {
    this.isLoading = true;
    this.favoriteService
      .getFavorites()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.favoritesList = data.results;
        },
        (error: any) => {}
      );
  }
}
