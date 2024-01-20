import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/get-started/get-started.module').then(
        (m) => m.GetStartedPageModule
      ),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },

  {
    path: 'signup',
    loadChildren: () =>
      import('./pages/signup/signup.module').then((m) => m.SignupPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
