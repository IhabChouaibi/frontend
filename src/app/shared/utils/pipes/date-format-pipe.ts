import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: false
})
export class DateFormatPipe implements PipeTransform {
 transform(value: string | Date, format = 'dd/MM/yyyy'): string {
    if (!value) return '';
    return formatDate(value, format, 'en-US');
  }

}
