import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import {
  buildHttpParams,
  buildPageParams,
  createApiErrorHandler,
  debugApiRequest,
  normalizePagedResponse,
} from '../../http/api.utils';
import { DepartmentRequestDto } from '../../../models/organisation-service/department-request.dto';
import { DepartmentResponseDto } from '../../../models/organisation-service/department-response.dto';
import { JobRequestDto } from '../../../models/organisation-service/job-request.dto';
import { JobResponseDto } from '../../../models/organisation-service/job-response.dto';
import { OrganizationOverview } from '../../../models/organisation-service/organization-overview';
import { OrganizationQueryParams } from '../../../models/organisation-service/organization-query-params';
import { PagedResponse } from '../../../models/shared/paged-response';

interface DepartmentApiModel extends Omit<DepartmentResponseDto, 'jobIds'> {
  jobId?: number[];
  jobIds?: number[];
  jobs?: JobResponseDto[];
}

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private readonly baseUrl = `${environment.apiUrl}${Path.organisationPath}`;
  private readonly departmentsUrl = `${this.baseUrl}/dep`;
  private readonly jobsUrl = `${this.baseUrl}/jobs`;

  constructor(private readonly http: HttpClient) {}

  getAll(query: OrganizationQueryParams = {}): Observable<PagedResponse<DepartmentResponseDto>> {
    return this.http
      .get<PagedResponse<DepartmentApiModel>>(`${this.departmentsUrl}/list`, {
        params: buildPageParams(query.page ?? 0, query.size ?? 10),
      })
      .pipe(
        map((pageResponse) =>
          normalizePagedResponse(pageResponse, (department) => this.fromDepartmentResponse(department))
        ),
        catchError(createApiErrorHandler('load departments'))
      );
  }

  getById(id: number): Observable<DepartmentResponseDto> {
    return this.http.get<DepartmentApiModel>(`${this.departmentsUrl}/get/${id}`).pipe(
      map((department) => this.fromDepartmentResponse(department)),
      catchError(createApiErrorHandler(`load department #${id}`))
    );
  }

  create(data: DepartmentRequestDto): Observable<DepartmentResponseDto> {
    return this.createDepartment(data);
  }

  update(id: number, data: DepartmentRequestDto): Observable<DepartmentResponseDto> {
    return this.updateDepartment(id, data);
  }

  delete(id: number): Observable<void> {
    return this.deleteDepartment(id);
  }

  createDepartment(department: DepartmentRequestDto): Observable<DepartmentResponseDto> {
    const payload = this.toDepartmentPayload(department);
    debugApiRequest('POST', `${this.departmentsUrl}/create`, payload);

    return this.http
      .post<DepartmentApiModel>(`${this.departmentsUrl}/create`, payload)
      .pipe(
        map((created) => this.fromDepartmentResponse(created)),
        catchError(createApiErrorHandler('create department'))
      );
  }

  updateDepartment(id: number, department: DepartmentRequestDto): Observable<DepartmentResponseDto> {
    const payload = this.toDepartmentPayload(department);
    debugApiRequest('PATCH', `${this.departmentsUrl}/update/${id}`, payload);

    return this.http
      .patch<DepartmentApiModel>(`${this.departmentsUrl}/update/${id}`, payload)
      .pipe(
        map((updated) => this.fromDepartmentResponse(updated)),
        catchError(createApiErrorHandler(`update department #${id}`))
      );
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.departmentsUrl}/delete/${id}`).pipe(
      catchError(createApiErrorHandler(`delete department #${id}`))
    );
  }

  getDepartmentByCode(code: string): Observable<DepartmentResponseDto> {
    const params = buildHttpParams({ code });

    return this.http.get<DepartmentApiModel>(`${this.departmentsUrl}/getByCode`, { params }).pipe(
      map((department) => this.fromDepartmentResponse(department)),
      catchError(createApiErrorHandler(`load department with code ${code}`))
    );
  }

  getAllJobs(query: OrganizationQueryParams = {}): Observable<PagedResponse<JobResponseDto>> {
    return this.http
      .get<PagedResponse<JobResponseDto>>(`${this.jobsUrl}/list`, {
        params: buildPageParams(query.page ?? 0, query.size ?? 10),
      })
      .pipe(
        map((pageResponse) => normalizePagedResponse(pageResponse, (job) => this.fromJobResponse(job))),
        catchError(createApiErrorHandler('load jobs'))
      );
  }

  getJobById(id: number): Observable<JobResponseDto> {
    return this.http.get<JobResponseDto>(`${this.jobsUrl}/get/${id}`).pipe(
      map((job) => this.fromJobResponse(job)),
      catchError(createApiErrorHandler(`load job #${id}`))
    );
  }

  getJobByTitle(title: string): Observable<JobResponseDto> {
    return this.http.get<JobResponseDto>(`${this.jobsUrl}/get/title/${encodeURIComponent(title)}`).pipe(
      map((job) => this.fromJobResponse(job)),
      catchError(createApiErrorHandler(`load job with title ${title}`))
    );
  }

  createJob(job: JobRequestDto, departmentId: number): Observable<JobResponseDto> {
    const payload = this.toJobPayload(job);
    debugApiRequest('POST', `${this.jobsUrl}/addJob/${departmentId}`, payload);

    return this.http.post<JobResponseDto>(`${this.jobsUrl}/addJob/${departmentId}`, payload).pipe(
      map((response) => this.fromJobResponse(response)),
      catchError(createApiErrorHandler('create job'))
    );
  }

  updateJob(id: number, job: JobRequestDto): Observable<JobResponseDto> {
    const payload = this.toJobPayload(job);
    debugApiRequest('PUT', `${this.jobsUrl}/update/${id}`, payload);

    return this.http.put<JobResponseDto>(`${this.jobsUrl}/update/${id}`, payload).pipe(
      map((response) => this.fromJobResponse(response)),
      catchError(createApiErrorHandler(`update job #${id}`))
    );
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${this.jobsUrl}/delete/${id}`).pipe(
      catchError(createApiErrorHandler(`delete job #${id}`))
    );
  }

  assignJobToDepartment(jobId: number, departmentId: number): Observable<JobResponseDto> {
    debugApiRequest('POST', `${this.jobsUrl}/add/${jobId}/${departmentId}`);

    return this.http.post<JobResponseDto>(`${this.jobsUrl}/add/${jobId}/${departmentId}`, null).pipe(
      map((response) => this.fromJobResponse(response)),
      catchError(createApiErrorHandler(`assign job #${jobId} to department #${departmentId}`))
    );
  }

  getJobsByDepartment(departmentId: number): Observable<JobResponseDto[]> {
    return this.getById(departmentId).pipe(
      switchMap((department) => {
        const jobIds = department.jobIds ?? [];

        if (!jobIds.length) {
          return of([]);
        }

        return forkJoin(jobIds.map((jobId) => this.getJobById(jobId)));
      }),
      catchError(createApiErrorHandler(`load jobs for department #${departmentId}`))
    );
  }

  getOrganizationOverview(page = 0, size = 50): Observable<OrganizationOverview> {
    return forkJoin({
      departments: this.getAll({ page, size }).pipe(map((response) => response.content)),
      jobs: this.getAllJobs({ page, size }).pipe(map((response) => response.content)),
    }).pipe(catchError(createApiErrorHandler('load organization overview')));
  }

  getVisibleDepartments(page = 0, size = 50): Observable<PagedResponse<DepartmentResponseDto>> {
    return this.getAll({ page, size });
  }

  getVisibleOrganization(page = 0, size = 50): Observable<OrganizationOverview> {
    return this.getOrganizationOverview(page, size);
  }

  private fromDepartmentResponse(department: DepartmentApiModel): DepartmentResponseDto {
    const { jobId, jobIds, jobs, ...rest } = department;

    return {
      ...rest,
      jobIds:
        jobIds ??
        jobId ??
        (jobs ?? []).map((job) => job.id).filter((id): id is number => id !== undefined),
    };
  }

  private toDepartmentPayload(department: DepartmentRequestDto): DepartmentApiModel {
    const { jobIds, ...rest } = department;

    return {
      ...rest,
      jobId: jobIds ?? [],
    };
  }

  private fromJobResponse(job: JobResponseDto): JobResponseDto {
    return {
      ...job,
      level: job.level ?? undefined,
    };
  }

  private toJobPayload(job: JobRequestDto): JobRequestDto {
    return {
      title: job.title,
      level: job.level ?? undefined,
    };
  }
}
