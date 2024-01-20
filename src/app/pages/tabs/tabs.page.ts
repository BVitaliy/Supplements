import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { USER_ID_STORAGE_NAME } from 'src/app/app.config';
import { BackgroundGeolocationService } from 'src/app/core/services/background-geolocation.service';
import { HideHeaderTabsService } from 'src/app/core/services/hide-header-tabs.service';
import { InAppBrowserService } from 'src/app/core/services/in-app-browser.service';
import { ThemeOptionsService } from 'src/app/core/services/theme-options.service';
import { UpdateService } from 'src/app/core/services/update.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage implements OnInit {
  unreadMessages!: number;
  unreadNotifications!: number;
  tokenSubscription!: Subscription;
  userId!: number;

  constructor(
    public navCtrl: NavController,
    public router: Router,
    private storage: Storage,
    public hideHeaderTabsService: HideHeaderTabsService
  ) {}

  async ngOnInit() {
    this.userId = await this.storage.get(USER_ID_STORAGE_NAME);
  }
}
