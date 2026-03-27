import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function getFile(control: AbstractControl): File | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  return value instanceof File ? value : null;
}

export function fileExtensionValidator(allowedExtensions: string[]): ValidatorFn {
  const normalizedExtensions = allowedExtensions.map((extension) => extension.toLowerCase());

  return (control: AbstractControl): ValidationErrors | null => {
    const file = getFile(control);

    if (!file) {
      return null;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !normalizedExtensions.includes(extension)) {
      return {
        fileExtension: {
          allowed: normalizedExtensions
        }
      };
    }

    return null;
  };
}

export function fileMaxSizeValidator(maxSize: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = getFile(control);

    if (!file) {
      return null;
    }

    return file.size > maxSize
      ? {
          fileSize: {
            actualSize: file.size,
            maxSize
          }
        }
      : null;
  };
}
