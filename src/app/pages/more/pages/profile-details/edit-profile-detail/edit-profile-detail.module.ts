import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditProfileDetailPageRoutingModule } from './edit-profile-detail-routing.module';
import { EditProfileDetailPage } from './edit-profile-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProfileDetailPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [EditProfileDetailPage],
})
export class EditProfileDetailPageModule {}
