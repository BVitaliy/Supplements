import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(html: string, url?: boolean) {
    if (url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(html);
    } else {
      return this.sanitizer.bypassSecurityTrustHtml(html);
    }
  }

}
