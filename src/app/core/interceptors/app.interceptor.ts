import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {
  catchError,
  filter,
  finalize,
  mergeMap,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { from, Observable, Subject, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import {
  ACCESS_TOKEN_STORAGE_NAME,
  APP_AUTH_REDIRECT_URL,
  REFRESH_TOKEN_STORAGE_NAME,
  USER_ID_STORAGE_NAME,
  USER_STORAGE_NAME,
} from 'src/app/app.config';

import { AuthenticationService } from 'src/app/pages/auth/authentication.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  private requestUrl = '';
  private isRefreshing = false;
  private refreshToken$: Subject<any> = new Subject<any>();
  private destroyed$: Subject<void> = new Subject<void>();
  refreshToken = '';

  constructor(
    private navCtrl: NavController,
    private storage: Storage,
    private authenticationService: AuthenticationService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const promise = this.storage.get(ACCESS_TOKEN_STORAGE_NAME);
    this.storage.get(REFRESH_TOKEN_STORAGE_NAME).then((refresh) => {
      if (refresh) {
        this.refreshToken = refresh;
      }
    });
    return from(promise).pipe(
      mergeMap((token) => {
        let clonedReq = this.addToken(request, token);
        console.log(request);
        clonedReq = request.clone({
          setHeaders: {
            Authorization: clonedReq.headers.get('Authorization')
              ? '' + clonedReq.headers.get('Authorization')
              : '',
          },
          url: this.requestUrl,
        });

        return next.handle(clonedReq).pipe(
          tap(async (event) => {
            if (event instanceof HttpResponse) {
              const tokenId = event.headers.get('Authorization');
              if (tokenId) {
                await this.storage.set(
                  ACCESS_TOKEN_STORAGE_NAME,
                  event.headers.get('Authorization')
                );
              }
            }
          }),
          catchError((err: any) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 0) {
                window.addEventListener('online', () => {
                  // location.reload();
                  location.replace('/home');
                });
                return throwError(err);
              } else if (err.status === 401) {
                console.log(this.isRefreshing);
                if (!this.isRefreshing) {
                  this.isRefreshing = true;
                  this.refreshToken$.next(null);
                  console.log(this.isRefreshing);
                  return this.authenticationService
                    .refreshToken({ refresh: this.refreshToken })
                    .pipe(
                      switchMap((response: any) => {
                        const new_token = response.access;
                        this.storage
                          .set(ACCESS_TOKEN_STORAGE_NAME, new_token)
                          .then(() => {
                            this.refreshToken$.next(new_token);
                          });
                        this.storage.set(
                          REFRESH_TOKEN_STORAGE_NAME,
                          response.refresh
                        );
                        return next.handle(this.addToken(request, new_token));
                      }),
                      finalize(() => {
                        this.isRefreshing = false;
                      })
                    );
                } else {
                  console.log(request.url);
                  if (request.url?.includes('/token/refresh')) {
                    this.destroyed$.next();
                    this.storage.remove(ACCESS_TOKEN_STORAGE_NAME);
                    this.storage.remove(REFRESH_TOKEN_STORAGE_NAME);
                    this.storage.remove(USER_ID_STORAGE_NAME);
                    this.storage.remove(USER_STORAGE_NAME);

                    this.navCtrl.navigateRoot([APP_AUTH_REDIRECT_URL]);
                    return throwError(err);
                  }

                  return this.refreshToken$.pipe(
                    takeUntil(this.destroyed$),
                    filter((new_token: string) => new_token !== null),
                    take(1),
                    switchMap((new_token: string) =>
                      next.handle(this.addToken(request, new_token))
                    )
                  );
                }
              }
            }
            return throwError(err);
          })
        );
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: any) {
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: token.includes('Bearer') ? token : 'Bearer ' + token,
        },
      });
    }
    return request;
  }
}
