import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditProfileDetailPage } from './edit-profile-detail.page';

const routes: Routes = [
  {
    path: '',
    component: EditProfileDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProfileDetailPageRoutingModule {}
