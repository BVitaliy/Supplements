import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Products } from 'src/mock/products';

@Component({
  selector: 'app-brand-detail',
  templateUrl: './brand-detail.page.html',
  styleUrls: ['./brand-detail.page.scss'],
})
export class BrandDetailPage implements OnInit {
  public listProducts: any[] = [...Products];
  loading: boolean = false;
  title = '';

  constructor(public navCtrl: NavController, private route: ActivatedRoute) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.title = this.route.snapshot.paramMap.get('title') || '';
  }

  openSortPopover() {}
  openFilter() {}
}
