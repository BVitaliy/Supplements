import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReviewedListPage } from './reviewed-list.page';

const routes: Routes = [
  {
    path: '',
    component: ReviewedListPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewedListPageRoutingModule {}
