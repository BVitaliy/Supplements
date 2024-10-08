import { Component, NgZone } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { SubmittedProductsTabs } from './submitted-products.models';
import { Products, ProductsD } from '../../../../../mock/products';
import { AddProductPage } from 'src/app/pages/add-product/add-product.page';
import { ProfileService } from '../../profile.service';
import { finalize, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeOptionsService } from 'src/app/core/services/theme-options.service';

@Component({
  selector: 'app-submitted-products',
  templateUrl: './submitted-products.page.html',
  styleUrls: ['./submitted-products.page.scss'],
})
export class SubmittedProductsPage {
  public loading = false;
  public products: any[] = [];
  public activeTab = 0;
  openId: any;

  refreshSubscription!: Subscription;

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    public router: Router,
    private zone: NgZone,
    private themeOptions: ThemeOptionsService
  ) {
    this.refreshSubscription = this.themeOptions.getRefreshToken().subscribe({
      next: (value: any) => {
        if (value && this.router.url.includes('/submitted-products')) {
          console.log(value);
          setTimeout(() => {
            this.zone.run(() => {
              this.getSubProducts();
            });
          }, 2000);
          this.themeOptions.refreshPage$.next(false);
        }
      },
    });
  }

  ionViewWillEnter() {
    this.openId = this.route.snapshot.paramMap.get('openId');
    if (this.openId) {
      this.openProductInModal(this.openId);
      this.activeTab = 2;
    }
    this.zone.run(() => {
      this.getSubProducts();
    });

    console.log('add product');
  }

  public handleChangeTab(event: any): void {
    this.activeTab = event.target.value;
    this.zone.run(() => {
      this.getSubProducts();
    });
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
    this.zone.run(() => {
      this.getSubProducts(true, () => event.target.complete());
    });
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
      .subscribe({
        next: (data: any) => {
          if (callbackFunction) {
            callbackFunction();
          }
          this.products = data?.results;
          console.log(this.products);
        },
        error: (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        },
      });
  }

  handleEditProduct(event: any) {
    console.log(event);
    this.openProductInModal(event);
  }
  openApproved(product: any) {
    console.log(product);
    console.log(+this.activeTab);
    if (product?.supplement && +this.activeTab === 1) {
      this.navCtrl.navigateForward([
        '/product/detail',
        product?.supplement?.id,
      ]);
    }
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

  ionViewWillLeave() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
