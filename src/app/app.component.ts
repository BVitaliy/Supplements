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
import { ThemeOptionsService } from './core/services/theme-options.service';

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
    private themeOptions: ThemeOptionsService,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    this.initApp();
  }

  async initApp() {
    this.storage.create().then(() => {
      this.platform.ready().then(() => {
        if (this.platform.is('hybrid')) {
          this.themeOptions.setStatusBarWhite();

          GoogleAuth.initialize({
            grantOfflineAccess: true,
            // clientId:'274080642453-o31iec6l7s9ra52jq0t701db26kfmct1.apps.googleusercontent.com',
            // serverClientId:
            //   '274080642453-pnrmp7g8n68bh430upid33l23vlgu35n.apps.googleusercontent.com',
            clientId:
            '274080642453-pnrmp7g8n68bh430upid33l23vlgu35n.apps.googleusercontent.com',
          });

          this.screenOrientation.lock(
            this.screenOrientation.ORIENTATIONS.PORTRAIT
          ); // 'portrait'
          this.networkStatusService.networkStatus();
          this.permissionsService.requestPermissions();

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
    });
  }
}
