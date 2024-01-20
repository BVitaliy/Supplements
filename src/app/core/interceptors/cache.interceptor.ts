import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, any>();

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (req.url.includes('/logout')) {
      this.cache.clear();
    }

    // Вставляти сюди роути які мають кешуватися
    if (
      // !req.url.includes('/getOrders') &&
      // !req.url.includes('/getOrder/') &&
      // !req.url.includes('/getDriverInfo')
      true
    ) {
      return next.handle(req);
    }

    // Вставляти сюди методи роутів які мають кешуватися
    if (req.method !== 'GET' && req.method !== 'POST') {
      return next.handle(req);
    }

    const currentTime = new Date().getTime();
    const cacheUrl = req.urlWithParams;
    if (cacheUrl.includes('refreshReq=true')) {
      this.cache.delete(cacheUrl.replace(/\?refreshReq=true|&refreshReq=true/, ''));
    }
    const cachedResponse = this.cache.get(cacheUrl);

    if (cachedResponse?.data && cachedResponse?.expire > currentTime) {
      return of(cachedResponse.data); // .pipe(delay(5000))
    }

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const d = new Date();
          const newCacheUrl = cacheUrl.includes('refreshReq=true') ? cacheUrl.replace(/\?refreshReq=true|&refreshReq=true/, '') : cacheUrl;
          d.setHours(d.getHours() + 1);
          this.cache.set(newCacheUrl, {
            expire: d.getTime(),
            data: event
          });
          console.log(this.cache);
        }
      })
    );
  }
}
