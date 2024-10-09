import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController, NavController, Platform } from '@ionic/angular';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  Subject,
  takeUntil,
} from 'rxjs';
import { ThemeOptionsService } from 'src/app/core/services/theme-options.service';
import { FilterModalComponent } from 'src/app/shared/components/filter-modal/filter-modal.component';
import { ProductNotFoundComponent } from 'src/app/shared/components/product-not-found/product-not-found.component';
import { CatalogService } from '../../catalog.service';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.page.html',
  styleUrls: ['./catalog-list.page.scss'],
})
export class CatalogListPage implements OnInit {
  public isLoading: boolean = false;
  public filterForm!: FormGroup;
  public isSearchActive: boolean = false;
  categories: Array<any> = [];
  private unsubscribe$ = new Subject<void>();

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private catalogService: CatalogService,
    private zone: NgZone,
    private platform: Platform,
    private themeOptions: ThemeOptionsService
  ) {}

  public ngOnInit(): void {
    this.filterForm = new FormGroup({
      search: new FormControl(''),
    });

    this.zone.run(() => {
      this.getCategories();
      this.filterForm
        .get('search')
        ?.valueChanges.pipe(
          debounceTime(500), // Adjust debounce time as needed
          distinctUntilChanged(),
          takeUntil(this.unsubscribe$)
        )
        .subscribe((value) => {
          this.getCategories(value ? { query: value } : {});
        });
    });
  }

  ionViewWillEnter() {
    if (this.platform.is('hybrid')) {
      this.themeOptions.setStatusBarWhite();
    }
  }

  public onSearchFocus(_event: any): void {
    // this.isSearchActive = true;
    // this.getData();
  }

  public handleCancelSearch(): void {
    this.isSearchActive = false;
  }

  async openProductNotFound() {
    const modal = await this.modalController.create({
      component: ProductNotFoundComponent,
      cssClass: '',
      mode: 'ios',
      breakpoints: [0, 0.75],
      initialBreakpoint: 0.75,
      handle: true,
      componentProps: {},
    });

    return await modal.present();
  }
  getData() {
    // this.loading = true;
    this.catalogService
      .getFiltersRecords()
      .pipe(
        finalize(() => {
          // this.loading = false;
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
        },
        (error: any) => {
          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  // Рефреш даних користувача
  doRefresh(event: any) {
    this.zone.run(() => {
      this.getCategories(true, () => event.target.complete());
    });
  }

  getCategories(data?: any, callbackFunction?: () => void) {
    this.isLoading = true;
    this.catalogService
      .getCategories(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if (callbackFunction) {
            callbackFunction();
          }
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          // this.profileDetails = data;
          this.categories = data.results;
        },
        (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  public handleOpenDetails(id: number, title: string): void {
    this.navCtrl.navigateForward([`/home/tabs/tab/catalog/${id}`, { title }]);
  }
}
