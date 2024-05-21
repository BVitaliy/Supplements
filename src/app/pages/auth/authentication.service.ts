import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private alertService: AlertService,
    private storage: Storage,
    private platform: Platform , //private authFire: Auth
  ) {
    this.isWeb = !(this.platform.is('android') || this.platform.is('ios'));
  }


  async loginViaApple(){
    const result = await FirebaseAuthentication.signInWithApple({scopes:['displayName', 'email']}) 
    console.log(result)
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

  async loginViaGoogle(){
    console.log('google')
    const result = await FirebaseAuthentication.signInWithGoogle({scopes:["profile", "email"],mode:'popup'});
    // this.socialLoginData(result);
    console.log(result);
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
    this.signInLoading = true;
    // let options: SignInWithAppleOptions = {
    //   clientId: 'com.supplementsocre.ss.signin',
    //   redirectURI:
    //     'https://supplement-score-ai.firebaseapp.com/__/auth/handler',
    //     scopes: 'email',
    //     state:'12345'
    // };
    // SignInWithApple.authorize(options).then(
    //   async (result: any | SignInWithAppleResponse) => {
    //     console.log(result);

    //     if (result) {
    //       const body = {
    //         grant_type: 'convert_token',
    //         client_id: 'j0sqWImKXkbDW1e7SLjxgTFcEGZoreXRYJ3gB4ZI',
    //         backend: 'apple-id',
    //         client_secret:
    //           'bfx11gJt0Y5WL0Uqt2ZjFbjbhVOi97RuZbDptkLFG5ENSPO4NtVZl2m1qbCkrHKU0dPmAGp2SLHq3OGsfSmWtVYFMH8QYcihyYWmE36dyXmKtMmCEg7KVCKSWxEtdEof',
    //         token: result?.response?.identityToken,
    //       };
    //       this.getConvertToken(body);    
    //     }    
    //     const provider = new OAuthProvider('apple.com');
    //     const credential = provider.credential({
    //       idToken: result.response.identityToken,
    //     });
    //     // const user = getAdditionalUserInfo(credential)
    //     // const auth = getAuth();
    //     // console.log(auth)
    //     // const userCredential = await this.signInWithAppleNative(
    //     //   auth,
    //     //   credential
    //     // );
    //     // this.setSession(
    //     //   result?.user?.accessToken,
    //     //   result?._tokenResponse?.refreshToken
    //     // );
    //     // console.log(userCredential);
    //   }
    // );
  }
  // {"response":
  // {"email":null,
  // "identityToken":"eyJraWQiOiJCaDZIN3JIVm1iIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiY29tLnN1cHBsZW1lbnRzb2NyZS5zcyIsImV4cCI6MTcxNTg0MjA2OSwiaWF0IjoxNzE1NzU1NjY5LCJzdWIiOiIwMDE0NjQuZGRmMjcxN2RmNDllNGE2NGEwMzNlNWM2MThkMGMyMDAuMDY0NyIsImNfaGFzaCI6Iks0OXU1NXdOWGpTUF9pcnFLNVNTeEEiLCJhdXRoX3RpbWUiOjE3MTU3NTU2NjksIm5vbmNlX3N1cHBvcnRlZCI6dHJ1ZSwicmVhbF91c2VyX3N0YXR1cyI6Mn0.ptejLCQhQ7Fcc4vHE10dS9xpUI6My00YmFk8zAZUujuzcQSVmwkF7bXNm4gnJmPT7sRoPaWWS2ch1vqsWH-mgsXDuu3VQaGz4mHgqN9nbg71r_xCvacZ1g__ISTD14zs3e_6SjdBO4RApI5azeMVJ7VS9GoZ_-DQCv-HDZcdKAPcZ7063_PBSADOSaFbR8HBkgsFos02J9Qeh139V31GeUjhbPtxfh2fcGknGa-KoO8Y-HyD-y3jfX3gIhgrytJbgsDEmuejdJ-L0XfcETZ0axZYHiovIwG3IbwquPF87RnyJpZiTDW_gtvDk_4YA1931f6X8gIU31i7lYXHpGrzlQ",
  // "authorizationCode":"c3eff0f52111b4707aaca89476b672153.0.pruwu.Gjef9xCUBDeQCCV95kOMAg","givenName":null,"user":"001464.ddf2717df49e4a64a033e5c618d0c200.0647","familyName":null}}
  setSession(accessToken: any, refreshToken: any) {
    this.storage.set(ACCESS_TOKEN_STORAGE_NAME, accessToken);
    this.storage.set(REFRESH_TOKEN_STORAGE_NAME, refreshToken);
    this.navCtrl.navigateForward([APP_HOME_REDIRECT_URL]);
  }

  getConvertToken(body: any) {
    console.log(body)
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
  async googleSignIn() {
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
    }
  }

  logOut() {
    GoogleAuth.signOut();
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
