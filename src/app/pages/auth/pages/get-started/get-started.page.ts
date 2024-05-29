import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { StatusBar } from '@capacitor/status-bar';
import { NavController, Platform } from '@ionic/angular';
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
    private platform: Platform
  ) {
    this.platformName = Capacitor.getPlatform();
  }

  ngOnInit() {
    if (this.platform.is('hybrid')) {
      StatusBar.setBackgroundColor({ color: '#ff4c00' });
    }
  }

  // appleSignIn() {
  //   this.authService.signInWithAppleNative();
  // }
}
