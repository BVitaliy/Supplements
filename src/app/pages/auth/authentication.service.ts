import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/core/services/alert.service';
import { PhonePipe } from 'src/app/shared/pipes/phone.pipe';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private alertService: AlertService) { }

  // Вхід
  login(body: any): Observable<any> {
    return this.http.post(`${environment.origin}/api/auth/driver/login`, body).pipe(
      catchError((error) => {
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

  // Додавання користувача до другого акаунту OneSignal для VoIP сповіщень
  addVoIPDevice(body: any): Observable<any> {
    return this.http.post(`${environment.origin}/api/driver/chat/addVoIPDevice`, body).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  // Відновлення паролю
  recoverPassword(body: any): Observable<any> {
    return this.http.post(`${environment.origin}/auth/recoverPassword`, body).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  // Перевірка валідності коду
  checkCode(body: any): Observable<any> {
    return this.http.post(`${environment.origin}/auth/checkCode`, body).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  // Створення нового паролю
  setNewPassword(body: any): Observable<any> {
    return this.http.post(`${environment.origin}/auth/setNewPassword`, body).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  // Витяжка водія
  getUser(refresh?: boolean): Observable<any> {
    let options!: {params?: {refreshReq?: boolean}};
    if (refresh) {
      options = {
        params: {
          refreshReq: refresh,
        }
      };
    }

    return this.http.get(`${environment.origin}/api/driver/cabinet/getDriverInfo`, options).pipe(
      // map((response: any) => {
      //   if (response.phone_numbers?.length) {
      //     response.phone_numbers.forEach((number: any) => {
      //       new PhonePipe().transform(number.phone, true);
      //     });
      //   }
      //   return response;
      // }),
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  // Зміна водія
  saveUser(body: any): Observable<any> {
    if (body?.phone_numbers?.length) {
      body.phone_numbers.forEach((number: any) => {
        number.phone = new PhonePipe().transform(number.phone, false, '+1-___-___-____');
      });
      body.phone = body?.phone_numbers[0];
    }
    return this.http.post(`${environment.origin}/api/driver/cabinet/makeCallToUpdateDriver`, body).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  // Зміна паролю водія
  changePassword(body: any): Observable<any> {
    return this.http.post(`${environment.origin}/api/auth/driver/changePassword`, body).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  // Вихід
  logOut(): Observable<any> {
    return this.http.get(`${environment.origin}/api/auth/driver/logout`).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  // // Видалення акаунту
  // deleteAccount(): Observable<any> {
  //   return this.http.post(`${environment.origin}/api/auth/driver/deleteAccount`, {}).pipe(
  //     catchError((error) => {
  //       this.alertService.presentErrorAlert(error);
  //       return throwError(error);
  //     })
  //   );
  // }
}
