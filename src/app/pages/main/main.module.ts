import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MainPageRoutingModule } from './main-routing.module';
import { MainPage } from './main.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SwiperModule } from 'swiper/angular';
import {
  AddFavoriteListProductPageModule,
} from '../favorites/add-favorite-list-product/add-favorite-list-product.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MainPageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MaterialModule,
    SwiperModule,
    AddFavoriteListProductPageModule,
  ],
  declarations: [MainPage],
})
export class MainPageModule {}
