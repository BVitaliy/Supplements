import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlertService } from 'src/app/core/services/alert.service';
import { queryParams } from 'src/app/core/functions/query-params';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  constructor(private http: HttpClient, private alertService: AlertService) {}

  getCategories(data?: any): Observable<any> {
    const params: HttpParams = queryParams(data);
    return this.http
      .get(`${environment.origin}/supplements/categories/?limit=500`, {
        params,
      })
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

  getFiltersRecords(data?: any): Observable<any> {
    const params: HttpParams = queryParams(data);
    return this.http
      .get(`${environment.origin}/supplements/search-records/`, { params })
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
      .patch(`${environment.origin}/requests/${data?.id}/`, data)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(
            'Something went wrong! Please try again'
          );
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
    return this.http
      .post(`${environment.origin}/requests/scan/`, data)
      .pipe
      // catchError((error) => {
      //   this.alertService.presentErrorAlert(error);
      //   return throwError(error);
      // })
      ();
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

  // Function to clean the object
  cleanObject(obj: any): any {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (
          obj[key] === null ||
          (Array.isArray(obj[key]) && obj[key].length === 0)
        ) {
          delete obj[key];
        }
      }
    }
    return obj;
  }

  searchProduct(data: any, parameters?: any): Observable<any> {
    const params: HttpParams = queryParams(parameters);
    const values = this.cleanObject(data);
    return this.http
      .post(`${environment.origin}/supplements/search/`, values, { params })
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  searchIngredient(data: any): Observable<any> {
    const params: HttpParams = queryParams(data);
    return this.http
      .get(`${environment.origin}/supplements/ingredients/`, { params })
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  getProductReviewById(id: string, refresh?: boolean): Observable<any> {
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
      .get(`${environment.origin}/supplements/${id}/reviews/`, options)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  getHistory(data?: any): Observable<any> {
    const params: HttpParams = queryParams(data);
    return this.http
      .get(`${environment.origin}/supplements/history/`, { params })
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  sortProduct(data?: any): Observable<any> {
    const params: HttpParams = queryParams(data);
    return this.http.get(`${environment.origin}/supplements/`, { params }).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }
  getTopRated(data?: any): Observable<any> {
    const params: HttpParams = queryParams(data);
    return this.http
      .get(`${environment.origin}/supplements/trending/`, { params })
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  setToHistory(id?: any): Observable<any> {
    return this.http
      .post(`${environment.origin}/supplements/${id}/viewed/`, {})
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  getBrandsProduct(data?: any, id?: any): Observable<any> {
    const params: HttpParams = queryParams(data);
    return this.http
      .get(`${environment.origin}/supplements/brands/${id}`, { params })
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  getProductAnalysis(id?: any): Observable<any> {
    return this.http
      .get(`${environment.origin}/supplements/${id}/ingredients/analisis/`, {})
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  getForYouProduct(data?: any): Observable<any> {
    const params: HttpParams = queryParams(data);
    return this.http
      .get(`${environment.origin}/supplements/for-you/`, { params })
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  switchHighlightedIng(id?: any): Observable<any> {
    return this.http
      .post(
        `${environment.origin}/supplements/ingredients/${id}/highlighted/`,
        {}
      )
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }

  clearHistory(): Observable<any> {
    return this.http
      .delete(`${environment.origin}/supplements/search-records/`)
      .pipe(
        catchError((error) => {
          this.alertService.presentErrorAlert(error);
          return throwError(error);
        })
      );
  }
}
