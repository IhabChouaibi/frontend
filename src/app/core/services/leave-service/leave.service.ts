import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { CreateLeaveRequest } from '../../../models/leave-service/create-leave-request';
import { LeaveQueryParams } from '../../../models/leave-service/leave-query-params';
import { LeaveType } from '../../../models/leave-service/leave-type';
import { Leave } from '../../../models/leave-service/leave';
import { RejectLeaveRequest } from '../../../models/leave-service/reject-leave-request';
import { UpdateLeaveRequest } from '../../../models/leave-service/update-leave-request';
import { Page } from '../../../models/recruitment/page';

interface LeaveApiModel extends Omit<Leave, 'leaveTypeId'> {
  idLeaveType?: number;
  leaveTypeId?: number;
}

interface CreateLeaveApiPayload extends Omit<CreateLeaveRequest, 'leaveTypeId'> {
  idLeaveType: number;
}

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private readonly baseUrl = `${environment.apiUrl}${Path.leavePath}`;
  private readonly leaveRequestsUrl = `${this.baseUrl}/leave-requests`;
  private readonly leaveHistoryUrl = `${this.baseUrl}/history`;
  private readonly leaveValidationUrl = `${this.baseUrl}/leave-validation`;
  private readonly leaveTypesUrl = `${this.baseUrl}/leave`;

  constructor(private readonly http: HttpClient) {}

  getAll(query: LeaveQueryParams = {}): Observable<Page<Leave>> {
    if (query.employeeId !== undefined && query.employeeId !== null) {
      return this.getByEmployee(query.employeeId, query);
    }

    return this.getPending(query.page ?? 0, query.size ?? 10);
  }

  getById(id: number): Observable<Leave> {
    return throwError(
      () => new Error(`Leave request lookup by id is not exposed by the current backend for request #${id}.`)
    );
  }

  create(data: CreateLeaveRequest): Observable<Leave> {
    return this.requestLeave(data);
  }

  update(id: number, data: UpdateLeaveRequest): Observable<Leave> {
    return this.http
      .put<LeaveApiModel>(`${this.leaveRequestsUrl}/update/${id}`, data)
      .pipe(
        map((leave) => this.mapLeave(leave)),
        catchError(this.handleError(`update leave request #${id}`))
      );
  }

  delete(id: number, employeeId?: number): Observable<void> {
    if (employeeId !== undefined && employeeId !== null) {
      return this.cancelLeave(id, employeeId);
    }

    return throwError(
      () => new Error(`Deleting leave request #${id} is not exposed by the current backend. Use cancel instead.`)
    );
  }

  requestLeave(data: CreateLeaveRequest): Observable<Leave> {
    return this.http
      .post<LeaveApiModel>(`${this.leaveRequestsUrl}/submit`, this.toCreatePayload(data))
      .pipe(
        map((leave) => this.mapLeave(leave)),
        catchError(this.handleError('submit leave request'))
      );
  }

  getMyLeaves(employeeId: number, query: Omit<LeaveQueryParams, 'employeeId'> = {}): Observable<Page<Leave>> {
    return this.getByEmployee(employeeId, query);
  }

  cancelLeave(id: number, employeeId: number): Observable<void> {
    const params = new HttpParams().set('employeeId', String(employeeId));

    return this.http.put<void>(`${this.leaveRequestsUrl}/cancel/${id}`, null, { params }).pipe(
      catchError(this.handleError(`cancel leave request #${id}`))
    );
  }

  getPending(page = 0, size = 10): Observable<Page<Leave>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    return this.http.get<Page<LeaveApiModel>>(`${this.leaveRequestsUrl}/pending`, { params }).pipe(
      map((pageResponse) => this.normalizePage(pageResponse, (leave) => this.mapLeave(leave))),
      catchError(this.handleError('load pending leave requests'))
    );
  }

  searchPending(keyword: string, page = 0, size = 10): Observable<Page<Leave>> {
    const params = new HttpParams()
      .set('keyword', keyword.trim())
      .set('page', String(page))
      .set('size', String(size));

    return this.http.get<Page<LeaveApiModel>>(`${this.leaveRequestsUrl}/pending/search`, { params }).pipe(
      map((pageResponse) => this.normalizePage(pageResponse, (leave) => this.mapLeave(leave))),
      catchError(this.handleError(`search pending leave requests with "${keyword}"`))
    );
  }

  approveLeave(requestId: number, managerId: number): Observable<Leave> {
    const params = new HttpParams().set('managerId', String(managerId));

    return this.http
      .put<LeaveApiModel>(`${this.leaveValidationUrl}/${requestId}/approve`, null, { params })
      .pipe(
        map((leave) => this.mapLeave(leave)),
        catchError(this.handleError(`approve leave request #${requestId}`))
      );
  }

  rejectLeave(requestId: number, managerId: number, payload: RejectLeaveRequest): Observable<Leave> {
    const params = new HttpParams().set('managerId', String(managerId));

    return this.http
      .put<LeaveApiModel>(`${this.leaveValidationUrl}/${requestId}/reject`, payload, { params })
      .pipe(
        map((leave) => this.mapLeave(leave)),
        catchError(this.handleError(`reject leave request #${requestId}`))
      );
  }

  getByEmployee(employeeId: number, query: Omit<LeaveQueryParams, 'employeeId'> = {}): Observable<Page<Leave>> {
    if (query.leaveTypeId !== undefined && query.leaveTypeId !== null) {
      const params = this.buildParams(
        {
          employeeId,
          leaveTypeId: query.leaveTypeId,
          page: query.page ?? 0,
          size: query.size ?? 10,
        },
        {}
      );

      return this.http.get<Page<LeaveApiModel>>(`${this.leaveHistoryUrl}/get-by-status`, { params }).pipe(
        map((pageResponse) => this.normalizePage(pageResponse, (leave) => this.mapLeave(leave))),
        catchError(this.handleError(`load leave history for employee #${employeeId}`))
      );
    }

    const params = this.buildParams(
      {
        page: query.page ?? 0,
        size: query.size ?? 10,
      },
      {}
    );

    return this.http
      .get<Page<LeaveApiModel>>(`${this.leaveHistoryUrl}/get-by-employee/${employeeId}`, { params })
      .pipe(
        map((pageResponse) => this.normalizePage(pageResponse, (leave) => this.mapLeave(leave))),
        catchError(this.handleError(`load leave history for employee #${employeeId}`))
      );
  }

  getTakenLeaveDays(employeeId: number, leaveTypeId: number): Observable<number> {
    const params = new HttpParams()
      .set('employeeId', String(employeeId))
      .set('leaveTypeId', String(leaveTypeId));

    return this.http.get<number>(`${this.leaveHistoryUrl}/get-total`, { params }).pipe(
      catchError(this.handleError(`load leave totals for employee #${employeeId}`))
    );
  }

  searchEmployeeHistory(employeeId: number, keyword: string, page = 0, size = 10): Observable<Page<Leave>> {
    const params = new HttpParams()
      .set('employeeId', String(employeeId))
      .set('keyword', keyword.trim())
      .set('page', String(page))
      .set('size', String(size));

    return this.http.get<Page<LeaveApiModel>>(`${this.leaveHistoryUrl}/search`, { params }).pipe(
      map((pageResponse) => this.normalizePage(pageResponse, (leave) => this.mapLeave(leave))),
      catchError(this.handleError(`search leave history for employee #${employeeId}`))
    );
  }

  getLeaveTypes(page = 0, size = 50): Observable<Page<LeaveType>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    return this.http.get<Page<LeaveType>>(`${this.leaveTypesUrl}/getall`, { params }).pipe(
      map((pageResponse) => this.normalizePage(pageResponse, (type) => type)),
      catchError(this.handleError('load leave types'))
    );
  }

  getLeaveTypeById(id: number): Observable<LeaveType> {
    return this.http.get<LeaveType>(`${this.leaveTypesUrl}/get/${id}`).pipe(
      catchError(this.handleError(`load leave type #${id}`))
    );
  }

  createLeaveType(leaveType: LeaveType): Observable<LeaveType> {
    return this.http.post<LeaveType>(`${this.leaveTypesUrl}/add`, leaveType).pipe(
      catchError(this.handleError('create leave type'))
    );
  }

  updateLeaveType(id: number, leaveType: LeaveType): Observable<LeaveType> {
    return this.http.patch<LeaveType>(`${this.leaveTypesUrl}/update/${id}`, leaveType).pipe(
      catchError(this.handleError(`update leave type #${id}`))
    );
  }

  deleteLeaveType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.leaveTypesUrl}/delete/${id}`).pipe(
      catchError(this.handleError(`delete leave type #${id}`))
    );
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

  private mapLeave(leave: LeaveApiModel): Leave {
    const { idLeaveType, ...rest } = leave;

    return {
      ...rest,
      leaveTypeId: leave.leaveTypeId ?? idLeaveType ?? 0,
    };
  }

  private toCreatePayload(data: CreateLeaveRequest): CreateLeaveApiPayload {
    const { leaveTypeId, ...rest } = data;

    return {
      ...rest,
      idLeaveType: leaveTypeId,
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
