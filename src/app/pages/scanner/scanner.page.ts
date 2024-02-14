import { Component, OnInit } from '@angular/core';

import {
  BarcodeScanner,
  BarcodeScannerOptions,
} from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { ProductNotFoundComponent } from 'src/app/shared/components/product-not-found/product-not-found.component';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  loading = true;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private modalController: ModalController,
    private barcodeScanner: BarcodeScanner
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.openCameraToScanning();
  }
  openCameraToScanning() {
    if (this.platform.is('hybrid')) {
      const options: BarcodeScannerOptions = {
        preferFrontCamera: false,
        showFlipCameraButton: true,
        showTorchButton: true,
        disableAnimations: false,
        disableSuccessBeep: false,
        // formats: 'QR_CODE',
        torchOn: false,
      };

      this.barcodeScanner
        .scan(options)
        .then((barcodeData) => {
          if (barcodeData?.format === 'CODE_128') {
            // this.openDelivery(barcodeData?.text, 1);
          } else if (barcodeData?.format === 'QR_CODE') {
            // this.getUserInfoByQrCode(this.cardQrCode);
          } else if (barcodeData?.format === 'CODE_39') {
            // this.openDelivery(barcodeData?.text, 2);
          }
        })
        .catch((error) => {
          // this.scanningInfo = null;
          this.loading = false;
        });
    } else {
      // this.scanningInfo = null;
      this.loading = false;
      this.openProductNotFound();
      // setTimeout(() => { // Видалити !!!
      //   this.getUserInfoByQrCode('89770172'); // '42110929'
      // }, 1000);
    }
  }

  async openProductNotFound() {
    const modal = await this.modalController.create({
      component: ProductNotFoundComponent,
      cssClass: '',
      mode: 'ios',
      breakpoints: [0, 0.8],
      initialBreakpoint: 0.8,
      handle: true,
      componentProps: {},
    });

    modal.onDidDismiss().then(() => {
      console.log('close');
      this.navCtrl.navigateForward(['info-steps']);
    });

    return await modal.present();
  }
}
