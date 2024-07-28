import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { PhotoService } from 'src/app/core/services/photo.service';
import { Filesystem } from '@capacitor/filesystem';
import { Camera } from '@capacitor/camera';

@Component({
  selector: 'app-source-popover',
  templateUrl: './source-popover.component.html',
  styleUrls: ['./source-popover.component.scss'],
})
export class SourcePopoverComponent implements OnInit {
  backBtnSubscription!: Subscription;
  loadingPhoto: boolean = false;
  uploadPhoto: any;
  format: any;

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private photoService: PhotoService,
    private alertService: AlertService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.backBtnSubscription = this.platform.backButton.subscribeWithPriority(
      9995,
      () => {
        this.cancelModal();
      }
    );
  }

  // Роблю фото із телефону
  openCamera() {
    this.loadingPhoto = true;
    this.photoService.takePhoto().then(
      async (imageData: any) => {
        if (imageData) {
          // const photo = imageData.dataUrl;
          // let blob = this.photoService.base64toBlob(imageData?.dataUrl);
          // const photo64 = this.photoService.blobToBase64(blob);
          // const fd = new FormData();
          // fd.append('file', blob, 'filename.jpg');
          console.log(imageData);
          this.uploadPhoto = imageData?.dataUrl;
          this.format = imageData.format;
          this.cancelModal();
        } else {
          this.loadingPhoto = false;
          this.alertService.warning('Something went wrong, please try again');
        }
      },
      (error: any) => {
        this.loadingPhoto = false;
      }
    );
  }

  // Фото з галереї
  openGallery() {
    this.loadingPhoto = true;
    this.photoService.choosePicture(1).then(
      async (imageData: any) => {
        if (imageData && imageData?.photos?.length) {
          console.log('image data', imageData);
          for (const image of imageData?.photos) {
            const base64Response = await Filesystem.readFile({
              path: image.path,
            });
            const blob = this.photoService.base64toBlob(
              `data:image/${image.format};base64,` + base64Response.data
            );

            // const fd = new FormData();
            // fd.append(
            //   'file',
            //   blob,
            //   image.path.slice(image.path.lastIndexOf('/') + 1)
            // );
            this.uploadPhoto =
              `data:image/${image.format};base64,` + base64Response.data;
            console.log(base64Response);
            this.format = image.format;
          }
          this.cancelModal();
        } else {
          this.loadingPhoto = false;
          this.alertService.warning('Something went wrong, please try again');
        }
      },
      (error: any) => {
        this.loadingPhoto = false;
      }
    );
  }

  async checkCameraPermissions() {
    if (this.platform.is('android')) {
      this.openCamera();
    } else {
      const status = await Camera.checkPermissions();

      if (status.photos === 'denied') {
        this.showSettingsAlert();
      } else if (status.photos === 'prompt') {
        const result = await Camera.requestPermissions();
        if (result.photos === 'denied') {
          this.showSettingsAlert();
        } else {
          this.openCamera();
        }
      } else {
        this.openCamera();
      }
    }
  }

  async getPhotoFromGallery() {
    if (this.platform.is('android')) {
      this.openGallery();
    } else {
      const status = await Camera.checkPermissions();

      if (status.photos === 'denied') {
        // this.showSettingsAlert();
        const result = await Camera.requestPermissions();
        if (result.photos === 'denied') {
          this.showSettingsAlert();
        } else {
          this.openGallery();
        }
      } else if (status.photos === 'prompt') {
        const result = await Camera.requestPermissions();
        if (result.photos === 'denied') {
          this.showSettingsAlert();
        } else {
          this.openGallery();
        }
      } else {
        this.openGallery();
      }
    }
  }

  showSettingsAlert() {
    // Use your preferred alert method, this is just an example
    alert('Please enable photo permissions in the app settings.');
  }
  async cancelModal() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
    const onClosedData = { photo: this.uploadPhoto, format: this.format };
    await this.modalController.dismiss(onClosedData);
  }

  ionViewDidLeave() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
  }
}
