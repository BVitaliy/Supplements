import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
  public categories: any[] = [
    {
      image: './assets/img/catalog/vitamines.svg',
      label: 'Vitamins',
    },
    {
      image: './assets/img/catalog/minerales.svg',
      label: 'Minerals',
    },
    {
      image: './assets/img/catalog/sleep.svg',
      label: 'Sleep',
    },
  ];
  public productsHistoryItems: any[] = [];
  public productsItems: any[] = [];
  public ingredientsHistoryItems: IngredientOption[] = [
    // {
    //   color: '#22B51F',
    //   label: 'Aloe Vera',
    //   id: 1,
    //   status: ReasonLabels.benefit,
    //   checked: false,
    // },
  ];
  public ingredientsItems: any[] = [];

  constructor(private catalogService: CatalogService) {
    this.getData();
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes?.['searchValue'] && this.searchValue?.length > 2) {
      if (this.searchActiveTab === 'Products') {
        this.searchProduct();
      } else {
        this.searchIngredient();
      }
    }
  }

  public changeSearchTab(event: any): void {
    this.searchActiveTab = event?.detail?.value;
    if (this.searchValue?.length > 2) {
      if (this.searchActiveTab === 'Products') {
        this.searchProduct();
      } else {
        this.searchIngredient();
      }
    }
  }

  public handleCleanProductsHistory(): void {
    this.productsHistoryItems = [];
  }

  public handleCleanIngredientsHistory(): void {
    this.ingredientsHistoryItems = [];
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
          // if (error.status === 401) {
          //   this.alertService.presentErrorAlert('Something went wrong');
          // }
        }
      );
  }

  searchProduct() {
    this.isLoading = true;
    const data = {
      query: this.searchValue,
    };
    const params = {
      limit: 50,
    };
    this.catalogService
      .searchProduct(data, params)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (data: any) => {
          this.productsItems = data?.results;
          console.log(data);
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
