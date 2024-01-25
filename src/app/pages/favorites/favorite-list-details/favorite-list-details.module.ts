import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FavoriteListDetailsPageRoutingModule } from './favorite-list-details-routing.module';
import { FavoriteListDetailsPage } from './favorite-list-details.page';
import { FavoritesListPageModule } from '../favorites-list/favorites-list.module';
import { FavoriteListActionsPageModule } from '../favorite-list-actions/favorite-list-actions.module';
import { SharedModule } from '../../../shared/shared.module';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoriteListDetailsPageRoutingModule,
    FavoritesListPageModule,
    FavoriteListActionsPageModule,
    SharedModule,
    SwiperModule,
  ],
  declarations: [FavoriteListDetailsPage]
})
export class FavoriteListDetailsPageModule {}
