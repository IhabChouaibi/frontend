import { AbstractControl } from '@angular/forms';

export function getControlErrorMessage(control: AbstractControl | null, label: string): string {
  if (!control || !control.errors || !(control.touched || control.dirty)) {
    return '';
  }

  if (control.errors['required']) {
    return `${label} is required.`;
  }

  if (control.errors['email']) {
    return 'Please enter a valid email address.';
  }

  if (control.errors['minlength']) {
    const requiredLength = control.errors['minlength'].requiredLength;
    return `${label} must contain at least ${requiredLength} characters.`;
  }

  if (control.errors['maxlength']) {
    const requiredLength = control.errors['maxlength'].requiredLength;
    return `${label} must contain at most ${requiredLength} characters.`;
  }

  if (control.errors['pattern']) {
    return `${label} format is invalid.`;
  }

  if (control.errors['min']) {
    return `${label} must be greater than or equal to ${control.errors['min'].min}.`;
  }

  if (control.errors['futureDate']) {
    return `${label} must be in the future.`;
  }

  if (control.errors['dateRange']) {
    return 'End date must be after start date.';
  }

  if (control.errors['fileExtension']) {
    return `Allowed formats: ${control.errors['fileExtension'].allowed.join(', ')}.`;
  }

  if (control.errors['fileSize']) {
    const maxSizeInMb = Math.round((control.errors['fileSize'].maxSize / (1024 * 1024)) * 10) / 10;
    return `${label} must be smaller than ${maxSizeInMb} MB.`;
  }

  return `${label} is invalid.`;
}
