import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FavoritesList } from '../favorites.models';

@Component({
  selector: 'app-favorites-list',
  templateUrl: './favorites-list.page.html',
  styleUrls: ['./favorites-list.page.scss'],
})
export class FavoritesListPage {
  @Input() favoritesList!: FavoritesList[];

  @Output() onOpenDetails: EventEmitter<number> = new EventEmitter<number>();

  public productsToShow: number = 5;

  public handleProductsCount(products: any[]): number {
    return products.length;
  }
}
