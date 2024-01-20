import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ElementsPageRoutingModule } from './elements-routing.module';

import { ElementsPage } from './elements.page';
import { NgxMaskModule } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ElementsPageRoutingModule,
    NgxMaskModule,
    SharedModule
  ],
  declarations: [ElementsPage]
})
export class ElementsPageModule {}
