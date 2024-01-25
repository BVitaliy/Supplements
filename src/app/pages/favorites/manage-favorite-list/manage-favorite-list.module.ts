import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ManageFavoriteListPageRoutingModule } from './manage-favorite-list-routing.module';
import { ManageFavoriteListPage } from './manage-favorite-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageFavoriteListPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ManageFavoriteListPage],
})
export class ManageFavoriteListPageModule {}
