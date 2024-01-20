import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImgComponent } from './components/img/img.component';
import { ThankComponent } from './components/thank/thank.component';
import { PhonePipe } from './pipes/phone.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { FocusPhoneInputDirective } from './directives/focus-phone-input.directive';
import { SwiperModule } from 'swiper/angular';
import { InformationPopoverComponent } from './components/information-popover/information-popover.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContentComponent } from './components/content/content.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapComponent } from './components/map/map.component';
import { PatchImagePipe } from './pipes/patch-image.pipe';
import { MaterialModule } from './modules/material.module';
import { ImageZoomingComponent } from './components/image-zooming/image-zooming.component';

import { CallPopoverComponent } from './components/call-popover/call-popover.component';

const exportedDeclarations = [
  ImgComponent,
  ImageZoomingComponent,
  ThankComponent,
  InformationPopoverComponent,
  ContentComponent,
  PatchImagePipe,
  PhonePipe,
  SafeHtmlPipe,
  FocusPhoneInputDirective,
  MapComponent,

  CallPopoverComponent,
];

@NgModule({
  declarations: [...exportedDeclarations],
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    MaterialModule,
  ],
  exports: [MaterialModule, ...exportedDeclarations],
})
export class SharedModule {}
