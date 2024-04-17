import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditProfileDetailPageRoutingModule } from './edit-profile-detail-routing.module';
import { EditProfileDetailPage } from './edit-profile-detail.page';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditProfileDetailPageRoutingModule,
    ReactiveFormsModule,
    NgxMaskModule,
  ],
  declarations: [EditProfileDetailPage],
})
export class EditProfileDetailPageModule {}
