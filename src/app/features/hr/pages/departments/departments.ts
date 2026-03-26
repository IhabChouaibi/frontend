import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { DepartmentService } from '../../../../core/services/organisation-service/department-service';
import { Department } from '../../../../models/organisation-service/department';

@Component({
  selector: 'app-departments',
  standalone: false,
  templateUrl: './departments.html',
  styleUrl: './departments.scss',
})
export class Departments {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required]
  });

  departments: Department[] = [];
  loading = false;
  error = '';
  showModal = false;
  page = 0;
  totalPages = 0;
  selectedId: number | null = null;

  constructor(
    private readonly departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  openCreate(): void {
    this.selectedId = null;
    this.form.reset();
    this.showModal = true;
  }

  openEdit(item: Department): void {
    this.selectedId = item.id || null;
    this.form.patchValue(item);
    this.showModal = true;
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const request$ = this.selectedId
      ? this.departmentService.updateDepartment(this.selectedId, this.form.getRawValue() as Department)
      : this.departmentService.addDepartment(this.form.getRawValue() as Department);

    request$.subscribe({
      next: () => {
        this.showModal = false;
        this.load();
      },
      error: (error: Error) => this.error = error.message
    });
  }

  delete(item: Department): void {
    if (!item.id) {
      return;
    }

    this.departmentService.deleteDepartment(item.id).subscribe({
      next: () => this.load(),
      error: (error: Error) => this.error = error.message
    });
  }

  changePage(step: number): void {
    const nextPage = this.page + step;

    if (nextPage < 0 || nextPage >= this.totalPages) {
      return;
    }

    this.page = nextPage;
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.departmentService.getAllDepartmentsPaged(this.page, 10).subscribe({
      next: (res) => {
        this.departments = res.content;
        this.totalPages = res.totalPages;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}
