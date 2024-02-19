import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-product-alert-popup',
  templateUrl: './product-alert-popup.component.html',
  styleUrls: ['./product-alert-popup.component.scss'],
})
export class ProductAlertPopupComponent implements OnInit {
  constructor(
    public navCtrl: NavController,
    private modalController: ModalController
  ) {}

  ngOnInit() {}
  async cancelModal() {
    await this.modalController.dismiss();
  }

  async goToOnboarding() {
    this.navCtrl.navigateForward(['info-steps']);
    await this.modalController.dismiss(true);
  }
}
