import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetailPageRoutingModule } from './product-detail-routing.module';

import { ProductDetailPage } from './product-detail.page';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { IngredientModalComponent } from './components/ingredient-modal/ingredient-modal.component';
import { IngredientDetailModalComponent } from './components/ingredient-detail-modal/ingredient-detail-modal.component';
import { HighlightedIngredientsPage } from './pages/highlighted-ingredients/highlighted-ingredients.page';
import { SwiperModule } from 'swiper/angular';
import { SupplementFactComponent } from './components/supplement-fact/supplement-fact.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailPageRoutingModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    SwiperModule,
  ],
  declarations: [
    ProductDetailPage,
    IngredientModalComponent,
    IngredientDetailModalComponent,
    HighlightedIngredientsPage,
    SupplementFactComponent,
  ],
})
export class ProductDetailPageModule {}
