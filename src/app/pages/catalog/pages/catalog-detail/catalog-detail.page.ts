import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { FilterModalComponent } from 'src/app/shared/components/filter-modal/filter-modal.component';
import { SortModalComponent } from 'src/app/shared/components/sort-modal/sort-modal.component';
import { Products } from 'src/mock/products';
import { CatalogService } from '../../catalog.service';

@Component({
  selector: 'app-catalog-detail',
  templateUrl: './catalog-detail.page.html',
  styleUrls: ['./catalog-detail.page.scss'],
})
export class CatalogDetailPage implements OnInit {
  public listProducts: any[] = [];
  loading: boolean = false;
  filterForm!: FormGroup;
  id: any;
  title: string = '';
  count = 0;

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private catalogService: CatalogService,
    private route: ActivatedRoute,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.filterForm = new FormGroup({
      query: new FormControl(null),
      ordering_field: new FormControl(null),
      categories: new FormControl([]),
      brands: new FormControl([]),
      ingredients: new FormControl([]),
      quality: new FormControl(null),
      special_offer: new FormControl(null),
      rating_score: new FormControl(null),
      product_score: new FormControl([]),
    });
  }

  ionViewWillEnter() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.title = this.route.snapshot.paramMap.get('title') || '';
    this.zone.run(() => {
      this.getProducts(this.id);
    });
  }

  search(event: any) {
    this.zone.run(() => {
      console.log(event?.detail?.value);
      this.filterForm.get('query')?.setValue(event?.detail?.value);

      const values = {
        ...this.filterForm.value,
        categories: [this.id],
      };
      this.filteredProduct(values);
    });
  }

  // Відкривання модалки Filters
  async openFiltersModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      cssClass: '',
      mode: 'ios',
      handle: true,
      componentProps: {
        filters: this.filterForm.value,
        page: 'categories',
      },
    });

    modal.onDidDismiss().then((returnedData: any) => {
      this.filterForm.reset();
      console.log(returnedData);
      console.log(this.filterForm);
      if (returnedData && returnedData?.data) {
        this.filterForm.patchValue(returnedData?.data);
        const values = {
          ...returnedData?.data,
          categories: [this.id],
        };
        this.zone.run(() => {
          this.filteredProduct(values);
        });
      }
    });

    return await modal.present();
  }

  // Відкривання модалки sort
  async openSortPopover() {
    console.log(this.filterForm.value);
    const modal = await this.modalController.create({
      component: SortModalComponent,
      cssClass: '',
      mode: 'ios',
      breakpoints: [0, 0.4],
      initialBreakpoint: 0.4,
      handle: true,
      componentProps: {
        sort: this.filterForm.get('ordering_field')?.value,
      },
    });

    modal.onDidDismiss().then((returnedData: any) => {
      this.zone.run(() => {
        if (returnedData && returnedData?.data) {
          console.log(returnedData);
          this.filterForm.get('ordering_field')?.setValue(returnedData?.data);

          const values = {
            ...this.filterForm.value,
            categories: [this.id],
          };
          this.filteredProduct(values, { ordering: returnedData?.data });
        }
      });
    });

    return await modal.present();
  }

  // Рефреш даних користувача
  doRefresh(event: any) {
    this.zone.run(() => {
      this.getProducts(this.id, true, () => event.target.complete());
    });
  }

  getProducts(id: string, refresh?: boolean, callbackFunction?: () => void) {
    this.loading = true;
    this.catalogService
      .getProducts(id, refresh)
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
          console.log(data);
          // this.profileDetails = data;
          this.count = data?.count || 0;
          this.listProducts = data.results;
          if (callbackFunction) {
            callbackFunction();
          }
        },
        error: (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        },
      });
  }

  filteredProduct(data: any, ordering?: any) {
    this.loading = true;
    this.catalogService
      .searchProduct(data, ordering)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.count = data?.count || 0;
          this.listProducts = data.results;
        },
        error: (error: any) => {},
      });
  }

  sortProduct(sort: any) {
    this.loading = true;
    const data = {
      ordering: sort,
      limit: 200,
    };
    this.catalogService
      .sortProduct(data)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.count = data?.count || 0;
          this.listProducts = data.results;
        },
        error: (error: any) => {},
      });
  }
}
