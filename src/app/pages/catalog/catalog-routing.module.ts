import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/catalog-list/catalog-list.module').then(
        (m) => m.CatalogListPageModule
      ),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./pages/catalog-detail/catalog-detail.module').then(
        (m) => m.CatalogDetailPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogPageRoutingModule {}
