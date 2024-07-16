import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForYouPageRoutingModule } from './for-you-routing.module';

import { ForYouPage } from './for-you.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForYouPageRoutingModule,
    SharedModule,
  ],
  declarations: [ForYouPage],
})
export class ForYouPageModule {}
