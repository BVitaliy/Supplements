import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/core/services/alert.service';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  constructor(private http: HttpClient, private alertService: AlertService) {}

  getCategories(refresh?: boolean): Observable<any> {
    let options!: { params?: { refreshReq?: boolean } };
    if (refresh) {
      options = {
        params: {
          refreshReq: refresh,
        },
      };
    }
    return this.http
      .get(`${environment.origin}/supplements/categories/`, options)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  getProducts(id: string, refresh?: boolean): Observable<any> {
    console.log(id);
    let options!: { params?: { refreshReq?: boolean } };
    if (refresh) {
      options = {
        params: {
          refreshReq: refresh,
        },
      };
    }
    return this.http
      .get(`${environment.origin}/supplements/categories/${id}`, options)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  getFiltersRecords(refresh?: boolean): Observable<any> {
    let options!: { params?: { refreshReq?: boolean } };
    if (refresh) {
      options = {
        params: {
          refreshReq: refresh,
        },
      };
    }
    return this.http
      .get(`${environment.origin}/supplements/search-records/`, options)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  requestSupplement(data: any): Observable<any> {
    console.log(data);
    return this.http.post(`${environment.origin}/requests/`, data).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  updateRequestSupplement(data: any): Observable<any> {
    console.log(data);
    return this.http
      .patch(`${environment.origin}/requests/${data?.id}`, data)
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
    return this.http
      .post(
        `${environment.origin}/requests/${id}/images/`,
        data
        // , {
        //   headers: headers,
        // }
      )
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  getProductRequest(id: string, refresh?: boolean): Observable<any> {
    console.log(id);
    let options!: { params?: { refreshReq?: boolean } };
    if (refresh) {
      options = {
        params: {
          refreshReq: refresh,
        },
      };
    }
    return this.http.get(`${environment.origin}/requests/${id}`, options).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  getProductByBarcode(data: any): Observable<any> {
    return this.http.post(`${environment.origin}/requests/scan/`, data).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  getProductById(id: string, refresh?: boolean): Observable<any> {
    console.log(id);
    let options!: { params?: { refreshReq?: boolean } };
    if (refresh) {
      options = {
        params: {
          refreshReq: refresh,
        },
      };
    }
    return this.http
      .get(`${environment.origin}/supplements/${id}`, options)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }
}
