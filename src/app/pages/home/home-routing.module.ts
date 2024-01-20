import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CabinetGuard } from 'src/app/core/guards/cabinet.guard';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'tabs',
        loadChildren: () => import('../tabs/tabs.module').then(m => m.TabsPageModule),
        // canActivate: [CabinetGuard]
      },
      {
        path: '',
        redirectTo: 'tabs',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
