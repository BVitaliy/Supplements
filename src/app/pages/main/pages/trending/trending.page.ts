import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Products } from 'src/mock/products';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.page.html',
  styleUrls: ['./trending.page.scss'],
})
export class TrendingPage implements OnInit {
  public listProducts: any[] = [...Products];
  loading: boolean = false;

  constructor(public navCtrl: NavController) {}

  ngOnInit() {}
}
