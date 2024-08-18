import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/core/services/alert.service';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  constructor(private http: HttpClient, private alertService: AlertService) {}

  getFavorites(refresh?: boolean): Observable<any> {
    let options!: { params?: { refreshReq?: boolean } };
    if (refresh) {
      options = {
        params: {
          refreshReq: refresh,
        },
      };
    }
    return this.http.get(`${environment.origin}/favorite-lists/`, options).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  getFavoritesDetail(id: string, refresh?: boolean): Observable<any> {
    let options!: { params?: { refreshReq?: boolean } };
    if (refresh) {
      options = {
        params: {
          refreshReq: refresh,
        },
      };
    }
    return this.http
      .get(`${environment.origin}/favorite-lists/${id}`, options)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  updateFavoritesDetail(id: string, data: any): Observable<any> {
    return this.http
      .patch(`${environment.origin}/favorite-lists/${id}/`, data)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  createFavList(data: any): Observable<any> {
    return this.http.post(`${environment.origin}/favorite-lists/`, data).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  deleteList(id: string): Observable<any> {
    return this.http.delete(`${environment.origin}/favorite-lists/${id}`).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  deleteProductFromFavList(id: string): Observable<any> {
    return this.http
      .delete(`${environment.origin}/favorite-lists/products/${id}`)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  setProductToFavList(data: any, id: any): Observable<any> {
    return this.http
      .post(`${environment.origin}/favorite-lists/${id}/data/`, data)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }
}
