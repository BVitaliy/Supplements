import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatalogDetailPageRoutingModule } from './catalog-detail-routing.module';

import { CatalogDetailPage } from './catalog-detail.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatalogDetailPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [CatalogDetailPage],
})
export class CatalogDetailPageModule {}
