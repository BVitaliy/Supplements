import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.page.html',
  styleUrls: ['./add-review.page.scss'],
})
export class AddReviewPage implements OnInit {
  product: any;

  constructor(public navCtrl: NavController) {}

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
