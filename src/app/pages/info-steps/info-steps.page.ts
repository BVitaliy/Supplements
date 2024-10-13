import { Component, OnInit } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FIRST_OPEN_APP } from 'src/app/app.config';
import { ThemeOptionsService } from 'src/app/core/services/theme-options.service';

@Component({
  selector: 'app-info-steps',
  templateUrl: './info-steps.page.html',
  styleUrls: ['./info-steps.page.scss'],
})
export class InfoStepsPage implements OnInit {
  currentStep = 1;

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private platform: Platform,
    private themeOptions: ThemeOptionsService
  ) {}

  ngOnInit() {
    this.storage.get('onbording_not_finished').then((event: string) => {
      console.log(event);
      if (event) {
        this.currentStep = 3;
      }
    });
    if (this.platform.is('hybrid')) {
      this.themeOptions.setStatusBarDark();
    }
  }

  next() {
    this.currentStep >= 5 ? (this.currentStep = 5) : this.currentStep++;
    if (this.currentStep >= 4) {
      this.storage.set('onbording_not_finished', false);
    }
  }

  back() {
    this.currentStep--;
  }

  nextPage(url: string) {
    this.storage.set(FIRST_OPEN_APP, true);
    this.navCtrl.navigateRoot(url);
  }

  goToScanner(url: string) {
    this.navCtrl.navigateForward(url);
  }
}
