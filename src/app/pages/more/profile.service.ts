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
export class ProfileService {
  constructor(private http: HttpClient, private alertService: AlertService) {}

  logout(body: any): Observable<any> {
    return this.http.post(`${environment.origin}/users/logout/`, body).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  // DELETE ACCOUNT
  delete(): Observable<any> {
    return this.http.delete(`${environment.origin}/users/me/`).pipe(
      catchError((error) => {
        console.log(error);
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  // Оновлення токена
  refreshToken(): Observable<any> {
    return this.http.get(`${environment.origin}/api/auth/driver/refresh`).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  getProfile(id: any, refresh?: boolean): Observable<any> {
    let options!: { params?: { refreshReq?: boolean } };
    if (refresh) {
      options = {
        params: {
          refreshReq: refresh,
        },
      };
    }
    return this.http
      .get(`${environment.origin}/users/${id}/profile/`, options)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  updateProfile(id: any, data: any): Observable<any> {
    return this.http
      .patch(`${environment.origin}/users/${id}/profile/`, data)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  updatePassword(data: any): Observable<any> {
    return this.http
      .put(`${environment.origin}/users/change-password/`, data)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  sendReport(data: any): Observable<any> {
    return this.http.post(`${environment.origin}/reports/`, data).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }
}
