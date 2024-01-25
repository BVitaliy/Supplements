import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavoritesPage } from './favorites.page';

const routes: Routes = [
  {
    path: '',
    component: FavoritesPage,
  },
  {
    path: 'favorite-list-details/:id',
    loadChildren: () => import('./favorite-list-details/favorite-list-details.module').then( m => m.FavoriteListDetailsPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoritesPageRoutingModule {}
