import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/main/main.module').then((m) => m.MainPageModule),
  },
  {
    path: 'profile-details',
    loadChildren: () => import('./pages/profile-details/profile-details.module').then( m => m.ProfileDetailsPageModule),
  },
  {
    path: 'history',
    loadChildren: () => import('./pages/history/history.module').then( m => m.HistoryPageModule),
  },
  {
    path: 'highlighted-ingredients',
    loadChildren: () => import('./pages/highlighted-ingredients/highlighted-ingredients.module').then( m => m.HighlightedIngredientsPageModule),
  },
  {
    path: 'submitted-products',
    loadChildren: () => import('./pages/submitted-products/submitted-products.module').then( m => m.SubmittedProductsPageModule),
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule),
  },
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then( m => m.NotificationsPageModule),
  },
  {
    path: 'report-problem',
    loadChildren: () => import('./pages/report-problem/report-problem.module').then( m => m.ReportProblemPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MorePageRoutingModule {}
