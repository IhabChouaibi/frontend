import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './app-modal.html',
  styleUrl: './app-modal.scss',
})
export class AppModal {
 @Input() title = '';
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();

  hide() {
    this.close.emit();
  }
}
