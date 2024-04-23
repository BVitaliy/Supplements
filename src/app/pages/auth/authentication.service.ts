import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/core/services/alert.service';
// import {
//   Auth,
//   GoogleAuthProvider,
//   OAuthProvider,
//   signInWithCredential,
//   signInWithPopup,
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

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  isWeb = false;

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private alertService: AlertService,
    private storage: Storage,
    private platform: Platform
  ) // private auth: Auth
  {
    this.isWeb = !(this.platform.is('android') || this.platform.is('ios'));
  }

  // signInWithAppleWeb() {
  //   const provider = new OAuthProvider('apple.com');
  //   console.log(provider);
  //   signInWithPopup(this.auth, provider).then(
  //     (result: any | UserCredential) => {
  //       console.log(result);

  //       // this.storage.set(ACCESS_WITH_APPLE, true);
  //       // this.storage.set(ACCESS_TOKEN_STORAGE_NAME, result?.user?.accessToken);
  //       // this.storage.set(
  //       //   REFRESH_TOKEN_STORAGE_NAME,
  //       //   result?._tokenResponse?.refreshToken
  //       // );

  //       const body = {
  //         grant_type: 'convert_token',
  //         client_id: 'Cgqcx1AeCEc7lwN4X4cl18Mt3ZwpVG1t3rOa5BkZ',
  //         backend: 'apple-id',
  //         client_secret:
  //           'U4Iq1PAgWRLyGTZUc9mZ5a1vRhFeyLf5SlNoe9GscOERYZuLXBKZnKKu9wF8jBMMuxUn8Xz1Djwqynn3BQxGVechlg2KFHgXq3gYJrmuegawFwnnkc360ydqtUFtQ04P',
  //         token: result?._tokenResponse?.oauthIdToken,
  //       };
  //       this.getConvertToken(body);
  //       // this.navCtrl.navigateForward([APP_HOME_REDIRECT_URL]);
  //     },
  //     (err) => {
  //       console.log('error', err);
  //     }
  //   );
  // }
  signInWithAppleNative() {
    // let options: SignInWithAppleOptions = {
    //   clientId: 'com.supplementsocre.ss.signin',
    //   redirectURI:
    //     'https://supplement-score-ai.firebaseapp.com/__/auth/handler',
    // };
    // SignInWithApple.authorize(options).then(
    //   async (result: any | SignInWithAppleResponse) => {
    //     console.log(result);
    //     const provider = new OAuthProvider('apple.com');
    //     const credential = provider.credential({
    //       idToken: result.response.identityToken,
    //     });
    //     const userCredential = await signInWithCredential(
    //       this.auth,
    //       credential
    //     );
    //     this.setSession(
    //       result?.user?.accessToken,
    //       result?._tokenResponse?.refreshToken
    //     );
    //     console.log(userCredential);
    //   }
    // );
  }

  setSession(accessToken: any, refreshToken: any) {
    this.storage.set(ACCESS_TOKEN_STORAGE_NAME, accessToken);
    this.storage.set(REFRESH_TOKEN_STORAGE_NAME, refreshToken);
    this.navCtrl.navigateForward([APP_HOME_REDIRECT_URL]);
  }

  getConvertToken(body: any) {
    this.convertToken(body).subscribe(
      (data: any) => {
        console.log(data);
        this.setSession(data?.access_token, data?.refresh_token);
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
  googleSignIn() {
    // const provider = new GoogleAuthProvider();
    // provider.addScope('profile');
    // provider.addScope('email');
    // console.log(provider);
    // signInWithPopup(this.auth, provider).then((result: any) => {
    //   console.log(result);
    //   if (result) {
    //     const body = {
    //       grant_type: 'convert_token',
    //       client_id: 'Cgqcx1AeCEc7lwN4X4cl18Mt3ZwpVG1t3rOa5BkZ',
    //       backend: 'google-oauth2',
    //       client_secret:
    //         'U4Iq1PAgWRLyGTZUc9mZ5a1vRhFeyLf5SlNoe9GscOERYZuLXBKZnKKu9wF8jBMMuxUn8Xz1Djwqynn3BQxGVechlg2KFHgXq3gYJrmuegawFwnnkc360ydqtUFtQ04P',
    //       token: result?._tokenResponse?.oauthAccessToken,
    //     };
    //     this.getConvertToken(body);
    //   }
    // });
  }

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
    return this.http
      .post(`${environment.origin}/users/forgot-password/`, body)
      .pipe(
        catchError((error) => {
          // this.alertService.presentErrorAlert(error);
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
