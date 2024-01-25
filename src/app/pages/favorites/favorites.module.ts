import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FavoritesPageRoutingModule } from './favorites-routing.module';
import { FavoritesPage } from './favorites.page';
import { ManageFavoriteListPageModule } from './manage-favorite-list/manage-favorite-list.module';
import { FavoritesListPageModule } from './favorites-list/favorites-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoritesPageRoutingModule,
    ManageFavoriteListPageModule,
    FavoritesListPageModule,
  ],
  declarations: [FavoritesPage],
})
export class FavoritesPageModule {}
