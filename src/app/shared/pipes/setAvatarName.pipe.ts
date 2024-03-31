import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'setAvatarName',
})
export class SetAvatarNamePipe implements PipeTransform {
  transform(value: any): string {
    return (
      (value?.first_name && value?.first_name.charAt(0).toUpperCase()) +
      '' +
      (value?.last_name ? value?.last_name.charAt(0).toUpperCase() : '')
    );
  }
}
