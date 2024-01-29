import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SubmittedProductsPageRoutingModule } from './submitted-products-routing.module';
import { SubmittedProductsPage } from './submitted-products.page';
import { ReviewedListPageModule } from '../history/reviewed-list/reviewed-list.module';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubmittedProductsPageRoutingModule,
    ReviewedListPageModule,
    SharedModule,
  ],
  declarations: [SubmittedProductsPage],
})
export class SubmittedProductsPageModule {}
