import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoStepsPageRoutingModule } from './info-steps-routing.module';

import { InfoStepsPage } from './info-steps.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    InfoStepsPageRoutingModule,
  ],
  declarations: [InfoStepsPage],
})
export class InfoStepsPageModule {}
