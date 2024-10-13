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
  APP_HOME_REDIRECT_URL,
  FIRST_OPEN_APP,
} from '../../app.config';

@Injectable({
  providedIn: 'root',
})
export class FirstOpenGuard implements CanActivate {
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
      return this.storage.get(FIRST_OPEN_APP).then((opened) => {
        if (opened) {
          this.navCtrl.navigateForward([APP_AUTH_REDIRECT_URL]);
          return false;
        } else {
          return true;
        }
      });
    });
  }
}
