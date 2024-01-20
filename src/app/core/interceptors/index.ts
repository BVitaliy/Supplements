import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppInterceptor } from './app.interceptor';
import { CacheInterceptor } from './cache.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
];
