import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { CabinetGuard } from './core/guards/cabinet.guard';
import { FirstOpenGuard } from './core/guards/firstOpen.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthPageModule),
    canActivate: [AuthGuard],
  },

  {
    path: 'info-steps',
    loadChildren: () =>
      import('./pages/info-steps/info-steps.module').then(
        (m) => m.InfoStepsPageModule
      ),
    canActivate: [FirstOpenGuard],
  },
  {
    path: '',
    redirectTo: 'info-steps',
    pathMatch: 'full',
  },
  {
    path: 'more',
    loadChildren: () => import('./pages/more/more.module').then( m => m.MorePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
