import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'phone',
})
export class PhonePipe implements PipeTransform {
  /******************* VARIANT 3 (Universal, Level God) *******************/
  // using {{PhoneFromBackend | phone: true}} result 0961234567 for [href]="customer?.phone ? 'tel:'+(customer?.phone | phone: true) : null"
  // using {{PhoneFromBackend | phone: false : '+38 (___) __ __ ___' }}
  // result +38 (096) 12 34 567 for display in template with format what you wish
  // https://i.imgur.com/JEFJC04.png

  transform(phoneValue: string, trimmed?: boolean, format?: any): any {
    let newPhone = '';
    if (phoneValue) {
      if (trimmed) {
        newPhone = phoneValue.replace(/\+|\(|\)|-|_|\*|\s/g, '').slice(-10); // -11
      } else {
        newPhone = this.beautifyPhone(format, phoneValue.replace(/\+|\(|\)|-|_|\*|\s/g, '').slice(-10));
      }
    }
    return newPhone;
  }

  beautifyPhone(format: string, value: string): string {
    while (value.length < 10) {
      value = '0' + value;
    }
    value.split('').forEach(element => {
      format = format.replace(/_/, element);
    });
    return format;
  }

}
