import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { FavoriteListActionsPage } from '../favorite-list-actions/favorite-list-actions.page';
import {
  ManageFavoriteListModel,
  ManageFavoriteListModes,
} from '../manage-favorite-list/manage-favorite-list.models';
import { ManageFavoriteListPage } from '../manage-favorite-list/manage-favorite-list.page';
import { Products } from '../../../../mock/products';
import { ActivatedRoute } from '@angular/router';
import { FavoriteService } from '../favorites.service';
import { finalize } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'app-favorite-list-details',
  templateUrl: './favorite-list-details.page.html',
  styleUrls: ['./favorite-list-details.page.scss'],
})
export class FavoriteListDetailsPage {
  data: any;
  public listProducts: any[] = [];
  id: any;
  loading = false;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    private favoriteService: FavoriteService,
    private alertService: AlertService
  ) {}

  ionViewWillEnter() {
    this.id = this.route.snapshot.paramMap.get('favoriteId');
    this.getFavoritesDetail(this.id);

    const getValue = this.route.snapshot.paramMap.get('item') || '';
    this.data = JSON.parse(getValue);
    console.log(this.data);
  }

  public async showListActionsModal(): Promise<void> {
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: FavoriteListActionsPage,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.3,
    });
    modal.onDidDismiss().then((data) => {
      if (data?.data) {
        switch (data?.data.action) {
          case ManageFavoriteListModes.update: {
            this.showUpdateListModal();
            break;
          }
          case ManageFavoriteListModes.delete: {
            this.deleteList();
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
        name: this.data?.name || '',
        description: this.data?.description || '',
      },
    });
    modal.onDidDismiss().then((data) => {
      const values = data?.data;
      if (values) {
        this.updateDetail({
          name: values?.name,
          description: values?.description,
        });
        console.log(data);
        // update favorite list
      }
    });
    return await modal.present();
  }

  // Рефреш даних
  doRefresh(event: any) {
    this.getFavoritesDetail(true, () => event.target.complete());
  }

  getFavoritesDetail(refresh?: boolean, callbackFunction?: () => void) {
    this.loading = true;
    this.favoriteService
      .getFavoritesDetail(this.id, refresh)
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
          this.listProducts = data.supplements;
        },
        (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  updateDetail(values: any) {
    // this.loading = true;
    this.favoriteService
      .updateFavoritesDetail(this.id, values)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.alertService.createToast({
            header: `List "${data?.name}" was successfully updated!`,
            mode: 'ios',
            position: 'bottom',
          });
          this.data = data;
          // this.listProducts = data.supplements;
        },
        (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }
  deleteList() {
    // this.loading = true;
    this.favoriteService
      .deleteList(this.id)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.alertService.createToast({
            header: `List  was successfully deleted!`,
            mode: 'ios',
            position: 'bottom',
          });
          this.navCtrl.back();
        },
        (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  reloadPage() {
    this.getFavoritesDetail(this.id);
  }
}
