import {
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { SearchSystemTabs } from './search-system.models';
import { Products } from '../../../../mock/products';
import {
  IngredientOption,
  ReasonLabels,
} from 'src/app/core/models/highlighted-ingredients.models';
import { finalize } from 'rxjs';
import { CatalogService } from 'src/app/pages/catalog/catalog.service';

@Component({
  selector: 'app-search-system',
  templateUrl: './search-system.component.html',
  styleUrls: ['./search-system.component.scss'],
})
export class SearchSystemComponent implements OnChanges {
  @Input() searchValue: string = '';

  isLoading = false;

  public searchActiveTab: SearchSystemTabs = SearchSystemTabs.products;
  public searchTabs: typeof SearchSystemTabs = SearchSystemTabs;
  public categories: any[] = [];
  public productsHistoryItems: any[] = [];
  public productsItems: any[] = [];
  public ingredientsHistoryItems: IngredientOption[] = [];
  public ingredientsItems: any[] = [];
  lastSearchRecord: any;

  constructor(
    private catalogService: CatalogService,
    private changeDetectorRef: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ionViewWillEnter() {
    this.getData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['searchValue'] && this.searchValue?.length > 2) {
      this.changeDetectorRef.detectChanges();
      if (this.searchActiveTab === 'Products') {
        this.zone.run(() => {
          this.searchProduct();
        });
      } else {
        this.zone.run(() => {
          this.searchIngredient();
        });
      }
    }
  }

  public changeSearchTab(event: any): void {
    this.zone.run(() => {
      this.searchActiveTab = event?.detail?.value;
      if (this.searchValue?.length > 2) {
        if (this.searchActiveTab === 'Products') {
          this.searchProduct();
        } else {
          this.searchIngredient();
        }
      }
    });
  }

  public handleCleanProductsHistory(): void {
    this.cleatHistory();
  }

  public handleCleanIngredientsHistory(): void {
    this.cleatHistory();
  }

  cleatHistory() {
    this.catalogService.clearHistory().subscribe(
      (data: any) => {
        this.productsHistoryItems = [];
        this.ingredientsHistoryItems = [];
        this.changeDetectorRef.detectChanges();
      },
      (error: any) => {}
    );
  }

  getData() {
    // this.loading = true;
    this.catalogService
      .getFiltersRecords()
      .pipe(
        finalize(() => {
          // this.loading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe(
        (data: any) => {
          if (data?.results?.length) {
            this.lastSearchRecord = data?.results[0];
            this.searchProduct(this.lastSearchRecord);
          }
        },
        (error: any) => {
          // if (error.status === 401) {
          //   this.alertService.presentErrorAlert('Something went wrong');
          // }
        }
      );
  }

  searchProduct(firstSearchDate?: any) {
    this.isLoading = true;
    let data: any;
    let params: any;
    if (firstSearchDate) {
      data = firstSearchDate;
      params = {
        limit: 4,
      };
    } else {
      data = {
        query: this.searchValue,
      };
      params = {
        limit: 30,
      };
    }
    this.catalogService
      .searchProduct(data, params)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (data: any) => {
          if (firstSearchDate) {
            if (data?.results?.length) {
              data?.results?.forEach((el: any, index: number) => {
                if (index < 4) {
                  this.productsHistoryItems.push(el);
                  if (el.ingredients?.length) {
                    this.ingredientsHistoryItems =
                      this.ingredientsHistoryItems.concat(el.ingredients);
                  }
                }
              });
            }
          } else {
            this.productsItems = data?.results;
          }
        },
        error: (error: any) => {},
      });
  }

  searchIngredient() {
    this.isLoading = true;
    const data = {
      query: this.searchValue,
      limit: 50,
    };
    this.catalogService
      .searchIngredient(data)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe({
        next: (data: any) => {
          this.ingredientsItems = data?.results;
          console.log(data);
        },
        error: (error: any) => {},
      });
  }
}
