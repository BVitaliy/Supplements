import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'patchImage',
})
export class PatchImagePipe implements PipeTransform {
  transform(value: any, access: string): string {
    if (value) {
      return (
        environment.origin +
        (access ? '/' + access : '') +
        (value?.type ? '/' + value?.type + '/original' : '') +
        (value?.filename ? '/' + value?.filename : '')
      );
    } else {
      return '';
    }
  }
}
