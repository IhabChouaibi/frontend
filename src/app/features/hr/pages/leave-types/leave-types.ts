import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { LeaveTypeService } from '../../../../core/services/leave-service/leave-type-service';
import { LeaveType } from '../../../../models/leave-service/leave-type';

@Component({
  selector: 'app-leave-types',
  standalone: false,
  templateUrl: './leave-types.html',
  styleUrl: './leave-types.scss',
})
export class LeaveTypes {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    paid: ['YES', Validators.required],
    requiresApproval: ['YES', Validators.required],
    requiresDocument: ['NO', Validators.required],
    maxDaysPerYear: [20, [Validators.required, Validators.min(1)]]
  });

  leaveTypes: LeaveType[] = [];
  showModal = false;
  selectedId: number | null = null;
  loading = false;
  saving = false;
  error = '';

  constructor(private readonly leaveTypeService: LeaveTypeService) {}

  ngOnInit(): void {
    this.load();
  }

  openCreate(): void {
    this.selectedId = null;
    this.form.reset({
      paid: 'YES',
      requiresApproval: 'YES',
      requiresDocument: 'NO',
      maxDaysPerYear: 20
    });
    this.showModal = true;
  }

  openEdit(item: LeaveType): void {
    this.selectedId = item.id || null;
    this.form.patchValue(item);
    this.showModal = true;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';

    const payload = this.form.getRawValue() as LeaveType;
    const request$ = this.selectedId
      ? this.leaveTypeService.update(this.selectedId, payload)
      : this.leaveTypeService.create(payload);

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.showModal = false;
        this.load();
      },
      error: (error: Error) => {
        this.error = error.message;
        this.saving = false;
      }
    });
  }

  delete(item: LeaveType): void {
    if (!item.id) {
      return;
    }

    this.leaveTypeService.deleteById(item.id).subscribe({
      next: () => this.load(),
      error: (error: Error) => {
        this.error = error.message;
      }
    });
  }

  private load(): void {
    this.loading = true;
    this.error = '';

    this.leaveTypeService.findByPage(0, 50).subscribe({
      next: (res) => {
        this.leaveTypes = res.content;
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}
