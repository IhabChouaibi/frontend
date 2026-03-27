import { Component, Input, Optional, Self } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NgControl } from '@angular/forms';

import { getControlErrorMessage } from '../../utils/form-error.utils';

@Component({
  selector: 'app-form-input',
  standalone: false,
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss'
})
export class FormInput implements ControlValueAccessor {
  @Input() name = '';
  @Input() id = '';
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() label = '';

  value = '';
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(@Optional() @Self() private readonly ngControl: NgControl | null) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const nextValue = (event.target as HTMLInputElement).value;
    this.value = nextValue;
    this.onChange(nextValue);
  }

  onBlur(): void {
    this.onTouched();
  }

  get control(): AbstractControl | null {
    return this.ngControl?.control ?? null;
  }

  get inputId(): string {
    return this.id || this.name || this.label.toLowerCase().replace(/\s+/g, '-');
  }

  get errorMessage(): string {
    return getControlErrorMessage(this.control, this.label || this.placeholder || this.name || 'Field');
  }
}
