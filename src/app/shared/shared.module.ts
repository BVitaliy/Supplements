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

import { PatchImagePipe } from './pipes/patch-image.pipe';
import { MaterialModule } from './modules/material.module';
import { ImageZoomingComponent } from './components/image-zooming/image-zooming.component';

import { CallPopoverComponent } from './components/call-popover/call-popover.component';
import { DoneComponent } from './components/done/done.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { RatingComponent } from './components/rating/rating.component';
import { RatingCountComponent } from './components/rating-count/rating-count.component';
import { FavoriteBtnComponent } from './components/favorite-btn/favorite-btn.component';
import { FilterRowComponent } from './components/filter-row/filter-row.component';
import { ChartComponent } from './components/chart/chart.component';
import { NgChartsModule } from 'ng2-charts';
import { SortModalComponent } from './components/sort-modal/sort-modal.component';
import { ProductNotFoundComponent } from './components/product-not-found/product-not-found.component';
import { SourcePopoverComponent } from './components/source-popover/source-popover.component';
import { FilterModalComponent } from './components/filter-modal/filter-modal.component';
import { FilterGroupComponent } from './components/filter-group/filter-group.component';
import { IngredientFilterGroupComponent } from './components/ingredient-filter-group/ingredient-filter-group.component';
import { OnboardingSearchProductComponent } from './components/onboarding-search-product/onboarding-search-product.component';
import { ProductAlertPopupComponent } from './components/product-alert-popup/product-alert-popup.component';
import { SetAvatarNamePipe } from './pipes/setAvatarName.pipe';
import { MaskDirective } from './directives/mask.directives';
import { SearchEmptyComponent } from './components/search-empty/search-empty-state.component';
import { SearchEmptyStateComponent } from './components/search-system/search-empty-state/search-empty-state.component';
import { PreviewImageComponent2 } from './components/preview-image/preview-image.component';

const exportedDeclarations = [
  ImgComponent,
  ImageZoomingComponent,
  ThankComponent,
  InformationPopoverComponent,
  ContentComponent,
  PatchImagePipe,
  PhonePipe,
  SafeHtmlPipe,
  SetAvatarNamePipe,
  FocusPhoneInputDirective,

  DoneComponent,
  ProductCardComponent,
  RatingComponent,
  RatingCountComponent,
  FavoriteBtnComponent,
  FilterRowComponent,
  CallPopoverComponent,
  ChartComponent,
  SortModalComponent,
  ProductNotFoundComponent,
  SourcePopoverComponent,
  FilterModalComponent,
  FilterGroupComponent,
  IngredientFilterGroupComponent,
  OnboardingSearchProductComponent,
  ProductAlertPopupComponent,
  SearchEmptyComponent,
  SearchEmptyStateComponent,
  PreviewImageComponent2,
];

@NgModule({
  declarations: [...exportedDeclarations],
  imports: [
    CommonModule,
    IonicModule,
    SwiperModule,
    ReactiveFormsModule,
    MaterialModule,
    NgChartsModule,
  ],
  exports: [MaterialModule, NgChartsModule, ...exportedDeclarations],
})
export class SharedModule {}
