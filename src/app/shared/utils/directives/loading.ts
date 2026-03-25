import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLoading]',
  standalone: false
})
export class Loading {

 @Input('appLoading') loading = false;

  constructor(private el: ElementRef,
     private renderer: Renderer2) {}

  ngOnChanges() {
    if (this.loading) {
      this.renderer.setProperty(this.el.nativeElement, 'disabled', true);
      this.renderer.setAttribute(this.el.nativeElement, 'data-loading', 'true');
    } else {
      this.renderer.removeAttribute(this.el.nativeElement, 'data-loading');
      this.renderer.setProperty(this.el.nativeElement, 'disabled', false);
    }
  }
}
