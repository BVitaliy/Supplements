import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { ProfileDetailsFields, ProfileGenders } from './profile-details.models';
import { EditProfileDetailPage } from './edit-profile-detail/edit-profile-detail.page';
import { jwtDecode } from 'jwt-decode';
import { ProfileService } from '../../profile.service';
import { Storage } from '@ionic/storage';
import { ACCESS_TOKEN_STORAGE_NAME } from 'src/app/app.config';
import { AlertService } from 'src/app/core/services/alert.service';
import { finalize } from 'rxjs';
import { PhotoService } from 'src/app/core/services/photo.service';
import { SourcePopoverComponent } from 'src/app/shared/components/source-popover/source-popover.component';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.page.html',
  styleUrls: ['./profile-details.page.scss'],
})
export class ProfileDetailsPage implements OnInit {
  public profileDetails: any;
  public profileDetailsFields: typeof ProfileDetailsFields =
    ProfileDetailsFields;
  format = '';
  loading = false;
  userId: any;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private storage: Storage,
    private profileService: ProfileService,
    private alertService: AlertService,
    private platform: Platform,
    private modalController: ModalController,
    private photoService: PhotoService
  ) {
    this.storage.get('user').then((user) => {
      if (user) {
        this.profileDetails = JSON.parse(user);
      } else {
        // this.getUser();
      }
      this.getUser();
    });
  }

  public ngOnInit(): void {}

  // Рефреш даних користувача
  doRefresh(event: any) {
    this.getUser(true, () => event.target.complete());
  }

  getUser(refresh?: boolean, callbackFunction?: () => void) {
    this.storage.get(ACCESS_TOKEN_STORAGE_NAME).then((token) => {
      if (token) {
        const decoded: any = jwtDecode(token);

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
              this.storage.set('user', JSON.stringify(data));
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
    if (!values.image) {
      // values.image =
      //   'https://lh3.googleusercontent.com/a/ACg8ocK4cNWxa9nlVf85M-cUqi9rw0mvAMfN0X_rQrGqTDzthw0=s83-c-mo';
    }

    const formData = new FormData();

    formData.append('date_of_birth', values?.date_of_birth);
    formData.append('email', values?.email);
    formData.append('first_name', values?.first_name);
    formData.append('last_name', values?.last_name);
    formData.append('gender', values?.gender);
    if (this.profileDetails.image && this.format) {
      const blob = this.photoService.base64toBlob(this.profileDetails.image);
      formData.append('image', blob, 'image.' + this.format);
    }
    console.log(formData);
    this.profileService.updateProfile(this.userId, formData).subscribe(
      (data: any) => {
        console.log(data);
        this.profileDetails = data;
        this.loading = false;
        this.alertService.createToast({
          header: 'Profile was successfully updated!',
          mode: 'ios',
          position: 'bottom',
        });
        this.format = '';
      },
      (error: any) => {
        this.loading = false;
        // this.alertService.presentErrorAlert(error?.email?.error);

        if (error.status === 401) {
          this.alertService.presentErrorAlert('Something went wrong');
        } else {
          this.alertService.presentErrorAlert(
            'The data is not updated. Check if all data has been filled'
          );
        }
      }
    );
  }

  async openSourcePopover() {
    const modalHeight =
      Math.floor(
        (100 * (210 + (this.platform.is('ios') ? 34 : 0))) / window.innerHeight
      ) / 100;

    const modal = await this.modalController.create({
      component: SourcePopoverComponent,
      cssClass: '',
      mode: 'ios',
      breakpoints: [0, modalHeight],
      initialBreakpoint: modalHeight,
      handle: true,
    });

    modal.onDidDismiss().then((returnedData: any) => {
      console.log(returnedData);
      if (returnedData && returnedData?.data) {
        // this.profileDetails.image = this.photoService.base64toBlob(
        //   returnedData?.data?.photo
        // );
        this.profileDetails.image = returnedData?.data?.photo;
        this.format = returnedData?.data?.format;
        if (
          returnedData?.data?.photo &&
          returnedData?.data?.photo.includes('svg+xml')
        ) {
          this.format = 'svg';
        }
        this.handleProfile(this.profileDetails);
      }
    });

    return await modal.present();
  }
}
