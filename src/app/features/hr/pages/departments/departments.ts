import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Department} from '../../../../models/organisation-service/department';
import {DepartmentService} from '../../../../core/services/organisation-service/department-service';
@Component({
  selector: 'app-departments',
  standalone: false,
  templateUrl: './departments.html',
  styleUrl: './departments.scss',
})
export class Departments {

  departments: Department[] = [];
  loading = false;
  error: string | null = null;

  page = 0;
  size = 10;
  totalPages = 0;

  showModal = false;
  form!: FormGroup;
  selectedId: number | null = null;

  constructor(
    private departmentService: DepartmentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
    });
  }

  loadDepartments() {
    this.loading = true;
    this.departmentService.getAllDepartmentsPaged(this.page, this.size)
      .subscribe({
        next: (res) => {
          this.departments = res.content;
          this.totalPages = res.totalPages;
          this.loading = false;
        },
        error: () => {
          this.error = 'Erreur chargement departments';
          this.loading = false;
        }
      });
  }

  openCreate() {
    this.selectedId = null;
    this.form.reset();
    this.showModal = true;
  }

  openEdit(dep: Department) {
    this.selectedId = dep.id!;
    this.form.patchValue(dep);
    this.showModal = true;
  }

  submit() {
    if (this.form.invalid) return;

    const data = this.form.value;

    if (this.selectedId) {
      this.departmentService.updateDepartment(this.selectedId, data)
        .subscribe(() => {
          this.afterSave();
        });
    } else {
      this.departmentService.addDepartment(data)
        .subscribe(() => {
          this.afterSave();
        });
    }
  }

  afterSave() {
    this.showModal = false;
    this.loadDepartments();
  }

  delete(id: number) {
    if (!confirm('Delete department ?')) return;

    this.departmentService.deleteDepartment(id)
      .subscribe(() => this.loadDepartments());
  }

  changePage(p: number) {
    this.page = p;
    this.loadDepartments();
  }

}
