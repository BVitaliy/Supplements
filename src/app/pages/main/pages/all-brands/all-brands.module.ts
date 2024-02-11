import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllBrandsPageRoutingModule } from './all-brands-routing.module';

import { AllBrandsPage } from './all-brands.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllBrandsPageRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  declarations: [AllBrandsPage],
})
export class AllBrandsPageModule {}
