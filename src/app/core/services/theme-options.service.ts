import { of, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { AlertService } from './alert.service';
import { ACCESS_TOKEN_STORAGE_NAME } from 'src/app/app.config';
import { Storage } from '@ionic/storage';
import { StatusBar, Style } from '@capacitor/status-bar';

@Injectable({
  providedIn: 'root',
})
export class ThemeOptionsService {
  optionsLoaded = false;
  public getOptions$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public getMap$: ReplaySubject<any> = new ReplaySubject<any>(1);
  userToken: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private storage: Storage
  ) {
    this.saveToken();
  }

  loadOptions() {
    return this.http
      .post(`${environment.origin}/api/driver/cabinet/getAppConfigsByTypes`, {
        types: [
          'damage_types',
          'review_conditions',
          'updates_popup',
          'vehicle_types',
          'google_maps_key',
        ],
      })
      .subscribe(
        (data: any) => {
          this.getOptions$.next(data);

          if (!this.optionsLoaded) {
            const key = data?.find(
              (type: any) => type?.type === 'google_maps_key'
            )?.value;
            this.getGoogleMaps(key);
          }
          this.optionsLoaded = true;
        },
        (error) => {
          this.alertService.presentErrorAlert(error);
        }
      );
  }

  get getData() {
    return this.getOptions$;
  }

  getGoogleMaps(mapApiKey: string) {
    mapApiKey = mapApiKey
      ? mapApiKey
      : 'AIzaSyBm97S5Vq-XjqHi1nn6sBbNKcgyRqNwvpE';
    this.getMap$.next(mapApiKey);
  }

  get getMap() {
    return this.getMap$;
  }

  saveToken(access_token?: any) {
    this.storage.create().then(() =>
      this.storage.get(ACCESS_TOKEN_STORAGE_NAME).then((token: string) => {
        if (access_token) {
          this.userToken.next(access_token);
        } else if (token) {
          this.userToken.next(token);
        }
      })
    );
  }

  get getToken(): any {
    return this.userToken;
  }

  setStatusBarWhite() {
    StatusBar.setBackgroundColor({ color: '#ff4c00' });
    StatusBar.setStyle({ style: Style.Light });
  }
  setStatusBarDark() {
    StatusBar.setBackgroundColor({ color: '#fff1dd' });
    StatusBar.setStyle({ style: Style.Dark });
  }
}
