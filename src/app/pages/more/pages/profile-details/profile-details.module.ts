import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfileDetailsPageRoutingModule } from './profile-details-routing.module';
import { ProfileDetailsPage } from './profile-details.page';
import { SharedModule } from '../../../../shared/shared.module';
import { EditProfileDetailPageModule } from './edit-profile-detail/edit-profile-detail.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileDetailsPageRoutingModule,
    SharedModule,
    EditProfileDetailPageModule,
  ],
  declarations: [ProfileDetailsPage],
})
export class ProfileDetailsPageModule {}
