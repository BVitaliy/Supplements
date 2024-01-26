import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddFavoriteListProductPage } from './add-favorite-list-product.page';

const routes: Routes = [
  {
    path: '',
    component: AddFavoriteListProductPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddFavoriteListProductPageRoutingModule {}
