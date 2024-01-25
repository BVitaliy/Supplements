import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FavoriteListActionsPageRoutingModule } from './favorite-list-actions-routing.module';
import { FavoriteListActionsPage } from './favorite-list-actions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavoriteListActionsPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [FavoriteListActionsPage]
})
export class FavoriteListActionsPageModule {}
