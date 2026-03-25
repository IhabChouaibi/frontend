import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { Department } from '../../../models/organisation-service/department';
import { Job } from '../../../models/organisation-service/job';
import { OrganizationOverview } from '../../../models/organisation-service/organization-overview';
import { OrganizationQueryParams } from '../../../models/organisation-service/organization-query-params';
import { Page } from '../../../models/recruitment/page';

interface DepartmentApiModel extends Omit<Department, 'jobIds'> {
  jobId?: number[];
  jobIds?: number[];
}

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  private readonly baseUrl = `${environment.apiUrl}${Path.organisationPath}`;
  private readonly departmentsUrl = `${this.baseUrl}/dep`;
  private readonly jobsUrl = `${this.baseUrl}/jobs`;

  constructor(private readonly http: HttpClient) {}

  getAll(query: OrganizationQueryParams = {}): Observable<Page<Department>> {
    return this.http
      .get<Page<DepartmentApiModel>>(`${this.departmentsUrl}/list`, {
        params: this.buildParams(query, {
          page: 0,
          size: 10,
        }),
      })
      .pipe(
        map((pageResponse) => this.normalizePage(pageResponse, (department) => this.mapDepartment(department))),
        catchError(this.handleError('load departments'))
      );
  }

  getById(id: number): Observable<Department> {
    return this.http.get<DepartmentApiModel>(`${this.departmentsUrl}/get/${id}`).pipe(
      map((department) => this.mapDepartment(department)),
      catchError(this.handleError(`load department #${id}`))
    );
  }

  create(data: Department): Observable<Department> {
    return this.createDepartment(data);
  }

  update(id: number, data: Department): Observable<Department> {
    return this.updateDepartment(id, data);
  }

  delete(id: number): Observable<void> {
    return this.deleteDepartment(id);
  }

  createDepartment(department: Department): Observable<Department> {
    return this.http
      .post<DepartmentApiModel>(`${this.departmentsUrl}/create`, this.toDepartmentPayload(department))
      .pipe(
        map((created) => this.mapDepartment(created)),
        catchError(this.handleError('create department'))
      );
  }

  updateDepartment(id: number, department: Department): Observable<Department> {
    return this.http
      .patch<DepartmentApiModel>(`${this.departmentsUrl}/update/${id}`, this.toDepartmentPayload(department))
      .pipe(
        map((updated) => this.mapDepartment(updated)),
        catchError(this.handleError(`update department #${id}`))
      );
  }

  deleteDepartment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.departmentsUrl}/delete/${id}`).pipe(
      catchError(this.handleError(`delete department #${id}`))
    );
  }

  getDepartmentByCode(code: string): Observable<Department> {
    const params = new HttpParams().set('code', code);

    return this.http.get<DepartmentApiModel>(`${this.departmentsUrl}/getByCode`, { params }).pipe(
      map((department) => this.mapDepartment(department)),
      catchError(this.handleError(`load department with code ${code}`))
    );
  }

  getAllJobs(query: OrganizationQueryParams = {}): Observable<Page<Job>> {
    return this.http
      .get<Page<Job>>(this.jobsUrl, {
        params: this.buildParams(query, {
          page: 0,
          size: 10,
        }),
      })
      .pipe(
        map((pageResponse) => this.normalizePage(pageResponse, (job) => job)),
        catchError(this.handleError('load jobs'))
      );
  }

  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.jobsUrl}/get/${id}`).pipe(
      catchError(this.handleError(`load job #${id}`))
    );
  }

  getJobByTitle(title: string): Observable<Job> {
    return this.http.get<Job>(`${this.jobsUrl}/get/title/${encodeURIComponent(title)}`).pipe(
      catchError(this.handleError(`load job with title ${title}`))
    );
  }

  createJob(job: Job, departmentId: number): Observable<Job> {
    return this.http.post<Job>(`${this.jobsUrl}/addJob/${departmentId}`, job).pipe(
      catchError(this.handleError('create job'))
    );
  }

  updateJob(id: number, job: Job): Observable<Job> {
    return this.http.put<Job>(`${this.jobsUrl}/update/${id}`, job).pipe(
      catchError(this.handleError(`update job #${id}`))
    );
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${this.jobsUrl}/delete/${id}`).pipe(
      catchError(this.handleError(`delete job #${id}`))
    );
  }

  assignJobToDepartment(jobId: number, departmentId: number): Observable<Job> {
    return this.http.post<Job>(`${this.jobsUrl}/add/${jobId}/${departmentId}`, null).pipe(
      catchError(this.handleError(`assign job #${jobId} to department #${departmentId}`))
    );
  }

  getJobsByDepartment(departmentId: number): Observable<Job[]> {
    return this.getById(departmentId).pipe(
      switchMap((department) => {
        const jobIds = department.jobIds ?? [];

        if (!jobIds.length) {
          return of([]);
        }

        return forkJoin(jobIds.map((jobId) => this.getJobById(jobId)));
      }),
      catchError(this.handleError(`load jobs for department #${departmentId}`))
    );
  }

  getOrganizationOverview(page = 0, size = 50): Observable<OrganizationOverview> {
    return forkJoin({
      departments: this.getAll({ page, size }).pipe(map((response) => response.content)),
      jobs: this.getAllJobs({ page, size }).pipe(map((response) => response.content)),
    }).pipe(catchError(this.handleError('load organization overview')));
  }

  getVisibleDepartments(page = 0, size = 50): Observable<Page<Department>> {
    return this.getAll({ page, size });
  }

  getVisibleOrganization(page = 0, size = 50): Observable<OrganizationOverview> {
    return this.getOrganizationOverview(page, size);
  }

  private buildParams(
    values: object,
    defaults: Record<string, string | number | boolean>
  ): HttpParams {
    let params = new HttpParams();

    Object.entries({
      ...defaults,
      ...(values as Record<string, string | number | boolean | undefined | null>),
    }).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    });

    return params;
  }

  private normalizePage<TInput, TOutput>(
    page: Page<TInput> | null | undefined,
    mapper: (item: TInput) => TOutput
  ): Page<TOutput> {
    return {
      content: (page?.content ?? []).map((item) => mapper(item)),
      totalElements: page?.totalElements ?? 0,
      totalPages: page?.totalPages ?? 0,
      size: page?.size ?? 0,
      number: page?.number ?? 0,
      first: page?.first ?? true,
      last: page?.last ?? true,
      numberOfElements: page?.numberOfElements ?? 0,
    };
  }

  private mapDepartment(department: DepartmentApiModel): Department {
    const { jobId, jobIds, ...rest } = department;

    return {
      ...rest,
      jobIds: jobIds ?? jobId ?? [],
    };
  }

  private toDepartmentPayload(department: Department): DepartmentApiModel {
    const { jobIds, ...rest } = department;

    return {
      ...rest,
      jobId: jobIds ?? [],
    };
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      const serverMessage =
        typeof error.error === 'string'
          ? error.error
          : error.error?.message ?? error.error?.error ?? error.message;

      return throwError(
        () => new Error(serverMessage || `Unable to ${operation}. Please try again.`)
      );
    };
  }
}
