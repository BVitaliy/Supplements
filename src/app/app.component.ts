import { Component, Optional } from '@angular/core';
import {
  IonRouterOutlet,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { NetworkStatusService } from './core/services/network-status.service';
import { PermissionsService } from './core/services/permissions.service';
import { AuthenticationService } from './pages/auth/authentication.service';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private storage: Storage,
    private router: Router,
    private screenOrientation: ScreenOrientation,
    private networkStatusService: NetworkStatusService,
    private toastCtrl: ToastController,
    private permissionsService: PermissionsService,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    this.initApp();
  }

  async initApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('hybrid')) {
        StatusBar.setBackgroundColor({ color: '#ff4c00' });
        GoogleAuth.initialize({
          grantOfflineAccess: true,
          clientId:
            '461332400284-kcms0r0hqi1ofebrga2jvqhi7jlotunr.apps.googleusercontent.com',
        });
        this.screenOrientation.lock(
          this.screenOrientation.ORIENTATIONS.PORTRAIT
        ); // 'portrait'
        this.storage.create().then(() => {
          this.networkStatusService.networkStatus();
          this.permissionsService.requestPermissions();
        });
        this.platform.backButton.subscribeWithPriority(-1, () => {
          if (this.router.url === '/login' || this.router.url === '/home') {
            console.log(this.router);
            console.log(this.router.getCurrentNavigation());
            console.log(this.routerOutlet?.canGoBack());
            if (!this.routerOutlet?.canGoBack()) {
              // App.exitApp();
            }
          }
        });
      }
    });
  }
}
