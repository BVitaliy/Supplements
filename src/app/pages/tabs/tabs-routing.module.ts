import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab/elements',
        loadChildren: () =>
          import('src/app/pages/elements/elements.module').then(
            (m) => m.ElementsPageModule
          ),
      },
      {
        path: 'tab/main',
        loadChildren: () =>
          import('../main/main.module').then((m) => m.MainPageModule),
      },
      {
        path: 'tab/catalog',
        loadChildren: () =>
          import('../catalog/catalog.module').then((m) => m.CatalogPageModule),
      },
      {
        path: 'tab/favorites',
        loadChildren: () =>
          import('../favorites/favorites.module').then((m) => m.FavoritesPageModule),
      },
      {
        path: '',
        redirectTo: 'tab/main',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
