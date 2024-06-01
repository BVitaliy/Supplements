import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  IonContent,
  IonInfiniteScroll,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { finalize } from 'rxjs';

import SwiperCore, { Scrollbar, SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { Products } from 'src/mock/products';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ThemeOptionsService } from 'src/app/core/services/theme-options.service';

SwiperCore.use([Scrollbar]);

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild(IonInfiniteScroll) infiniteScroll!: {
    disabled: boolean;
    complete: () => any;
  };
  loading: boolean = false;
  filterForm!: FormGroup;
  statuses!: any;
  selectedStatus: any;
  disableInfinity = false;
  products: Array<any> = [];

  @ViewChild('swiper') swiper!: SwiperComponent;
  slideOpts: SwiperOptions = {
    initialSlide: 0,
    slidesPerView: 2,
    spaceBetween: 12,
    speed: 400,
    freeMode: true,
  };

  constructor(
    private storage: Storage,
    public navCtrl: NavController,
    private platform: Platform,
    private modalController: ModalController,
    private themeOptions: ThemeOptionsService
  ) {
    this.products = Products;
  }

  ngOnInit() {
    this.filterForm = new FormGroup({
      search: new FormControl(null),
    });
    if (this.platform.is('hybrid')) {
      this.themeOptions.setStatusBarWhite();
    }
  }

  ionViewWillEnter() {
    // this.getOrders();
  }

  // Рефреш даних користувача
  doRefresh(event: any) {
    // this.getOrders(true, () => event.target.complete());
  }

  // Пошук
  search(event: any) {
    console.log(event?.detail?.value);
    this.filterForm.get('search')?.setValue(event?.detail?.value);
    // this.getOrders(true);
  }

  // Підгрузка результатів
  // loadData() {
  //   if (!this.disableInfinity) {
  //     setTimeout(() => {
  //       this.filterForm.get('current_page')?.setValue(1);
  //       this.filterForm
  //         .get('items_per_page')
  //         ?.setValue(this.filterForm.get('items_per_page')?.value + 10);
  //       this.getOrders(true);
  //     }, 500);
  //   } else {
  //     this.disableInfinity = true;
  //   }
  // }
}
