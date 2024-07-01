import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { queryParams } from 'src/app/core/functions/query-params';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  constructor(private http: HttpClient, private alertService: AlertService) {}

  getBrands(data?: any): Observable<any> {
    const params: HttpParams = queryParams(data);
    return this.http
      .get(`${environment.origin}/supplements/brands/by-letter/`, { params })
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  searchBrands(search?: string): Observable<any> {
    return this.http
      .get(
        `${environment.origin}/supplements/brands/by-letter/?query=${search}`
      )
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  getIngredients(data?: any): Observable<any> {
    const params: HttpParams = queryParams(data);

    return this.http
      .get(`${environment.origin}/supplements/ingredients/by-letter/`, {
        params,
      })
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }
  getHighlighted(data?: any): Observable<any> {
    const params: HttpParams = queryParams(data);

    return this.http
      .get(`${environment.origin}/supplements/ingredients/highlighted/`, {
        params,
      })
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  searchIngredients(data?: any): Observable<any> {
    const params: HttpParams = queryParams(data);
    return this.http
      .get(`${environment.origin}/supplements/ingredients/by-letter/`, {
        params,
      })
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }
}
