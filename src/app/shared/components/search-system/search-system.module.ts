import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchSystemComponent } from './search-system.component';
import { IonicModule } from '@ionic/angular';
import { ProductsHistoryComponent } from './products-history/products-history.component';
import { SharedModule } from '../../shared.module';
import { IngredientsHistoryComponent } from './ingredients-history/ingredients-history.component';
import { RouterLink } from '@angular/router';

@NgModule({
  imports: [CommonModule, IonicModule, SharedModule, RouterLink],
  declarations: [
    SearchSystemComponent,
    ProductsHistoryComponent,
    IngredientsHistoryComponent,
  ],
  exports: [
    SearchSystemComponent,
    ProductsHistoryComponent,
    IngredientsHistoryComponent,
  ],
})
export class SearchSystemModule {}
