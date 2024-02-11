import { Component, OnInit } from '@angular/core';
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

  constructor(public navCtrl: NavController) {}

  ngOnInit() {}

  openSortPopover() {}

  openFilter() {}
}
