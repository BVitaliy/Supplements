import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrendingPageRoutingModule } from './trending-routing.module';

import { TrendingPage } from './trending.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrendingPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [TrendingPage],
})
export class TrendingPageModule {}
