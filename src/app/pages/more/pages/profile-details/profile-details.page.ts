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
  filePhoto: any;

  constructor(
    public navCtrl: NavController,
    private modalCtrl: ModalController,
    private storage: Storage,
    private profileService: ProfileService,
    private alertService: AlertService,
    private platform: Platform,
    private modalController: ModalController,
    private photoService: PhotoService
  ) {}

  ionViewWillEnter() {
    // this.storage.get('user').then((user) => {
    //   if (user) {
    //     this.profileDetails = JSON.parse(user);
    //   } else {
    this.getUser();
    //   }
    // });
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
      field === ProfileDetailsFields.gender ? 0.5 : 0.38;
    const modal: HTMLIonModalElement = await this.modalCtrl.create({
      component: EditProfileDetailPage,
      // breakpoints: [0, 0.38, 0.5, 0.8],
      // initialBreakpoint: initialBreakpointValue,
      cssClass: 'auto-height',
      componentProps: {
        fieldTitle: field,
        fieldValue: value,
      },
    });
    modal.onDidDismiss().then((data) => {
      if (data?.data) {
        let body = null;
        switch (data?.data.fieldTitle) {
          case 'first_name': {
            body = {
              ...this.profileDetails,
              first_name: data?.data?.fieldNewValue,
            };
            console.log(body);
            this.handleProfile(body, 'first_name');
            break;
          }
          case 'last_name': {
            body = {
              ...this.profileDetails,
              last_name: data?.data?.fieldNewValue,
            };
            this.handleProfile(body, 'last_name');
            break;
          }
          case 'email': {
            body = {
              ...this.profileDetails,
              email: data?.data?.fieldNewValue,
            };
            this.handleProfile(body, 'email');
            break;
          }
          case 'gender': {
            body = {
              ...this.profileDetails,
              gender: data?.data?.fieldNewValue,
            };
            this.handleProfile(body, 'gender');
            break;
          }
          case 'date_of_birth': {
            body = {
              ...this.profileDetails,
              date_of_birth: data?.data?.fieldNewValue,
            };
            this.handleProfile(body, 'date_of_birth');
            break;
          }
        }
      }
    });
    return await modal.present();
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
        this.profileDetails.image = returnedData?.data?.photo;
        this.format = returnedData?.data?.format;

        if (returnedData?.data?.photo?.name) {
          this.filePhoto = returnedData?.data?.photo;

          this.handleProfile(this.profileDetails, 'image');
        } else {
          if (
            returnedData?.data?.photo &&
            returnedData?.data?.photo.includes('svg+xml')
          ) {
            this.format = 'svg';
          }
          this.handleProfile(this.profileDetails, 'image');
        }
      }
    });

    return await modal.present();
  }

  handleProfile(values: any, field: string) {
    this.loading = true;

    const formData = new FormData();

    if (this.profileDetails.image && this.format) {
      let blob: any;
      if (this.filePhoto) {
        blob = this.filePhoto;
      } else {
        blob = this.photoService.base64toBlob(this.profileDetails.image);
      }

      console.log(this.format);
      console.log(blob);
      setTimeout(() => {
        formData.append('image', blob, 'image.' + this.format);
        console.log(formData);
      }, 400);
    } else {
      formData.append(field, values[field]);
    }
    setTimeout(() => {
      this.profileService.updateProfile(this.userId, formData).subscribe(
        (data: any) => {
          this.profileDetails = data;
          this.storage.set('user', JSON.stringify(data));
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
    }, 700);
  }
}
