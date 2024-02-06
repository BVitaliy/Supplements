import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Products } from 'src/mock/products';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {
  product: any;
  public reviewedProducts: any[] = [...Products];

  constructor(
    public navCtrl: NavController,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.product = {
      category: 'Athletic Greens',
      title:
        'Ultimate Daily, Whole Food Sourced  All in One Greens Supplement Powder',
      score: 9.3,
      favorite: false,
      image: './assets/img/temp/product-detail.png',
    };
  }
}
