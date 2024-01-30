import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HighlightedIngredientsPage } from './highlighted-ingredients.page';

const routes: Routes = [
  {
    path: '',
    component: HighlightedIngredientsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HighlightedIngredientsPageRoutingModule {}
