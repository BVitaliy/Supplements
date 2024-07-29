import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ThemeOptionsService } from 'src/app/core/services/theme-options.service';
import { AuthenticationService } from '../../authentication.service';
@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.page.html',
  styleUrls: ['./get-started.page.scss'],
})
export class GetStartedPage implements OnInit {
  platformName: any = null;
  constructor(
    public navCtrl: NavController,
    public authService: AuthenticationService,
    public route: ActivatedRoute,
    private platform: Platform,
    private themeOptions: ThemeOptionsService,
    private storage: Storage
  ) {
    this.platformName = Capacitor.getPlatform();
  }

  ngOnInit() {
    if (this.platform.is('hybrid')) {
      this.themeOptions.setStatusBarWhite();
      // StatusBar.setBackgroundColor({ color: '#ff4c00' });
      // StatusBar.setStyle({ style: Style.Light });
    }
    this.storage.remove('user');
  }

  googleSignIn() {

    if (Capacitor.getPlatform() === 'ios') {
      this.authService.googleSignIn();
    } else {
    this.authService.loginViaGoogle();
    }
    // this.authService.signInWithAppleNative();
  }
}
