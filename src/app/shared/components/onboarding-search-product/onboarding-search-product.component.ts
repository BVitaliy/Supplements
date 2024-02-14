import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Products } from 'src/mock/products';

@Component({
  selector: 'app-onboarding-search-product',
  templateUrl: './onboarding-search-product.component.html',
  styleUrls: ['./onboarding-search-product.component.scss'],
})
export class OnboardingSearchProductComponent implements OnInit {
  products: Array<any> = [];
  modalHeight = 0;
  searchText = '';
  openInModal = true;
  constructor(private modalController: ModalController) {
    this.products = Products;
  }

  ngOnInit() {
    this.modalHeight = Math.floor(0.9 * window.innerHeight);
  }

  public search(event: any): void {
    console.log(event?.detail?.value);
    this.searchText = event?.detail?.value;
  }

  async cancelModal() {
    await this.modalController.dismiss();
  }
}
