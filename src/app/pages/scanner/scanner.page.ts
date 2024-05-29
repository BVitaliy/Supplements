import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import {
  BarcodeScanner,
  BarcodeScannerOptions,
} from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { ProductNotFoundComponent } from 'src/app/shared/components/product-not-found/product-not-found.component';
import { Router } from '@angular/router';
import { CatalogService } from '../catalog/catalog.service';
import { finalize } from 'rxjs';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit {
  loading = true;
  logged = false;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private storage: Storage,
    public router: Router,
    private modalController: ModalController,
    private barcodeScanner: BarcodeScanner,
    private catalogService: CatalogService
  ) {}

  ngOnInit() {
    this.storage.get('access_token').then((event: string) => {
      console.log(event);
      if (event) {
        this.logged = true;
      }
    });
    // this.getProductByBarcode();
  }

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
        prompt: 'Place a barcode inside the scan areas',
        torchOn: false,
      };

      this.barcodeScanner
        .scan(options)
        .then((barcodeData) => {
          console.log(barcodeData);
          if (barcodeData?.format === 'QR_CODE') {
            // this.getUserInfoByQrCode(this.cardQrCode);
          } else {
            this.getProductByBarcode(barcodeData?.text);
          }
          // this.openProductNotFound();
        })
        .catch((error) => {
          this.openProductNotFound();
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
    if (this.platform.is('hybrid')) {
      StatusBar.setBackgroundColor({ color: '#00000099' });
      StatusBar.setStyle({ style: Style.Light });
    }

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
      console.log(this.router.url);
      if (this.logged && !this.router.url.includes('add-product')) {
        // this.navCtrl.navigateForward(['/home/tabs/tab/main']);
        this.navCtrl.back();
        if (this.platform.is('hybrid')) {
          StatusBar.setBackgroundColor({ color: '#ff4c00' });
          StatusBar.setStyle({ style: Style.Light });
        }
      }
      if (!this.logged) {
        this.navCtrl.navigateForward(['info-steps']);
        if (this.platform.is('hybrid')) {
          StatusBar.setBackgroundColor({ color: '#fff1dd' });
          StatusBar.setStyle({ style: Style.Dark });
        }
      }
    });

    return await modal.present();
  }

  getProductByBarcode(barcode: string) {
    const data = {
      barcode,
    };
    this.catalogService
      .getProductByBarcode(data)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          if (data?.id) {
            this.navCtrl.navigateForward(['/product/detail/', data?.id]);
          } else {
            this.openProductNotFound();
          }
        },
        (error: any) => {
          this.openProductNotFound();
        }
      );
  }
}
