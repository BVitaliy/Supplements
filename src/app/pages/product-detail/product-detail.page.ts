import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { IngredientOption } from 'src/app/core/models/highlighted-ingredients.models';
import { ProductAlertPopupComponent } from 'src/app/shared/components/product-alert-popup/product-alert-popup.component';
import { CatalogService } from '../catalog/catalog.service';
import { MainService } from '../main/main.service';
import { IngredientDetailModalComponent } from './components/ingredient-detail-modal/ingredient-detail-modal.component';
import { IngredientModalComponent } from './components/ingredient-modal/ingredient-modal.component';
import { HighlightedIngredientsPage } from './pages/highlighted-ingredients/highlighted-ingredients.page';
import { ReviewsPage } from './pages/reviews/reviews.page';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  @Input() openedInModal = false;
  @Input() id: any;
  loading: boolean = true;
  product: any;
  analysis: any;
  type = 'ingredient';
  backgroundColors = ['#22b51f', '#FF001C', '#FF9635', '#FDE334'];
  dataChart: any;
  addedHIngredientsOptions: IngredientOption[] = [];
  reviews = [];
  countChart = 0;
  public ingredients: any[] = [];

  constructor(
    public navCtrl: NavController,
    // private loadingController: LoadingController,
    // private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private catalogService: CatalogService,
    private route: ActivatedRoute,
    private mainService: MainService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
    this.getProduct();
    this.getProductReviewById();
    this.setProductAsViewed();
    this.getProductAnalysis();
    this.getIngrediens();
  }

  // Рефреш продукту
  doRefresh(event: any) {
    this.getProduct(true, () => event.target.complete());
    this.getProductAnalysis();
    this.getIngrediens();
  }

  getIngrediens() {
    let data = {
      highlighted: true,
      limit: 200,
    };
    this.ingredients = [];
    this.mainService
      .searchIngredients(data)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (data: any) => {
          const ingredients = this.objectToArray(data?.results);

          ingredients.forEach((brand: any) => {
            console.log(brand);
            this.ingredients = [...this.ingredients, ...brand?.brands];
          });
        },
        (error: any) => {}
      );
  }

  getProduct(refresh?: boolean, callbackFunction?: () => void) {
    this.loading = true;
    this.catalogService
      .getProductById(this.id, refresh)
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
          if (data) {
            this.product = data;
          }
        },
        (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  getProductReviewById(refresh?: boolean, callbackFunction?: () => void) {
    this.loading = true;
    this.catalogService
      .getProductReviewById(this.id, refresh)
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
          if (data) {
            this.reviews = data;
          }
        },
        (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  getProductAnalysis() {
    this.catalogService
      .getProductAnalysis(this.id)
      .pipe(finalize(() => {}))
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data) {
            this.analysis = data;
            this.dataChart = [
              data?.benefits,
              data?.weaknesses,
              data?.contamintants,
              data?.allergens,
            ];
            this.countChart =
              data?.benefits +
              data?.weaknesses +
              data?.contamintants +
              data?.allergens;
          }
        },
        (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  setProductAsViewed() {
    this.catalogService.setToHistory(this.id).subscribe(
      (data: any) => {},
      (error: any) => {}
    );
  }

  shopNowProduct() {
    if (this.openedInModal) {
      this.openAlertModal();
    }
  }

  actionAlert() {
    if (this.openedInModal) {
      this.openAlertModal();
    }
  }
  favoriteHandle($event: any) {
    if (this.openedInModal) {
      this.openAlertModal();
    }
  }

  // Зміна типу сторінки
  setType(event: any) {
    this.type = event?.detail?.value;
  }

  // Відкривання модалки ingredient
  async openIngredientsModal(detailinfo: any) {
    const modal = await this.modalController.create({
      component: IngredientModalComponent,
      cssClass: '',
      mode: 'ios',
      handle: false,
      componentProps: {
        product: this.product,
        indregientsDetail: detailinfo,
      },
    });

    return await modal.present();
  }

  // Відкривання модалки ingredient detail
  async openIngredientModal(title?: string, color?: string) {
    const modal = await this.modalController.create({
      component: IngredientDetailModalComponent,
      cssClass: '',
      mode: 'ios',
      breakpoints: [0, 0.85, 1],
      initialBreakpoint: 0.85,
      handle: true,
      componentProps: {
        title,
        color,
      },
    });

    return await modal.present();
  }

  // Відкривання модалки Highlighted ingredients
  async openHighlightedModal() {
    if (this.openedInModal) {
      this.openAlertModal();
    } else {
      const modal = await this.modalController.create({
        component: HighlightedIngredientsPage,
        cssClass: '',
        mode: 'ios',
        handle: true,
        componentProps: {
          addedHIngredientsOptions: this.addedHIngredientsOptions,
        },
      });

      modal.onDidDismiss().then((returnedData: any) => {
        if (returnedData && returnedData?.data) {
          this.addedHIngredientsOptions = returnedData?.data;

          this.addedHIngredientsOptions.forEach((el, index) => {
            this.switchHighlightedIng(el);
            if (index === this.addedHIngredientsOptions.length - 1) {
              setTimeout(() => {
                this.getIngrediens();
              }, 300);
            }
          });
        }
      });

      return await modal.present();
    }
  }

  switchHighlightedIng(item: any) {
    this.catalogService
      .switchHighlightedIng(item.id)
      .pipe(finalize(() => {}))
      .subscribe(
        (data: any) => {
          console.log(data);
        },
        (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  async cancelModal(closeAll = false) {
    await this.modalController.dismiss(closeAll);
  }

  closePage() {
    if (this.openedInModal) {
      this.cancelModal();
    } else {
      this.navCtrl.back();
    }
  }

  goToReview() {
    if (this.openedInModal) {
      this.openAlertModal();
    } else {
      // this.navCtrl.navigateForward('/product/reviews');
      this.openReviewModal();
    }
  }

  async openAlertModal() {
    const modal = await this.modalController.create({
      component: ProductAlertPopupComponent,
      cssClass: 'alert-modal',
      mode: 'ios',
      handle: false,
      componentProps: {},
    });

    modal.onDidDismiss().then((returnedData: any) => {
      if (returnedData && returnedData?.data) {
        console.log(returnedData);
        this.cancelModal(true);
      }
    });

    return await modal.present();
  }

  async openReviewModal() {
    const modal = await this.modalController.create({
      component: ReviewsPage,
      cssClass: '',
      mode: 'ios',
      handle: false,
      componentProps: {
        product: this.product,
        reviews: this.reviews,
      },
    });

    modal.onDidDismiss().then((returnedData: any) => {
      if (returnedData && returnedData?.data) {
        console.log(returnedData);
      }
    });

    return await modal.present();
  }
  objectToArray(obj: { [key: string]: any }): { label: string; brands: any }[] {
    return Object.keys(obj).map((key) => ({ label: key, brands: obj[key] }));
  }
}
