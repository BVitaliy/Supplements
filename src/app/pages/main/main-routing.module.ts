import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
  },
  {
    path: 'trending',
    loadChildren: () =>
      import('./pages/trending/trending.module').then(
        (m) => m.TrendingPageModule
      ),
  },
  {
    path: 'all-brands',
    loadChildren: () =>
      import('./pages/all-brands/all-brands.module').then(
        (m) => m.AllBrandsPageModule
      ),
  },
  {
    path: 'all-brands/:id',
    loadChildren: () =>
      import('./pages/brand-detail/brand-detail.module').then(
        (m) => m.BrandDetailPageModule
      ),
  },
  {
    path: 'ingredients',
    loadChildren: () =>
      import('./pages/ingredients/ingredients.module').then(
        (m) => m.IngredientsPageModule
      ),
  },
  {
    path: 'for-you',
    loadChildren: () =>
      import('./pages/for-you/for-you.module').then((m) => m.ForYouPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
