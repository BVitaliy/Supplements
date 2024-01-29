import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HistoryTabs } from './history.models';
import { Products } from '../../../../../mock/products';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage {
  public historyTabs: typeof HistoryTabs = HistoryTabs;
  public activeTab: HistoryTabs = HistoryTabs.viewed;
  public viewedProducts: any[] = [ ...Products ];
  public scannedProducts: any[] = [ ...Products ];
  public reviewedProducts: any[] = [ ...Products ];

  constructor(public navCtrl: NavController) {}

  public handleChangeTab(tab: HistoryTabs): void {
    this.activeTab = tab;
  }
}
