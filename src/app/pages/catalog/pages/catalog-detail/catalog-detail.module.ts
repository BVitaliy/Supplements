import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CatalogDetailPageRoutingModule } from './catalog-detail-routing.module';
import { CatalogDetailPage } from './catalog-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  AddFavoriteListProductPageModule,
} from '../../../favorites/add-favorite-list-product/add-favorite-list-product.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatalogDetailPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    AddFavoriteListProductPageModule,
  ],
  declarations: [CatalogDetailPage],
})
export class CatalogDetailPageModule {}
