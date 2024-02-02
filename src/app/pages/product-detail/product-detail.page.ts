import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit {
  loading: boolean = true;
  product: any;
  type = 'ingredient';
  backgroundColors = ['#22b51f', '#FF001C', '#FF9635', '#FDE334'];
  dataChart = [39, 5, 4, 5];

  constructor(public navCtrl: NavController) {}

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
}
