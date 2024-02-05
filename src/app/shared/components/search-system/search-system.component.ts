import { Component, Input } from '@angular/core';
import { SearchSystemTabs } from './search-system.models';
import { Products } from '../../../../mock/products';
import {
  IngredientOption,
  ReasonLabels,
} from '../../../pages/more/pages/highlighted-ingredients/highlighted-ingredients.models';

@Component({
  selector: 'app-search-system',
  templateUrl: './search-system.component.html',
  styleUrls: ['./search-system.component.scss'],
})
export class SearchSystemComponent {
  @Input() searchValue: string = '';

  public searchActiveTab: SearchSystemTabs = SearchSystemTabs.products;
  public searchTabs: typeof SearchSystemTabs = SearchSystemTabs;
  public productsHistoryItems: any[] = [ ...Products ];
  public ingredientsHistoryItems: IngredientOption[] = [
    {
      color: '#22B51F',
      label: 'Aloe Vera',
      id: 1,
      status: ReasonLabels.benefit,
      checked: false,
    },
    {
      color: '#22B51F',
      label: 'Alpha-Ketoglutaric Acid',
      id: 2,
      status: ReasonLabels.benefit,
      checked: false,
    },
    {
      color: '#FF001C',
      label: 'Beta - Glucans',
      id: 3,
      status: ReasonLabels.weakness,
      checked: false,
    },
    {
      color: '#FDE334',
      label: 'Bilberry',
      id: 4,
      status: ReasonLabels.allergen,
      checked: false,
    },
    {
      color: '#FF9635',
      label: 'Blackberry Extract',
      id: 5,
      status: ReasonLabels.contaminant,
      checked: false,
    },
  ];

  public changeSearchTab(event: any): void {
    this.searchActiveTab = event?.detail?.value;
  }

  public handleCleanProductsHistory(): void {
    this.productsHistoryItems = [];
  }

  public handleCleanIngredientsHistory(): void {
    this.ingredientsHistoryItems = [];
  }
}
