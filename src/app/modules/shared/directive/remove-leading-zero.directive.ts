import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appRemoveLeadingZero]'
})
export class RemoveLeadingZeroDirective {
  @Input() ngModel: string;

  constructor(private el: ElementRef) {
  }

  @HostListener('ngModelChange')
  onChange() {
      if (this.el.nativeElement.value[0] === '0' || this.el.nativeElement.value === '0') {
        (this.el.nativeElement as HTMLInputElement).value = this.el.nativeElement.value.substring(1);
      }
  }

}
