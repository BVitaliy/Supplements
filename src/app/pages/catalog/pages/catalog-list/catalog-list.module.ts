import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatalogListPageRoutingModule } from './catalog-list-routing.module';

import { CatalogListPage } from './catalog-list.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatalogListPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [CatalogListPage],
})
export class CatalogListPageModule {}
