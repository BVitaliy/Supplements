import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HighlightedIngredientsPageRoutingModule } from './highlighted-ingredients-routing.module';

import { HighlightedIngredientsPage } from './highlighted-ingredients.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HighlightedIngredientsPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    SwiperModule,
  ],
  declarations: [HighlightedIngredientsPage],
})
export class HighlightedIngredientsPageModule {}
