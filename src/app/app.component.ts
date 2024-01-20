import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { NetworkStatusService } from './core/services/network-status.service';
import { PushNotificationsService } from './core/services/push-notifications.service';
import { PermissionsService } from './core/services/permissions.service';
import { ThemeOptionsService } from './core/services/theme-options.service';
import { AuthenticationService } from './pages/auth/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private storage: Storage,
    private screenOrientation: ScreenOrientation,

    private pushNotificationsService: PushNotificationsService,
    private networkStatusService: NetworkStatusService,
    private permissionsService: PermissionsService,
    // Треба щоб працювали сокети!!
    public themeOptionsService: ThemeOptionsService,
    private authenticationService: AuthenticationService
  ) {
    this.initApp();
  }

  async initApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('hybrid')) {
        this.screenOrientation.lock(
          this.screenOrientation.ORIENTATIONS.PORTRAIT
        ); // 'portrait'
        this.storage.create().then(() => {
          this.pushNotificationsService.setupPush();
          this.networkStatusService.networkStatus();
          this.permissionsService.requestPermissions();
          // this.authenticationService.getUser().subscribe((data: any) => {
          //   this.storage.set(USER_STORAGE_NAME, data);
          // });
        });
      }
      this.themeOptionsService.loadOptions();
    });
  }
}
