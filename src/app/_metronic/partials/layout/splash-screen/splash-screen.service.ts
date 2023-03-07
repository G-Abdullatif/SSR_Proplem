import { ElementRef, Injectable } from '@angular/core';
import { animate, AnimationBuilder, style } from '@angular/animations';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SplashScreenService {
  // Private properties
  private el: ElementRef;
  private stopped: boolean;

  private _iSLoginSplash$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  get iSLoginSplash() {
    return this._iSLoginSplash$.asObservable();
  }

  /**
   * Service constructor
   *
   * @param animationBuilder: AnimationBuilder
   */
  constructor(private animationBuilder: AnimationBuilder) {}

  /**
   * Init
   *
   * @param element: ElementRef
   */
  init(element: ElementRef) {
    this.el = element;
  }

  /**
   * Hide
   */
  hide() {
    if (this.stopped || !this.el) {
      return;
    }

    const player = this.animationBuilder
      .build([style({ opacity: '1' }), animate(800, style({ opacity: '0' }))])
      .create(this.el.nativeElement);

    player.onDone(() => {
      if (typeof this.el.nativeElement.remove === 'function') {
        this.el.nativeElement.remove();
      } else {
        this.el.nativeElement.style.display = 'none !important';
      }
      this.stopped = true;
    });

    setTimeout(() => player.play(), 100);
  }

  /**
   * toggle
   */
  toggle(value: boolean) {
    this._iSLoginSplash$.next(value);
  }
}
