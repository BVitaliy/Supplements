import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddFavoriteListProductPageRoutingModule } from './add-favorite-list-product-routing.module';
import { AddFavoriteListProductPage } from './add-favorite-list-product.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddFavoriteListProductPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [AddFavoriteListProductPage],
})
export class AddFavoriteListProductPageModule {}
