import { HttpParams } from '@angular/common/http';

export function queryParams(data: any) {
  let params = new HttpParams();
  for (const key in data) {
    if (
      data.hasOwnProperty(key) &&
      data[key] !== null &&
      data[key] !== undefined
    ) {
      params = params.append(key, data[key]);
    }
  }
  return params;
}
