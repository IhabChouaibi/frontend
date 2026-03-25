import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LeaveType} from '../../../../models/leave-service/leave-type';
import {LeaveRequestService} from '../../../../core/services/leave-service/leave-request-service';
import {LeaveTypeService} from '../../../../core/services/leave-service/leave-type-service';

@Component({
  selector: 'app-leave-request',
  standalone: false,
  templateUrl: './leave-request.html',
  styleUrl: './leave-request.scss',
})
export class LeaveRequest implements OnInit {
  form!: FormGroup;
  leaveTypes: LeaveType[] = [];

  loading = false;
  success = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveRequestService,
    private leaveTypeService: LeaveTypeService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadLeaveTypes();
  }

  initForm() {
    this.form = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      leaveTypeId: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  loadLeaveTypes() {
    this.leaveTypeService.findByPage(0, 50)
      .subscribe(res => this.leaveTypes = res.content);
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    const leave = {
      ...this.form.value,
      employeeId: 1 // 🔥 temporaire (remplacer par AuthService)
    };

    this.leaveService.submitLeaveRequest(leave)
      .subscribe({
        next: () => {
          this.success = 'Leave request submitted';
          this.form.reset();
          this.loading = false;
        },
        error: () => {
          this.error = 'Error submitting request';
          this.loading = false;
        }
      });
  }

}
