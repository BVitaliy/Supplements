import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/core/services/alert.service';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
// import {
//   getAdditionalUserInfo,
// //   getAuth,
// //   // Auth,
// //   GoogleAuthProvider,
//   OAuthProvider,
//   signInWithCredential,
// //   signInWithPopup,
// } from '@angular/fire/auth';

// import {
//   SignInWithApple,
//   SignInWithAppleOptions,
//   SignInWithAppleResponse,
// } from '@capacitor-community/apple-sign-in';
import { Storage } from '@ionic/storage';
import {
  ACCESS_TOKEN_STORAGE_NAME,
  APP_HOME_REDIRECT_URL,
  REFRESH_TOKEN_STORAGE_NAME,
} from 'src/app/app.config';
import { NavController, Platform } from '@ionic/angular';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isWeb = false;
  signInLoading = false;
  signInLoadingGoogle = false;
  signInLoadingApple = false;

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private alertService: AlertService,
    private storage: Storage,
    private platform: Platform //private authFire: Auth
  ) {
    this.isWeb = !(this.platform.is('android') || this.platform.is('ios'));
  }

  async loginViaApple() {
    const result = await FirebaseAuthentication.signInWithApple({
      scopes: ['displayName', 'email'],
    });
    console.log(result);
    if (result) {
      const body = {
        grant_type: 'convert_token',
        client_id: 'j0sqWImKXkbDW1e7SLjxgTFcEGZoreXRYJ3gB4ZI',
        backend: 'apple-id',
        client_secret:
          'bfx11gJt0Y5WL0Uqt2ZjFbjbhVOi97RuZbDptkLFG5ENSPO4NtVZl2m1qbCkrHKU0dPmAGp2SLHq3OGsfSmWtVYFMH8QYcihyYWmE36dyXmKtMmCEg7KVCKSWxEtdEof',
        token: result?.credential?.idToken,
      };
      this.getConvertToken(body);
    }
  }

  async loginViaGoogle() {
    this.signInLoading = true;
    this.signInLoadingGoogle = true;
    const result = await FirebaseAuthentication.signInWithGoogle({
      scopes: ['profile', 'email'],
      mode: 'popup',
    });
    console.log(result);
    if (result) {
      const body = {
        grant_type: 'convert_token',
        client_id: 'j0sqWImKXkbDW1e7SLjxgTFcEGZoreXRYJ3gB4ZI',
        backend: 'google-oauth2',
        client_secret:
          'bfx11gJt0Y5WL0Uqt2ZjFbjbhVOi97RuZbDptkLFG5ENSPO4NtVZl2m1qbCkrHKU0dPmAGp2SLHq3OGsfSmWtVYFMH8QYcihyYWmE36dyXmKtMmCEg7KVCKSWxEtdEof',
        token: result?.credential?.accessToken,
      };
      this.getConvertToken(body);
    } else {
      this.signInLoading = false;
      this.signInLoadingGoogle = false;
    }
  }

  setSession(accessToken: any, refreshToken: any) {
    this.storage.set(ACCESS_TOKEN_STORAGE_NAME, accessToken);
    this.storage.set(REFRESH_TOKEN_STORAGE_NAME, refreshToken);
    this.navCtrl.navigateForward([APP_HOME_REDIRECT_URL]);
  }

  getConvertToken(body: any) {
    console.log(body);
    this.convertToken(body)
      .pipe(
        finalize(() => {
          this.signInLoading = false;
          this.signInLoadingGoogle = false;
          this.signInLoadingApple = false;
        })
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          this.setSession(data?.access_token, data?.refresh_token);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }
  async googleSignIn() {
    this.signInLoading = true;
    this.signInLoadingGoogle = true;
    const user = await GoogleAuth.signIn();
    console.log(user);

    if (user) {
      const body = {
        grant_type: 'convert_token',
        client_id: 'j0sqWImKXkbDW1e7SLjxgTFcEGZoreXRYJ3gB4ZI',
        backend: 'google-oauth2',
        client_secret:
          'bfx11gJt0Y5WL0Uqt2ZjFbjbhVOi97RuZbDptkLFG5ENSPO4NtVZl2m1qbCkrHKU0dPmAGp2SLHq3OGsfSmWtVYFMH8QYcihyYWmE36dyXmKtMmCEg7KVCKSWxEtdEof',
        token: user?.authentication?.accessToken,
      };
      this.getConvertToken(body);
    } else {
      this.signInLoading = false;
      this.signInLoadingGoogle = false;
    }
  }

  logOut() {
    if (this.platform.is('android')) {
      this.signOut();
    }
    if (this.platform.is('ios')) {
      GoogleAuth.signOut();
    }
  }

  signOut = async () => {
    await FirebaseAuthentication.signOut();
  };

  login(body: any): Observable<any> {
    return this.http.post(`${environment.origin}/token/`, body).pipe(
      catchError((error) => {
        // this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  // SIGN UP
  signup(body: any): Observable<any> {
    return this.http.post(`${environment.origin}/users/sign-up/`, body).pipe(
      catchError((error) => {
        console.log(error);
        // this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  // Оновлення токена
  refreshToken(body: any): Observable<any> {
    return this.http.post(`${environment.origin}/token/refresh/`, body).pipe(
      catchError((error) => {
        // this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  forgotPassword(body: any): Observable<any> {
    console.log('asdasd');
    return this.http
      .post(`${environment.origin}/users/forgot-password/`, body)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  recoveryCode(body: any): Observable<any> {
    return this.http
      .post(`${environment.origin}/users/recovery-code/`, body)
      .pipe(
        catchError((error) => {
          // this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  createNewPassword(body: any): Observable<any> {
    return this.http
      .post(`${environment.origin}/users/create-new-password/`, body)
      .pipe(
        catchError((error) => {
          // this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  convertToken(body: any): Observable<any> {
    return this.http
      .post(`${environment.origin}/auth/convert-token/`, body)
      .pipe(
        catchError((error) => {
          // this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }
}
