import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[libDateValidator]',
})
export class DateValidatorDirective {
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', '/'];

  constructor() { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    if (!this.isNumericInput(event.key)) {
      event.preventDefault();
    }
  }

  private isNumericInput(key: string): boolean {
    return /^\d$/.test(key);
  }

}
