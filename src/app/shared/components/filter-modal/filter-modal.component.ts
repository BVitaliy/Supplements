import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ModalController, Platform } from '@ionic/angular';
import { finalize, Subscription } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { CatalogService } from 'src/app/pages/catalog/catalog.service';
import { MainService } from 'src/app/pages/main/main.service';
import {
  Brands,
  Categories,
  ProductRating,
  Special,
  UserRating,
} from 'src/mock/filters';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {
  @Input() filters!: any;
  @Input() page!: any;
  public form!: FormGroup;
  public categories: any[] = [];
  public brands: any[] = [];
  public ingredients: any[] = [];
  public productRating: any[] = [...ProductRating];
  public userRating: any[] = [...UserRating];
  public special: any[] = [...Special];
  loading = false;
  selectedOptions: any[] = [];
  backBtnSubscription!: Subscription;

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private catalogService: CatalogService,
    private mainService: MainService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    console.log(this.filters);
    this.form = new FormGroup({
      categories: new FormControl([]),
      brands: new FormControl([]),
      ingredients: new FormControl([]),
      quality: new FormControl(null),
      special_offer: new FormControl(false),
      rating_score: new FormControl(null),
    });
    this.form.patchValue(this.filters);
  }

  ionViewWillEnter() {
    this.backBtnSubscription = this.platform.backButton.subscribeWithPriority(
      9995,
      () => {
        this.cancelModal();
      }
    );
    // this.getData();
    if (this.page !== 'categories') {
      this.getCategories();
    }
    if (this.page !== 'brands') {
      this.getBrands();
    }
    if (this.page !== 'ingredients') {
      this.getIngredients();
    }
  }

  doRefresh(event: any) {
    // this.getData(true, () => event.target.complete());
    this.getCategories();
  }

  getData(refresh?: boolean, callbackFunction?: () => void) {
    // this.loading = true;
    this.catalogService
      .getFiltersRecords(refresh)
      .pipe(
        finalize(() => {
          // this.loading = false;
          if (callbackFunction) {
            callbackFunction();
          }
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
        },
        (error: any) => {
          if (error.status === 401) {
            this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  getCategories() {
    this.catalogService
      .getCategories()
      // .pipe(
      //   finalize(() => {
      //     this.loading = false;

      //   })
      // )
      .subscribe(
        (data: any) => {
          console.log(data);
          // this.profileDetails = data;
          this.categories = data.results;
          this.categories.forEach((el) => {
            el.checked = false;
          });
        },
        (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  getBrands(refresh?: boolean, callbackFunction?: () => void) {
    this.loading = true;
    this.brands = [];
    const data = {
      limit: 300,
    };
    this.mainService
      .getBrands(data)
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
          const brands = this.objectToArray(data?.results);
          console.log(brands);
          brands.forEach((brand: any) => {
            console.log(brand);
            this.brands = [...this.brands, ...brand?.brands];
          });
          console.log(this.brands);
        },
        (error: any) => {
          if (error.status === 401) {
            this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }
  getIngredients() {
    this.loading = true;
    const data = {
      limit: 300,
    };
    this.mainService
      .getIngredients(data)
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
          console.log(this.ingredients);
        },
        (error: any) => {
          if (error.status === 401) {
            this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  objectToArray(obj: { [key: string]: any }): { label: string; brands: any }[] {
    return Object.keys(obj).map((key) => ({ label: key, brands: obj[key] }));
  }

  public async handleApplyChanges() {
    // apply changes
    console.log(this.form.value);
    const values = this.form.value || null;
    this.cancelModal(values);
  }

  filtered($event: any, type: string) {
    console.log($event);
    console.log(type);
    if (type === 'ingredients') {
      this.form.get('ingredients')?.setValue($event);
    }
    if (type === 'categories') {
      this.form.get('categories')?.setValue($event);
    }
    if (type === 'brands') {
      this.form.get('brands')?.setValue($event);
    }
    if (type === 'special_offer') {
      this.form.get('special_offer')?.setValue($event ? true : false);
    }
  }

  async cancelModal(body?: any) {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }

    await this.modalController.dismiss(body);
  }

  ionViewDidLeave() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
  }
}
