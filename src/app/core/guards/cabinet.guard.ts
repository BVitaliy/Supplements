import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import {
  ACCESS_TOKEN_STORAGE_NAME,
  APP_AUTH_REDIRECT_URL,
} from '../../app.config';

@Injectable({
  providedIn: 'root',
})
export class CabinetGuard implements CanActivate {
  constructor(private navCtrl: NavController, private storage: Storage) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.storage.create().then(() => {
      return this.storage.get(ACCESS_TOKEN_STORAGE_NAME).then((user) => {
        if (user) {
          return true;
        } else {
          this.navCtrl.navigateForward(['info-steps']);
          return false;
        }
      });
    });
  }
}
