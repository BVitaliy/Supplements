import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllBrandsPage } from './all-brands.page';

const routes: Routes = [
  {
    path: '',
    component: AllBrandsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllBrandsPageRoutingModule {}
