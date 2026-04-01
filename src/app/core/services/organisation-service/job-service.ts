import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { JobRequestDto } from '../../../models/organisation-service/job-request.dto';
import { JobResponseDto } from '../../../models/organisation-service/job-response.dto';
import { OrganizationService } from './organization.service';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private readonly organizationService: OrganizationService) {}

  addJob(job: JobRequestDto, depId: number): Observable<JobResponseDto> {
    return this.organizationService.createJob(job, depId);
  }

  getJobById(id: number): Observable<JobResponseDto> {
    return this.organizationService.getJobById(id);
  }

  updateJob(id: number, job: JobRequestDto): Observable<JobResponseDto> {
    return this.organizationService.updateJob(id, job);
  }

  deleteJob(id: number): Observable<void> {
    return this.organizationService.deleteJob(id);
  }

  getJobByTitle(title: string): Observable<JobResponseDto> {
    return this.organizationService.getJobByTitle(title);
  }

  addJobToDepartment(jobId: number, departmentId: number): Observable<JobResponseDto> {
    return this.organizationService.assignJobToDepartment(jobId, departmentId);
  }
}
