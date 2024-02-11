import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrandDetailPageRoutingModule } from './brand-detail-routing.module';

import { BrandDetailPage } from './brand-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddFavoriteListProductPageModule } from 'src/app/pages/favorites/add-favorite-list-product/add-favorite-list-product.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrandDetailPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    AddFavoriteListProductPageModule,
  ],
  declarations: [BrandDetailPage],
})
export class BrandDetailPageModule {}
