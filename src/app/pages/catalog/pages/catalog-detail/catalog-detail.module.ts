import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatalogDetailPageRoutingModule } from './catalog-detail-routing.module';

import { CatalogDetailPage } from './catalog-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatalogDetailPageRoutingModule
  ],
  declarations: [CatalogDetailPage]
})
export class CatalogDetailPageModule {}
