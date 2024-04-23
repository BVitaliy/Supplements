import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { SourcePopoverComponent } from 'src/app/shared/components/source-popover/source-popover.component';
import { ThankComponent } from 'src/app/shared/components/thank/thank.component';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PhotoService } from 'src/app/core/services/photo.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { createWorker } from 'tesseract.js';
import { finalize, Subscription } from 'rxjs';
import { CatalogService } from '../catalog/catalog.service';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {
  @Input() id: any = null;
  form!: FormGroup;
  image: any;
  type: any;
  loading = false;
  backBtnSubscription!: Subscription;
  format: any;

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController,
    private platform: Platform,
    private photoService: PhotoService,
    private alertService: AlertService,
    private catalogService: CatalogService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      photo: new FormControl(null),
      images: new FormControl([]),
      id: new FormControl(null),
      barcode: new FormControl(null, [Validators.required]),
      status: new FormControl(0),
      brand: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      ingredients: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
      decline_reason: new FormControl(null),
    });
  }

  ionViewWillEnter() {
    this.backBtnSubscription = this.platform.backButton.subscribeWithPriority(
      9995,
      () => {
        this.cancelModal();
      }
    );

    if (this.id) {
      this.getProduct();
    }
    // this.getData();
  }

  async createProductSuccess(url?: string) {
    this.form.reset();
    const modal = await this.modalController.create({
      component: ThankComponent,
      cssClass: 'full-screen-modal',
      mode: 'ios',
      componentProps: {
        title: 'Thank you!',
        description: `Your request is under review <br/> We will let you know if the product you submitted has been added to the database`,
        buttonRouterUrl: url,
        imgSrc: './assets/img/thank-img.svg',
        hasCloseBtn: false,
        buttonText: 'Done',
      },
    });
    return await modal.present();
  }

  // Відкривання модалки ingredient detail
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
      if (returnedData && returnedData?.data) {
        this.form.get('photo')?.setValue(returnedData?.data?.photo);
        console.log('returndata', returnedData);
        this.format = returnedData?.data?.format;
      }
    });

    return await modal.present();
  }

  async takeTextFromImage(input: string) {
    // const photo = await Camera.getPhoto({
    //   quality: 90,
    //   allowEditing: true,
    //   resultType: CameraResultType.Uri,
    //   source: CameraSource.Camera,
    // });

    this.photoService.takePhoto().then(
      async (imageData: any) => {
        if (imageData) {
          // const photo = imageData.dataUrl;
          // let blob = this.photoService.base64toBlob(imageData?.dataUrl);
          // const photo64 = this.photoService.blobToBase64(blob);
          // const fd = new FormData();
          // fd.append('file', blob, 'filename.jpg');

          console.log(imageData?.dataUrl);
          const image = imageData?.dataUrl;
          const worker = await createWorker();
          if (worker) {
            this.loading = true;
            this.type = input;
          }
          worker.load();
          const {
            data: { text },
          } = await worker.recognize(image);
          console.log(text);
          if (text) {
            this.form.get(input)?.setValue(text);
            this.loading = false;
            this.type = null;
          }
          await worker.terminate();
        } else {
          // this.loadingPhoto = false;
          this.alertService.warning('Something went wrong, please try again');
        }
      },
      (error: any) => {
        // this.loadingPhoto = false;
      }
    );
    // this.image = photo.webPath;
    // console.log(photo);
  }

  async cancelModal() {
    if (this.id) {
      if (this.backBtnSubscription) {
        this.backBtnSubscription.unsubscribe();
      }
      const onClosedData = this.form.value || null;
      await this.modalController.dismiss(onClosedData);
    } else {
      this.navCtrl.back();
    }
  }

  ionViewDidLeave() {
    if (this.backBtnSubscription) {
      this.backBtnSubscription.unsubscribe();
    }
  }

  requestProduct() {
    this.loading = true;
    let data = {
      ...this.form.value,
    };
    console.log(this.form.value.photo);
    if (this.form.value.photo && this.form.value.photo.includes('svg+xml')) {
      this.format = 'svg';
    }
    delete data?.photo;
    delete data?.images;

    console.log(data);

    if (!this.id) {
      this.catalogService.requestSupplement(data).subscribe(
        (data: any) => {
          console.log(data);
          this.uploadImage(data?.id);
          this.loading = false;
          this.createProductSuccess('/home/tabs/tab/catalog');
        },
        (error: any) => {
          this.loading = false;
        }
      );
    } else {
      this.catalogService.updateRequestSupplement(data).subscribe(
        (data: any) => {
          this.uploadImage(data?.id);
          this.loading = false;
          this.cancelModal();
          this.createProductSuccess();
        },
        (error: any) => {
          this.loading = false;
        }
      );
    }
  }

  uploadImage(id: any) {
    const image = this.form.value.photo;
    console.log(image);

    if (image) {
      const blob = this.photoService.base64toBlob(image);
      const formData = new FormData();
      formData.append('image', blob, 'image.' + this.format);
      console.log(blob);
      console.log(formData);
      this.catalogService.uploadImage(id, formData).subscribe(
        (data: any) => {
          console.log(data);
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
        }
      );
    }
  }

  // Рефреш даних користувача
  doRefresh(event: any) {
    this.getProduct(true, () => event.target.complete());
  }

  getProduct(refresh?: boolean, callbackFunction?: () => void) {
    this.loading = true;
    this.catalogService
      .getProductRequest(this.id, refresh)
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
          if (data) {
            this.form.patchValue(data);
          }
        },
        (error: any) => {
          // this.alertService.presentErrorAlert(error?.email?.error);

          if (error.status === 401) {
            // this.alertService.presentErrorAlert('Something went wrong');
          }
        }
      );
  }
}
