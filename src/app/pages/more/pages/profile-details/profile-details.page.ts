import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { ProfileDetailsFields, ProfileGenders } from './profile-details.models';
import { EditProfileDetailPage } from './edit-profile-detail/edit-profile-detail.page';
import { jwtDecode } from 'jwt-decode';
import { ProfileService } from '../../profile.service';
import { Storage } from '@ionic/storage';
import { ACCESS_TOKEN_STORAGE_NAME } from 'src/app/app.config';
import { AlertService } from 'src/app/core/services/alert.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage implements OnInit {
  public profileDetails: any;
  public profileDetailsFields: typeof ProfileDetailsFields =
    ProfileDetailsFields;

  loading = false;
  userId: any;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private storage: Storage,
    private profileService: ProfileService,
    private alertService: AlertService
  ) {}

  public ngOnInit(): void {
    // this.profileDetails = {
    //   photo: './assets/img/temp/photo.png' || '',
    //   firstName: 'Anna' || '',
    //   lastName: 'Armas' || '',
    //   email: 'annaarmas@email.com' || '',
    //   sex: ProfileGenders.female || '',
    //   birthday: '20/04/1995' || '',
    // };
    this.getUser();
  }

  // Рефреш даних користувача
  doRefresh(event: any) {
    this.getUser(true, () => event.target.complete());
  }

  getUser(refresh?: boolean, callbackFunction?: () => void) {
    this.storage.get(ACCESS_TOKEN_STORAGE_NAME).then((token) => {
      if (token) {
        const decoded: any = jwtDecode(token);
        console.log(decoded);
        this.userId = decoded?.user_id;
        this.profileService
          .getProfile(decoded?.user_id, refresh)
          .pipe(
            finalize(() => {
              this.loading = false;
              if (callbackFunction) {
                callbackFunction();
              }
            })
          )
          .subscribe(
            (data: any) => {
              console.log(data);
              this.profileDetails = data;
            },
            (error: any) => {
              // this.alertService.presentErrorAlert(error?.email?.error);

              if (error.status === 401) {
                this.alertService.presentErrorAlert('Something went wrong');
              }
            }
          );
      }
    });
  }

  public async showEditDetailModal(
    field?: ProfileDetailsFields,
    value?: string
  ): Promise<void> {
    const initialBreakpointValue: number =
      field === ProfileDetailsFields.gender ? 0.5 : 0.3;
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: EditProfileDetailPage,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: initialBreakpointValue,
      componentProps: {
        fieldTitle: field,
        fieldValue: value,
      },
    });
    modal.onDidDismiss().then((data) => {
      if (data?.data) {
        // save new value
        let body = null;
        console.log(data?.data);
        switch (data?.data.fieldTitle) {
          case 'first_name': {
            body = {
              ...this.profileDetails,
              first_name: data?.data?.fieldNewValue,
            };
            console.log(body);
            this.handleProfile(body);
            break;
          }
          case 'last_name': {
            body = {
              ...this.profileDetails,
              last_name: data?.data?.fieldNewValue,
            };
            this.handleProfile(body);
            break;
          }
          case 'email': {
            body = {
              ...this.profileDetails,
              email: data?.data?.fieldNewValue,
            };
            this.handleProfile(body);
            break;
          }
          case 'gender': {
            body = {
              ...this.profileDetails,
              gender: data?.data?.fieldNewValue,
            };
            this.handleProfile(body);
            break;
          }
          case 'date_of_birth': {
            body = {
              ...this.profileDetails,
              date_of_birth: data?.data?.fieldNewValue,
            };
            this.handleProfile(body);
            break;
          }
        }
      }
    });
    return await modal.present();
  }

  handleProfile(values: any) {
    this.loading = true;
    console.log(values);
    this.profileService.updateProfile(this.userId, values).subscribe(
      (data: any) => {
        console.log(data);
        this.profileDetails = data;
        this.loading = false;
      },
      (error: any) => {
        // this.alertService.presentErrorAlert(error?.email?.error);

        if (error.status === 401) {
          this.alertService.presentErrorAlert('Something went wrong');
        }
      }
    );
  }
}
