import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-product-not-found',
  templateUrl: './product-not-found.component.html',
  styleUrls: ['./product-not-found.component.scss'],
})
export class ProductNotFoundComponent implements OnInit {
  modalHeight = 0;

  constructor(
    public navCtrl: NavController,
    private platform: Platform,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.modalHeight = Math.floor(0.75 * window.innerHeight);
  }

  openPage() {
    this.cancelModal();
    this.navCtrl.navigateForward(['/add-product']);
  }

  async cancelModal() {
    await this.modalController.dismiss();
  }
}
