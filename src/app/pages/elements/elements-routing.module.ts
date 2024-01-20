import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ElementsPage } from './elements.page';

const routes: Routes = [
  {
    path: '',
    component: ElementsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElementsPageRoutingModule {}
