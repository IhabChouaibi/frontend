import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Job } from '../../../models/organisation-service/job';
import { OrganizationService } from './organization.service';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private readonly organizationService: OrganizationService) {}

  addJob(job: Job, depId: number): Observable<Job> {
    return this.organizationService.createJob(job, depId);
  }

  getJobById(id: number): Observable<Job> {
    return this.organizationService.getJobById(id);
  }

  updateJob(id: number, job: Job): Observable<Job> {
    return this.organizationService.updateJob(id, job);
  }

  deleteJob(id: number): Observable<void> {
    return this.organizationService.deleteJob(id);
  }

  getJobByTitle(title: string): Observable<Job> {
    return this.organizationService.getJobByTitle(title);
  }

  addJobToDepartment(jobId: number, departmentId: number): Observable<Job> {
    return this.organizationService.assignJobToDepartment(jobId, departmentId);
  }
}
