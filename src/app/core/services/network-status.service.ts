import { Injectable } from '@angular/core';

// import { Network } from '@ionic-native/network/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { debounceTime, delay } from 'rxjs/operators';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})


export class NetworkStatusService {
  private networkAlert: any;
  constructor(
    private network: Network,
    private alertService: AlertService
  ) { }

  networkStatus() {
    this.network.onDisconnect()
      .pipe(
        debounceTime(1000),
        delay(1000)
      )
      .subscribe(async () => {
        console.log('network disconnect');
        await this.alertService.presentNetworkError((modal: any) => this.networkAlert = modal);
      });

    this.network.onConnect()
      .pipe(
        debounceTime(1000),
        delay(1000)
      )
      .subscribe(() => {
        console.log('network connected!');
        if (this.networkAlert) {
          this.networkAlert?.dismiss();
        }
      });
  }
}
