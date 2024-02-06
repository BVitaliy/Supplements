import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { SubmittedProductsTabs } from './submitted-products.models';
import { Products } from '../../../../../mock/products';

@Component({
  selector: 'app-submitted-products',
  templateUrl: './submitted-products.page.html',
  styleUrls: ['./submitted-products.page.scss'],
})
export class SubmittedProductsPage {
  public activeTab = 'onReview';
  public submittedProductsTabs: typeof SubmittedProductsTabs =
    SubmittedProductsTabs;
  public onReviewProducts: any[] = [...Products];
  public approvedProducts: any[] = [...Products];
  public declinedProducts: any[] = [...Products];

  constructor(public navCtrl: NavController) {}

  public handleChangeTab(event: any): void {
    this.activeTab = event?.detail?.value;
  }
}
