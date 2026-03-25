import { Component } from '@angular/core';
import {Job} from '../../../../models/organisation-service/job';
import {Department} from '../../../../models/organisation-service/department';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {JobService} from '../../../../core/services/organisation-service/job-service';
import {DepartmentService} from '../../../../core/services/organisation-service/department-service';

@Component({
  selector: 'app-jobs',
  standalone: false,
  templateUrl: './jobs.html',
  styleUrl: './jobs.scss',
})
export class Jobs {
  jobs: Job[] = [];
  departments: Department[] = [];

  form!: FormGroup;
  showModal = false;

  constructor(
    private jobService: JobService,
    private depService: DepartmentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDepartments();
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      departmentId: ['', Validators.required]
    });
  }

  loadDepartments() {
    this.depService.getAllDepartmentsPaged(0, 100)
      .subscribe(res => this.departments = res.content);
  }

  submit() {
    const job = { title: this.form.value.title };

    this.jobService.addJob(job as Job, this.form.value.departmentId)
      .subscribe(() => {
        this.showModal = false;
      });
  }

}
