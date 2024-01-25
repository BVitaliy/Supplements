import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageFavoriteListPage } from './manage-favorite-list.page';

const routes: Routes = [
  {
    path: '',
    component: ManageFavoriteListPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageFavoriteListPageRoutingModule {}
