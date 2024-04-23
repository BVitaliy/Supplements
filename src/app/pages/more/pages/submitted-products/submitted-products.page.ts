import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { SubmittedProductsTabs } from './submitted-products.models';
import { Products, ProductsD } from '../../../../../mock/products';
import { AddProductPage } from 'src/app/pages/add-product/add-product.page';
import { ProfileService } from '../../profile.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-submitted-products',
  templateUrl: './submitted-products.page.html',
  styleUrls: ['./submitted-products.page.scss'],
})
export class SubmittedProductsPage {
  public loading = false;
  public products: any[] = [];
  public activeTab = 0;

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private profileService: ProfileService
  ) {}

  ionViewWillEnter() {
    this.getSubProducts();
  }

  public handleChangeTab(event: any): void {
    this.activeTab = event?.detail?.value;
    this.getSubProducts();
  }

  // handleOpenEditDetails(id: any) {
  //   console.log(id);
  //   this.openProductEditModal(id);
  // }

  // async openProductEditModal(id: any) {
  //   const modal = await this.modalController.create({
  //     component: AddProductPage,
  //     cssClass: '',
  //     mode: 'ios',
  //     componentProps: {
  //       id,
  //     },
  //   });

  //   modal.onDidDismiss().then((returnedData: any) => {
  //     if (returnedData && returnedData?.data) {
  //       console.log(returnedData);
  //     }
  //   });

  //   return await modal.present();
  // }

  doRefresh(event: any) {
    this.getSubProducts(true, () => event.target.complete());
  }

  getSubProducts(refresh?: boolean, callbackFunction?: () => void) {
    this.loading = true;
    this.profileService
      .getSubProducts(this.activeTab, refresh)
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
          this.products = data?.results;
        },
        (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  handleEditProduct(event: any) {
    console.log(event);
    this.openProductInModal(event);
  }

  async openProductInModal(id: string) {
    const modal = await this.modalController.create({
      component: AddProductPage,
      cssClass: '',
      mode: 'ios',
      handle: true,
      componentProps: {
        id: id,
      },
    });

    modal.onDidDismiss().then((returnedData: any) => {
      if (returnedData && returnedData?.data) {
        console.log(returnedData);
        setTimeout(() => {
          this.getSubProducts();
        }, 1000);
      }
    });

    return await modal.present();
  }
}
