import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { OnboardingSearchProductComponent } from '../onboarding-search-product/onboarding-search-product.component';

@Component({
  selector: 'app-product-not-found',
  templateUrl: './product-not-found.component.html',
  styleUrls: ['./product-not-found.component.scss'],
})
export class ProductNotFoundComponent implements OnInit {
  modalHeight = 0;
  logged = false;
  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private storage: Storage,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.modalHeight = Math.floor(0.75 * window.innerHeight);
    this.storage.get('access_token').then((token) => {
      this.logged = token ? true : false;
    });
  }

  openPage(link: string) {
    this.cancelModal();
    this.navCtrl.navigateForward([link]);
  }

  async cancelModal(closeModal = false) {
    await this.modalController.dismiss(closeModal);
  }

  // Відкривання модалки
  async openSearchProductModal() {
    const modal = await this.modalController.create({
      component: OnboardingSearchProductComponent,
      cssClass: 'modal-search',
      mode: 'ios',
      breakpoints: [0, 0.9],
      initialBreakpoint: 0.9,
      handle: true,
      componentProps: {},
    });

    modal.onDidDismiss().then((returnedData: any) => {
      if (returnedData && returnedData?.data) {
        console.log(returnedData);
        this.cancelModal(true);
      }
    });

    return await modal.present();
  }
}
