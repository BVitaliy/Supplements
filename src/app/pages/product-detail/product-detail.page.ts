import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Storage } from '@ionic/storage';
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
import { ACCESS_TOKEN_STORAGE_NAME } from 'src/app/app.config';
import { SwiperComponent } from 'swiper/angular';
import Swiper, { SwiperOptions } from 'swiper';
import { Share } from '@capacitor/share';

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

  isExpanded: boolean = true;
  isButtonVisible: boolean = false;

  @ViewChild('textContent') textContent!: ElementRef;

  @ViewChild('swiper') swiper!: SwiperComponent;
  slideOpts: SwiperOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 700,
    parallax: true,
    lazy: {
      loadPrevNext: true,
      loadPrevNextAmount: 2,
    },
    pagination: true,
  };

  constructor(
    public navCtrl: NavController,
    // private loadingController: LoadingController,
    // private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private catalogService: CatalogService,
    private route: ActivatedRoute,
    private mainService: MainService,
    private storage: Storage
  ) {}

  ngOnInit() {
    this.id = this.id || this.route.snapshot.paramMap.get('id');
    this.getProduct();
    this.getProductReviewById();
    this.getProductAnalysis();
    this.storage.get(ACCESS_TOKEN_STORAGE_NAME).then((token) => {
      if (token) {
        this.setProductAsViewed();
        this.getIngrediens();
      }
    });
  }

  toggleText() {
    this.isExpanded = !this.isExpanded;
  }

  ngAfterContentChecked() {
    if (this.swiper) {
      this.swiper.updateSwiper(this.slideOpts);
    }
  }

  async shareProduct() {
    if (this.openedInModal) {
      this.openAlertModal();
    } else {
      await Share.share({
        title: this.product?.title,
        text: this.product?.description,
        url: 'http://ionicframework.com/',
        dialogTitle: 'Share with buddies',
      });
    }
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
          if (data) {
            this.product = data;
            if (data?.description) {
              setTimeout(() => {
                const textHeight = this.textContent.nativeElement.scrollHeight;
                if (textHeight > 90) {
                  this.isButtonVisible = true;
                }
              }, 200);
            }
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
  async openIngredientsModal(type: string, title: string, color: string) {
    const ingredients = this.product.ingredients.filter(
      (item: any) => item[type]
    );
    console.log(ingredients);
    const modal = await this.modalController.create({
      component: IngredientModalComponent,
      cssClass: '',
      mode: 'ios',
      handle: false,
      componentProps: {
        product: this.product,
        detail: {
          ingredients: ingredients || [],
          title,
          color,
        },
      },
    });

    return await modal.present();
  }

  // Відкривання модалки ingredient detail
  async openIngredientModal(item: any, title?: string, color?: string) {
    const modal = await this.modalController.create({
      component: IngredientDetailModalComponent,
      cssClass: '',
      mode: 'ios',
      breakpoints: [0, 0.85, 1],
      initialBreakpoint: 0.85,
      handle: true,
      componentProps: {
        item,
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
