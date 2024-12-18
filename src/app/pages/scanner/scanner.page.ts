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
import { ThemeOptionsService } from 'src/app/core/services/theme-options.service';
import { ProductDetailPage } from '../product-detail/product-detail.page';

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
    public platform: Platform,
    private storage: Storage,
    public router: Router,
    private modalController: ModalController,
    private barcodeScanner: BarcodeScanner,
    private catalogService: CatalogService,
    private themeOptions: ThemeOptionsService
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

  openScanner() {
    this.openCameraToScanning();
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
          if (barcodeData?.text) {
            this.getProductByBarcode(barcodeData?.text);
          } else if (barcodeData?.cancelled) {
            this.navCtrl.back();
          }
          // this.openProductNotFound();
        })
        .catch((error) => {
          console.log(error);
          if (error?.cancelled) {
            this.navCtrl.back();
          } else {
            this.openProductNotFound();
          }
          this.loading = false;
        });
    } else {
      this.loading = false;
      this.openProductNotFound();
      // this.openProductInModal(3379);
      if (this.platform.is('ios')) {
        // this.navCtrl.back();
      }
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
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if(data.data === 'openSearch'){
        
      } else {

       
      if (this.logged && !this.router.url.includes('add-product')) {
        // this.navCtrl.navigateForward(['/home/tabs/tab/main']);
        this.navCtrl.back();
        if (this.platform.is('hybrid')) {
          this.themeOptions.setStatusBarWhite();
        }
      }
      if (!this.logged) {
        this.navCtrl.navigateForward(['info-steps']);
        if (this.platform.is('hybrid')) {
          this.themeOptions.setStatusBarDark();
        }
      }}
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
            // this.navCtrl.navigateForward(['/product/detail/', data?.id]);
            this.openProductInModal(data?.id);
          } else {
            this.openProductNotFound();
          }
        },
        (error: any) => {
          this.openProductNotFound();
        }
      );
  }

  async openProductInModal(id: any) {
    const modal = await this.modalController.create({
      component: ProductDetailPage,
      cssClass: '',
      mode: 'ios',
      handle: true,
      componentProps: {
        openedInModal: true,
        id,
      },
    });

    modal.onDidDismiss().then((returnedData: any) => {
      this.navCtrl.navigateForward(['info-steps']);
      if (this.platform.is('hybrid')) {
        this.themeOptions.setStatusBarDark();
      }
    });

    return await modal.present();
  }
}
