import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) { }

  // Витяжка статусів для ордеру
  getStatuses(): any {
    return {
      // all: { text: 'All' },
      1: {text: 'Deleted', background: 'var(--ion-color-danger)'},
      2: {text: 'New', background: 'var(--ion-color-primary)'},
      3: {text: 'Delivered', background: 'var(--ion-color-success)'},
      4: {text: 'Picked Up', background: 'var(--ion-color-warning)'},
      5: {text: 'Canceled', background: 'var(--ion-color-danger)'},
    };
  }

  // Витяжка ордерів
  getOrders(filters: any, refresh?: boolean): Observable<any> {
    filters.dateFrom = filters.dateFrom ? this.datePipe.transform(new Date(filters.dateFrom), 'yyyy-MM-dd') + 'T00:00:00.000Z' : null;
    filters.dateTo = filters.dateTo ? this.datePipe.transform(new Date(filters.dateTo), 'yyyy-MM-dd') + 'T23:59:59.000Z' : null;
    filters.pickupFrom = filters.pickupFrom ? this.datePipe.transform(new Date(filters.pickupFrom), 'yyyy-MM-dd') + 'T00:00:00.000Z' : null;
    filters.pickupTo = filters.pickupTo ? this.datePipe.transform(new Date(filters.pickupTo), 'yyyy-MM-dd') + 'T23:59:59.000Z' : null;
    filters.deliveryFrom = filters.deliveryFrom ? this.datePipe.transform(new Date(filters.deliveryFrom), 'yyyy-MM-dd') + 'T00:00:00.000Z' : null;
    filters.deliveryTo = filters.deliveryTo ? this.datePipe.transform(new Date(filters.deliveryTo), 'yyyy-MM-dd') + 'T23:59:59.000Z' : null;
    let options!: {params?: {refreshReq?: boolean}};
    if (refresh) {
      options = {
        params: {
          refreshReq: refresh,
        }
      };
    }
    return this.http.post(`${environment.origin}/api/driver/order/getOrders`, filters, options).pipe(
      catchError((error) => {
        this.alertService.presentErrorAlert(error);
        return throwError(error);
      })
    );
  }

  // Зміна статусу ордеру
  // changeOrderStatus(body: any): Observable<any> {
  //   return this.http.post(`${environment.origin}/api/driver/order/changeOrderStatus`, body).pipe(
  //     catchError((error) => {
  //       this.alertService.presentErrorAlert(error);
  //       return throwError(error);
  //     })
  //   );
  // }
}
