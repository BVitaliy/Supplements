import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ProfileDetailsFields, ProfileGenders } from './profile-details.models';
import { EditProfileDetailPage } from './edit-profile-detail/edit-profile-detail.page';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage implements OnInit {
  public profileDetails: any;
  public profileDetailsFields: typeof ProfileDetailsFields = ProfileDetailsFields;

  constructor(public navCtrl: NavController, private modalCtrl: ModalController) { }

  public ngOnInit(): void {
    this.profileDetails = {
      photo: './assets/img/temp/photo.png' || '',
      firstName: 'Anna' || '',
      lastName: 'Armas' || '',
      email: 'annaarmas@email.com' || '',
      sex: ProfileGenders.female || '',
      birthday: '20/04/1995' || '',
    };
  }

  public async showEditDetailModal(field?: ProfileDetailsFields, value?: string): Promise<void> {
    const initialBreakpointValue: number = field === ProfileDetailsFields.sex ? 0.5 : 0.3;
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: EditProfileDetailPage,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: initialBreakpointValue,
      componentProps: {
        fieldTitle: field,
        fieldValue: value,
      },
    });
    modal.onDidDismiss().then(data => {
      if (data?.data) {
        // save new value
        console.log('data?.data', data?.data);
        switch (data?.data.fieldTitle) {
          case ProfileDetailsFields.firstName: {
            break;
          }
          case ProfileDetailsFields.lastName: {
            break;
          }
          case ProfileDetailsFields.emailAddress: {
            break;
          }
          case ProfileDetailsFields.sex: {
            break;
          }
          case ProfileDetailsFields.birthday: {
            break;
          }
        }
      }
    });
    return await modal.present();
  }
}
