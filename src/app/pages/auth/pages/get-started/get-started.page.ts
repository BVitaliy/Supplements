import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { NavController } from '@ionic/angular';
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
    public route: ActivatedRoute
  ) {
    this.platformName = Capacitor.getPlatform();
  }

  ngOnInit() {}

  // appleSignIn() {
  //   this.authService.signInWithAppleNative();
  // }
}
