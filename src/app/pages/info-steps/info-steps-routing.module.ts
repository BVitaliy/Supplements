import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoStepsPage } from './info-steps.page';

const routes: Routes = [
  {
    path: '',
    component: InfoStepsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoStepsPageRoutingModule {}
