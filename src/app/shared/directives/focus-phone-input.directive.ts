import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneInput]',
})
export class FocusPhoneInputDirective {
  constructor(private elementRef: ElementRef) { }

  @HostListener('ngModelChange') modelChanges() {
    if (this.elementRef.nativeElement.value === '+1-__-___-____' || !this.elementRef.nativeElement.value) {
      this.elementRef.nativeElement.parentElement.classList.remove(
        'item-has-value'
      );
    } else {
      this.elementRef.nativeElement.parentElement.classList.add(
        'item-has-value'
      );
    }
  }

  @HostListener('focus') inputFocus() {
    if (!this.elementRef.nativeElement.readOnly) {
      this.elementRef.nativeElement.parentElement.classList.toggle(
        'item-has-focus'
      );
    };
  }

  @HostListener('blur') inputBlur() {
    if (!this.elementRef.nativeElement.readOnly) {
      this.elementRef.nativeElement.parentElement.classList.toggle(
        'item-has-focus'
      );
    };
  }
}
