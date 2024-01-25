import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoriteListDetailsPage } from './favorite-list-details.page';

const routes: Routes = [
  {
    path: '',
    component: FavoriteListDetailsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoriteListDetailsPageRoutingModule {}
