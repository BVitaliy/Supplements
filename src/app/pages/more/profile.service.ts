import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';
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
    let headers = new HttpHeaders();
    // headers = headers.set('Accept', 'application/json');
    headers = headers.set('Content-Type', 'multipart/form-data; boundary=--');
    return this.http
      .patch(`${environment.origin}/users/${id}/profile/`, data, {
        headers: headers,
      })
      .pipe(
        catchError((error) => {
          // this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  updatePassword(data: any): Observable<any> {
    return this.http
      .put(`${environment.origin}/users/change-password/`, data)
      .pipe(
        catchError((error) => {
          // this.alertService.presentErrorAlert(error);
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

  getSubProducts(status: number, refresh?: boolean): Observable<any> {
    let options!: { params?: { refreshReq?: boolean } };
    if (refresh) {
      options = {
        params: {
          refreshReq: refresh,
        },
      };
    }
    return this.http
      .get(`${environment.origin}/requests/?status=${status}`, options)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  getPolicy(): Observable<any> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'text/html');
    return this.http
      .get(`${environment.origin}/privacy-policy/`, { headers: headers })
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }
  getTerms(): Observable<any> {
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'text/html');
    return this.http
      .get(`${environment.origin}/terms-of-use/`, { headers: headers })
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  getNotifications(): Observable<any> {
    return this.http.get(`${environment.origin}/notifications/settings/`).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  setNotifications(data: any): Observable<any> {
    return this.http
      .patch(`${environment.origin}/notifications/settings/`, data)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  uploadImage(id: any, data: any): Observable<any> {
    // let headers = new HttpHeaders();
    // headers = headers.set('Accept', 'application/json');
    // headers = headers.set('Content-Type', 'multipart/form-data; boundary=--');
    return this.http.post(
      `${environment.origin}/reports/${id}/images/`,
      data
      // , {
      //   headers: headers,
      // }
    );
    // .pipe(
    //   catchError((error) => {
    //     // this.alertService.presentErrorAlert(error);
    //     // return throwError(error);
    //   })
    // );
  }
}
