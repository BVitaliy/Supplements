import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductDetailPage } from './product-detail.page';

const routes: Routes = [
  {
    path: 'detail/:id',
    component: ProductDetailPage,
  },
  {
    path: 'reviews',
    loadChildren: () =>
      import('./pages/reviews/reviews.module').then((m) => m.ReviewsPageModule),
  },
  {
    path: 'add-review',
    loadChildren: () => import('./pages/add-review/add-review.module').then( m => m.AddReviewPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductDetailPageRoutingModule {}
