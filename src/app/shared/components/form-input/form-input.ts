import { Component, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: false,
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})
export class FormInput {
  @Input() name! :string ;
    @Input() placeholder = '';
  @Input() type = 'text';

}
