import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './app-button.html',
  styleUrl: './app-button.scss',
})
export class AppButton {
  @Input() loading = false;        // pour état chargement
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;

}
