import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: false,
  templateUrl: './app-table.html',
  styleUrl: './app-table.scss',
})
export class AppTable {
  @Input() columns: string[] = [];
  @Input() data: any[] = [];
  @Output() rowClick = new EventEmitter<any>();
  @ContentChild(TemplateRef) rowTemplate?: TemplateRef<any>;

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }

}
