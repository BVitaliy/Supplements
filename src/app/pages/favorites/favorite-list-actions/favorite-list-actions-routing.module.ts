import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoriteListActionsPage } from './favorite-list-actions.page';

const routes: Routes = [
  {
    path: '',
    component: FavoriteListActionsPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoriteListActionsPageRoutingModule {}
