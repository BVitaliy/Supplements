import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import { CatalogService } from '../catalog/catalog.service';

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
  products: any;

  @ViewChild('swiper') swiper!: SwiperComponent;
  slideOpts: SwiperOptions = {
    initialSlide: 0,
    slidesPerView: 2,
    spaceBetween: 12,
    speed: 400,
    freeMode: true,
  };
  isLoadingRecent = false;
  isLoadingTrending = false;
  isLoadingForYou = false;

  isSearchActive = false;

  constructor(
    private storage: Storage,
    public navCtrl: NavController,
    private platform: Platform,
    private modalController: ModalController,
    private themeOptions: ThemeOptionsService,
    private catalogService: CatalogService,
    private changeDetectorRef: ChangeDetectorRef
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
    this.getRecent();
    this.getTrending();
    this.getForYou();
  }

  // Пошук
  search(event: any) {
    console.log(event?.detail?.value);
    this.filterForm.get('search')?.setValue(event?.detail?.value);
    // this.getOrders(true);
  }

  // Рефреш даних користувача
  doRefresh(event: any) {
    this.getRecent(() => event.target.complete());
    this.getTrending();
    this.getForYou();
  }
  getRecent(callbackFunction?: () => void) {
    this.isLoadingRecent = true;
    const data = {
      viewed: true,
    };
    this.catalogService
      .getHistory(data)
      .pipe(
        finalize(() => {
          this.isLoadingRecent = false;
          if (callbackFunction) {
            callbackFunction();
          }
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.products.recent = data?.results;
        },
        error: (error: any) => {},
      });
  }

  getTrending() {
    this.isLoadingTrending = true;
    const data = {
      ordering: '-average_rating',
      limit: 10,
    };
    this.catalogService
      .sortProduct(data)
      .pipe(
        finalize(() => {
          this.isLoadingTrending = false;
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.products.trending = data?.results;
        },
        error: (error: any) => {},
      });
  }

  getForYou() {
    this.isLoadingForYou = true;
    const data = {
      limit: 20,
    };
    this.catalogService
      .getForYouProduct(data)
      .pipe(
        finalize(() => {
          this.isLoadingForYou = false;
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.products.forYou = data?.results;
        },
        error: (error: any) => {},
      });
  }

  public onSearchFocus(_event: any): void {
    this.isSearchActive = true;
    this.changeDetectorRef.detectChanges();
    // this.getData();
  }

  public handleCancelSearch(): void {
    this.isSearchActive = false;
    this.filterForm.reset();
    this.changeDetectorRef.detectChanges();
  }
}
