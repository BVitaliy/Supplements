import { Component, NgZone } from '@angular/core';
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
    private modalController: ModalController,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.zone.run(() => {
      this.form = new FormGroup({
        theme: new FormControl(null, [Validators.required]),
        message: new FormControl(null, [Validators.required]),
      });
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
          this.images?.forEach((element: any) => {
            this.uploadImage(data?.id, element);
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

  async uploadImage(id: any, image: any) {
    console.log(image);
    this.zone.run(() => {
      const formData = new FormData();
      formData.append('images', image.blob, 'image.' + image.format);
      setTimeout(() => {
        this.profileService.uploadImage(id, formData).subscribe(
          (data: any) => {
            console.log(data);
            this.loading = false;
          },
          (error: any) => {
            this.loading = false;
          }
        );
      }, 600);
    });
  }

  // Photo from gallery
  openGallery(indexChange?: number, loading?: boolean) {
    if (!loading) {
      this.loadingPhoto = true;
    } else {
      if (indexChange || indexChange === 0) {
        this.images[indexChange].loading = true;
      }
    }

    this.photoService
      .choosePicture(1)
      .then(
        async (imageData: any) => {
          if (imageData && imageData?.photos?.length) {
            console.log('image data', imageData);

            let images = [];
            if (!indexChange && indexChange !== 0) {
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
                loading: true,
                format: image.format,
                blob: blob,
                src: `data:image/${image.format};base64,` + base64Response.data,
              };
            }

            console.log(this.images);
            this.loadingPhoto = false;
          } else {
            this.loadingPhoto = false;
            this.alertService.warning('Something went wrong, please try again');
          }
          this.loadingPhoto = false;
        },
        (error: any) => {
          this.loadingPhoto = false;
        }
      )
      .finally(() => {
        this.loadingPhoto = false;
      });
  }

  imgLoaded($event: any, i: number) {
    setTimeout(() => {
      this.images[i].loading = false;
    }, 1000);
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
        this.openGallery(index, true);
      }
      if (type === 2) {
        this.images.splice(index, 1);
      }
    });

    return await modal.present();
  }
}
