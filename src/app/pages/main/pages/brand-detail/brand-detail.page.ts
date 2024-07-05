import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { CatalogService } from 'src/app/pages/catalog/catalog.service';
import { FilterModalComponent } from 'src/app/shared/components/filter-modal/filter-modal.component';
import { SortModalComponent } from 'src/app/shared/components/sort-modal/sort-modal.component';
import { Products } from 'src/mock/products';

@Component({
  selector: 'app-brand-detail',
  templateUrl: './brand-detail.page.html',
  styleUrls: ['./brand-detail.page.scss'],
})
export class BrandDetailPage implements OnInit {
  public listProducts: any;
  form!: FormGroup;
  isLoading: boolean = false;
  title = '';
  type = '';
  id: any;

  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private catalogService: CatalogService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      // search: new FormControl(null),
      sort: new FormControl(null),
    });
  }

  ionViewWillEnter() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.title = this.route.snapshot.paramMap.get('title') || '';
    this.type = this.route.snapshot.paramMap.get('type') || '';
    this.getProducts();
  }
  doRefresh(event: any) {
    this.getProducts(() => event.target.complete());
  }

  // Відкривання модалки Filters
  async openFiltersModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent,
      cssClass: '',
      mode: 'ios',
      handle: true,
      componentProps: {
        page: this.type,
      },
    });

    modal.onDidDismiss().then((returnedData: any) => {
      if (returnedData && returnedData?.data) {
        const values = {
          ...returnedData?.data,
          [this.type]: [this.id],
        };
        console.log(returnedData);
        this.filteredProduct(values);
      }
    });

    return await modal.present();
  }

  // Відкривання модалки sort
  async openSortPopover() {
    const modal = await this.modalController.create({
      component: SortModalComponent,
      cssClass: '',
      mode: 'ios',
      breakpoints: [0, 0.4],
      initialBreakpoint: 0.4,
      handle: true,
      componentProps: {
        sort: this.form.get('sort')?.value,
      },
    });

    modal.onDidDismiss().then((returnedData: any) => {
      if (returnedData && returnedData?.data) {
        console.log(returnedData);
        this.sortProduct(returnedData?.data);
      }
    });

    return await modal.present();
  }

  filteredProduct(data: any) {
    this.isLoading = true;
    this.catalogService
      .searchProduct(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.listProducts = data;
        },
        error: (error: any) => {},
      });
  }

  sortProduct(sort: any) {
    this.isLoading = true;
    const data = {
      ordering: '-' + sort,
      limit: 200,
    };
    this.catalogService
      .sortProduct(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.listProducts = data;
        },
        error: (error: any) => {},
      });
  }

  getProducts(callbackFunction?: () => void) {
    this.isLoading = true;
    const data = {
      limit: 120,
    };
    if (this.type === 'brands') {
      this.catalogService
        .getBrandsProduct(data, this.id)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            if (callbackFunction) {
              callbackFunction();
            }
          })
        )
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.listProducts = data;
          },
          error: (error: any) => {},
        });
    } else {
      this.catalogService
        .getBrandsProduct(data, this.id)
        .pipe(
          finalize(() => {
            this.isLoading = false;
          })
        )
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.listProducts = data;
          },
          error: (error: any) => {},
        });
    }
  }
}
