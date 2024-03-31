import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/core/services/alert.service';
import { PhonePipe } from 'src/app/shared/pipes/phone.pipe';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private alertService: AlertService) {}

  login(body: any): Observable<any> {
    return this.http.post(`${environment.origin}/token/`, body).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
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
        this.alertService.presentErrorAlert(error);
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
}
