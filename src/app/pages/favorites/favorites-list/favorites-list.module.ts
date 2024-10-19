import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FavoritesListPageRoutingModule } from './favorites-list-routing.module';
import { FavoritesListPage } from './favorites-list.page';
import { SharedModule } from '../../../shared/shared.module';
import { PreviewImageComponent } from '../preview-image/preview-image.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoritesListPageRoutingModule,
    SharedModule,
  ],
  exports: [FavoritesListPage],
  declarations: [FavoritesListPage, PreviewImageComponent],
})
export class FavoritesListPageModule {}
