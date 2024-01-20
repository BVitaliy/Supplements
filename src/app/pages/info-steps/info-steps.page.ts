import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FIRST_OPEN_APP } from 'src/app/app.config';

@Component({
  selector: 'app-info-steps',
  templateUrl: './info-steps.page.html',
  styleUrls: ['./info-steps.page.scss'],
})
export class InfoStepsPage implements OnInit {
  currentStep = 1;

  constructor(public navCtrl: NavController, private storage: Storage) {}

  ngOnInit() {}

  next() {
    this.currentStep >= 5 ? (this.currentStep = 5) : this.currentStep++;
  }

  nextPage(url: string) {
    this.storage.set(FIRST_OPEN_APP, true);
    this.navCtrl.navigateRoot(url);
  }
}
