import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchSystemComponent } from './search-system.component';
import { IonicModule } from '@ionic/angular';
import { SearchEmptyStateComponent } from './search-empty-state/search-empty-state.component';
import { ProductsHistoryComponent } from './products-history/products-history.component';
import { SharedModule } from '../../shared.module';
import { IngredientsHistoryComponent } from './ingredients-history/ingredients-history.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
  ],
  declarations: [
    SearchSystemComponent,
    SearchEmptyStateComponent,
    ProductsHistoryComponent,
    IngredientsHistoryComponent,
  ],
  exports: [
    SearchSystemComponent,
    SearchEmptyStateComponent,
    ProductsHistoryComponent,
    IngredientsHistoryComponent,
  ]
})
export class SearchSystemModule {}
