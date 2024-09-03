import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { finalize } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { PhotoService } from 'src/app/core/services/photo.service';
import { ProfileService } from '../../profile.service';
import { Filesystem } from '@capacitor/filesystem';
import { ControlPopoverComponent } from '../../components/control-popover/control-popover.component';

@Component({
  selector: 'app-report-problem',
  templateUrl: './report-problem.page.html',
  styleUrls: ['./report-problem.page.scss'],
})
export class ReportProblemPage {
  form!: FormGroup;
  loading = false;
  loadingPhoto = false;
  images: Array<any> = [
    // {
    //   format: '',
    //   blob: {},
    //   src: 'https://m.media-amazon.com/images/I/41A6CRTbtaL.jpg',
    // },
    // {
    //   format: '',
    //   blob: {},
    //   src: 'https://m.media-amazon.com/images/I/41A6CRTbtaL.jpg',
    // },
  ];

  constructor(
    public navCtrl: NavController,
    private profileService: ProfileService,
    private alertService: AlertService,
    private photoService: PhotoService,
    private platform: Platform,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      theme: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.required]),
    });
  }

  public handleSaveChanges(): void {
    this.loading = true;
    console.log('form', this.form.value);
    this.profileService
      .sendReport(this.form.value)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.form.reset();
          this.alertService.createToast({
            header: 'Report sent successfully!',
            mode: 'ios',
            position: 'bottom',
          });
          this.navCtrl.back();
        },
        (error: any) => {
          if (error.status === 401) {
            this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }

  uploadImage() {}

  // Photo from gallery
  openGallery(indexChange?: number) {
    this.loadingPhoto = true;
    this.photoService
      .choosePicture(1)
      .then(
        async (imageData: any) => {
          if (imageData && imageData?.photos?.length) {
            console.log('image data', imageData);
            let images = [];
            if (!indexChange) {
              for (const image of imageData?.photos) {
                console.log(image);
                const base64Response = await Filesystem.readFile({
                  path: image.path || image.webPath,
                });
                const blob = this.photoService.base64toBlob(
                  `data:image/${image.format};base64,` + base64Response.data
                );

                images.push({
                  format: image.format,
                  blob: blob,
                  src:
                    `data:image/${image.format};base64,` + base64Response.data,
                });
              }
              this.images = this.images.concat(images);
            } else {
              const image = imageData?.photos[0];
              const base64Response = await Filesystem.readFile({
                path: image.path || image.webPath,
              });
              const blob = this.photoService.base64toBlob(
                `data:image/${image.format};base64,` + base64Response.data
              );

              this.images[indexChange] = {
                format: image.format,
                blob: blob,
                src: `data:image/${image.format};base64,` + base64Response.data,
              };
            }
            console.log(this.images);
          } else {
            this.loadingPhoto = false;
            this.alertService.warning('Something went wrong, please try again');
          }
        },
        (error: any) => {
          this.loadingPhoto = false;
        }
      )
      .finally(() => {
        this.loadingPhoto = false;
      });
  }

  async openSourcePopover(index: number) {
    const modal = await this.modalController.create({
      component: ControlPopoverComponent,
      cssClass: 'height-auto',
      mode: 'ios',
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      handle: true,
    });

    modal.onDidDismiss().then((returnedData: any) => {
      console.log(returnedData);
      const type = returnedData.data;
      if (type === 1) {
        this.openGallery(index);
      }
      if (type === 2) {
        this.images.splice(index, 1);
      }
    });

    return await modal.present();
  }
}
