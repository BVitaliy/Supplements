import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatalogDetailPage } from './catalog-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CatalogDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogDetailPageRoutingModule {}
