import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.page.html',
  styleUrls: ['./add-review.page.scss'],
})
export class AddReviewPage implements OnInit {
  form!: FormGroup;
  product: any;

  constructor(public navCtrl: NavController) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      comment: new FormControl(null, [Validators.required]),
      rate: new FormControl(null, [Validators.required]),
    });

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
