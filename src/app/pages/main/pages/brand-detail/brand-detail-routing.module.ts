import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrandDetailPage } from './brand-detail.page';

const routes: Routes = [
  {
    path: '',
    component: BrandDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandDetailPageRoutingModule {}
