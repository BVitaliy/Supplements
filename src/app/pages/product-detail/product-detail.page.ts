import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { IngredientOption } from 'src/app/core/models/highlighted-ingredients.models';
import { IngredientDetailModalComponent } from './components/ingredient-detail-modal/ingredient-detail-modal.component';
import { IngredientModalComponent } from './components/ingredient-modal/ingredient-modal.component';
import { HighlightedIngredientsPage } from './pages/highlighted-ingredients/highlighted-ingredients.page';

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
  type = 'ingredient';
  backgroundColors = ['#22b51f', '#FF001C', '#FF9635', '#FDE334'];
  dataChart = [39, 5, 4, 5];
  addedHIngredientsOptions: IngredientOption[] = [];

  constructor(
    public navCtrl: NavController,
    // private loadingController: LoadingController,
    // private actionSheetController: ActionSheetController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;

      this.product = {
        category: 'Athletic Greens',
        title:
          'Ultimate Daily, Whole Food Sourced  All in One Greens Supplement Powder',
        score: 9.3,
        favorite: false,
        image: './assets/img/temp/product-detail.png',
        benefits: {
          title: 'Benefits',
          count: 39,
          color: '#22B51F',
          ingredients: [
            'Organic spirulina',
            'Organic spirulina',
            'Organic spirulina',
            'Organic spirulina',
          ],
        },
        weaknesses: {
          title: 'Weaknesses',
          count: 5,
          color: '#FF001C',
          ingredients: [
            'Glycol',
            'Glycerin',
            'Titanium Dioxide',
            'Caramel Color',
            'Red 40',
          ],
        },
        contaminants: {
          title: 'Contaminants',
          count: 3,
          color: '#FF9635',
          ingredients: [
            'Organic spirulina',
            'Organic spirulina',
            'Organic spirulina',
            'Organic spirulina',
          ],
        },
        allergens: {
          title: 'Allergens',
          count: 4,
          color: '#FDE334',
          ingredients: [
            'Organic spirulina',
            'Organic spirulina',
            'Organic spirulina',
            'Organic spirulina',
          ],
        },
      };
    }, 1000);
  }

  // Рефреш продукту
  doRefresh(event: any) {
    this.getProductById(true, () => event.target.complete());
  }

  getProductById(refresh?: boolean, callbackFunction?: () => void) {
    setTimeout(() => {
      this.loading = false;
      if (callbackFunction) {
        callbackFunction();
      }
    }, 1000);
  }

  shopNowProduct() {}
  favoriteHandle($event: any) {}

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
        console.log(returnedData);
      }
    });

    return await modal.present();
  }
}
