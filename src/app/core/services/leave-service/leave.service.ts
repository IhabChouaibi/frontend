import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { AuthService } from '../auth-service';
import {
  buildHttpParams,
  buildPageParams,
  createApiErrorHandler,
  debugApiRequest,
  normalizePagedResponse,
} from '../../http/api.utils';
import { CreateLeaveRequestDto } from '../../../models/leave-service/create-leave-request.dto';
import { LeaveQueryParams } from '../../../models/leave-service/leave-query-params';
import { LeaveTypeDto } from '../../../models/leave-service/leave-type.dto';
import { LeaveRequestResponseDto } from '../../../models/leave-service/leave-request-response.dto';
import { RejectLeaveRequestDto } from '../../../models/leave-service/reject-leave-request.dto';
import { UpdateLeaveRequestDto } from '../../../models/leave-service/update-leave-request.dto';
import { PagedResponse } from '../../../models/shared/paged-response';

interface LeaveApiModel extends Omit<LeaveRequestResponseDto, 'leaveTypeId'> {
  idLeaveType?: number;
  leaveTypeId?: number;
}

interface CreateLeaveApiPayload extends Omit<CreateLeaveRequestDto, 'leaveTypeId'> {
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

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  getAll(query: LeaveQueryParams = {}): Observable<PagedResponse<LeaveRequestResponseDto>> {
    if (query.employeeId !== undefined && query.employeeId !== null) {
      return this.getByEmployee(query.employeeId, query);
    }

    return this.getPending(query.page ?? 0, query.size ?? 10);
  }

  getById(id: number): Observable<LeaveRequestResponseDto> {
    return throwError(
      () => new Error(`Leave request lookup by id is not exposed by the current backend for request #${id}.`)
    );
  }

  create(data: CreateLeaveRequestDto): Observable<LeaveRequestResponseDto> {
    return this.requestLeave(data);
  }

  update(id: number, data: UpdateLeaveRequestDto): Observable<LeaveRequestResponseDto> {
    const payload = this.toUpdatePayload(data);
    debugApiRequest('PUT', `${this.leaveRequestsUrl}/update/${id}`, payload);

    return this.http
      .put<LeaveApiModel>(`${this.leaveRequestsUrl}/update/${id}`, payload)
      .pipe(
        map((leave) => this.fromLeaveResponse(leave)),
        catchError(createApiErrorHandler(`update leave request #${id}`))
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

  requestLeave(data: CreateLeaveRequestDto): Observable<LeaveRequestResponseDto> {
    const payload = this.toCreatePayload(data);
    debugApiRequest('POST', `${this.leaveRequestsUrl}/submit`, payload);

    return this.http
      .post<LeaveApiModel>(`${this.leaveRequestsUrl}/submit`, payload)
      .pipe(
        map((leave) => this.fromLeaveResponse(leave)),
        catchError(createApiErrorHandler('submit leave request'))
      );
  }

  getMyLeaves(
    employeeId: number,
    query: Omit<LeaveQueryParams, 'employeeId'> = {}
  ): Observable<PagedResponse<LeaveRequestResponseDto>> {
    return this.getByEmployee(employeeId, query);
  }

  getMyLeavesFromSession(
    query: Omit<LeaveQueryParams, 'employeeId'> = {}
  ): Observable<PagedResponse<LeaveRequestResponseDto>> {
    const employeeId = this.authService.getEmployeeId();

    if (employeeId === null) {
      return throwError(() => new Error('No employeeId available in the current session.'));
    }

    return this.getByEmployee(employeeId, query);
  }

  cancelLeave(id: number, employeeId: number): Observable<void> {
    const params = buildHttpParams({ employeeId });

    return this.http.put<void>(`${this.leaveRequestsUrl}/cancel/${id}`, null, { params }).pipe(
      catchError(createApiErrorHandler(`cancel leave request #${id}`))
    );
  }

  getPending(page = 0, size = 10): Observable<PagedResponse<LeaveRequestResponseDto>> {
    const params = buildPageParams(page, size);

    return this.http.get<PagedResponse<LeaveApiModel>>(`${this.leaveRequestsUrl}/pending`, { params }).pipe(
      map((pageResponse) => normalizePagedResponse(pageResponse, (leave) => this.fromLeaveResponse(leave))),
      catchError(createApiErrorHandler('load pending leave requests'))
    );
  }

  searchPending(keyword: string, page = 0, size = 10): Observable<PagedResponse<LeaveRequestResponseDto>> {
    const params = buildPageParams(page, size, { keyword: keyword.trim() });

    return this.http.get<PagedResponse<LeaveApiModel>>(`${this.leaveRequestsUrl}/pending/search`, { params }).pipe(
      map((pageResponse) => normalizePagedResponse(pageResponse, (leave) => this.fromLeaveResponse(leave))),
      catchError(createApiErrorHandler(`search pending leave requests with "${keyword}"`))
    );
  }

  approveLeave(requestId: number, managerId: number): Observable<LeaveRequestResponseDto> {
    const params = buildHttpParams({ managerId });
    debugApiRequest('PUT', `${this.leaveValidationUrl}/${requestId}/approve`, undefined, params);

    return this.http
      .put<LeaveApiModel>(`${this.leaveValidationUrl}/${requestId}/approve`, null, { params })
      .pipe(
        map((leave) => this.fromLeaveResponse(leave)),
        catchError(createApiErrorHandler(`approve leave request #${requestId}`))
      );
  }

  rejectLeave(
    requestId: number,
    managerId: number,
    payload: RejectLeaveRequestDto
  ): Observable<LeaveRequestResponseDto> {
    const params = buildHttpParams({ managerId });
    debugApiRequest('PUT', `${this.leaveValidationUrl}/${requestId}/reject`, payload, params);

    return this.http
      .put<LeaveApiModel>(`${this.leaveValidationUrl}/${requestId}/reject`, payload, { params })
      .pipe(
        map((leave) => this.fromLeaveResponse(leave)),
        catchError(createApiErrorHandler(`reject leave request #${requestId}`))
      );
  }

  getByEmployee(
    employeeId: number,
    query: Omit<LeaveQueryParams, 'employeeId'> = {}
  ): Observable<PagedResponse<LeaveRequestResponseDto>> {
    if (query.leaveTypeId !== undefined && query.leaveTypeId !== null) {
      const params = buildPageParams(query.page ?? 0, query.size ?? 10, {
        employeeId,
        leaveTypeId: query.leaveTypeId,
      });

      return this.http.get<PagedResponse<LeaveApiModel>>(`${this.leaveHistoryUrl}/get-by-status`, { params }).pipe(
        map((pageResponse) => normalizePagedResponse(pageResponse, (leave) => this.fromLeaveResponse(leave))),
        catchError(createApiErrorHandler(`load leave history for employee #${employeeId}`))
      );
    }

    const params = buildPageParams(query.page ?? 0, query.size ?? 10);

    return this.http
      .get<PagedResponse<LeaveApiModel>>(`${this.leaveHistoryUrl}/get-by-employee/${employeeId}`, { params })
      .pipe(
        map((pageResponse) => normalizePagedResponse(pageResponse, (leave) => this.fromLeaveResponse(leave))),
        catchError(createApiErrorHandler(`load leave history for employee #${employeeId}`))
      );
  }

  getTakenLeaveDays(employeeId: number, leaveTypeId: number): Observable<number> {
    const params = buildHttpParams({ employeeId, leaveTypeId });

    return this.http.get<number>(`${this.leaveHistoryUrl}/get-total`, { params }).pipe(
      catchError(createApiErrorHandler(`load leave totals for employee #${employeeId}`))
    );
  }

  searchEmployeeHistory(
    employeeId: number,
    keyword: string,
    page = 0,
    size = 10
  ): Observable<PagedResponse<LeaveRequestResponseDto>> {
    const params = buildPageParams(page, size, {
      employeeId,
      keyword: keyword.trim(),
    });

    return this.http.get<PagedResponse<LeaveApiModel>>(`${this.leaveHistoryUrl}/search`, { params }).pipe(
      map((pageResponse) => normalizePagedResponse(pageResponse, (leave) => this.fromLeaveResponse(leave))),
      catchError(createApiErrorHandler(`search leave history for employee #${employeeId}`))
    );
  }

  getLeaveTypes(page = 0, size = 50): Observable<PagedResponse<LeaveTypeDto>> {
    const params = buildPageParams(page, size);

    return this.http.get<PagedResponse<LeaveTypeDto>>(`${this.leaveTypesUrl}/getall`, { params }).pipe(
      map((pageResponse) => normalizePagedResponse(pageResponse, (type) => this.fromLeaveTypeResponse(type))),
      catchError(createApiErrorHandler('load leave types'))
    );
  }

  getLeaveTypeById(id: number): Observable<LeaveTypeDto> {
    return this.http.get<LeaveTypeDto>(`${this.leaveTypesUrl}/get/${id}`).pipe(
      map((response) => this.fromLeaveTypeResponse(response)),
      catchError(createApiErrorHandler(`load leave type #${id}`))
    );
  }

  createLeaveType(leaveType: LeaveTypeDto): Observable<LeaveTypeDto> {
    const payload = this.toLeaveTypePayload(leaveType);
    debugApiRequest('POST', `${this.leaveTypesUrl}/add`, payload);

    return this.http.post<LeaveTypeDto>(`${this.leaveTypesUrl}/add`, payload).pipe(
      map((response) => this.fromLeaveTypeResponse(response)),
      catchError(createApiErrorHandler('create leave type'))
    );
  }

  updateLeaveType(id: number, leaveType: LeaveTypeDto): Observable<LeaveTypeDto> {
    const payload = this.toLeaveTypePayload(leaveType);
    debugApiRequest('PATCH', `${this.leaveTypesUrl}/update/${id}`, payload);

    return this.http.patch<LeaveTypeDto>(`${this.leaveTypesUrl}/update/${id}`, payload).pipe(
      map((response) => this.fromLeaveTypeResponse(response)),
      catchError(createApiErrorHandler(`update leave type #${id}`))
    );
  }

  deleteLeaveType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.leaveTypesUrl}/delete/${id}`).pipe(
      catchError(createApiErrorHandler(`delete leave type #${id}`))
    );
  }

  private fromLeaveResponse(leave: LeaveApiModel): LeaveRequestResponseDto {
    const { idLeaveType, ...rest } = leave;

    return {
      ...rest,
      leaveTypeId: leave.leaveTypeId ?? idLeaveType ?? 0,
    };
  }

  private toCreatePayload(data: CreateLeaveRequestDto): CreateLeaveApiPayload {
    const { leaveTypeId, ...rest } = data;

    return {
      ...rest,
      idLeaveType: leaveTypeId,
    };
  }

  private toUpdatePayload(data: UpdateLeaveRequestDto): UpdateLeaveRequestDto {
    return {
      leaveTypeId: data.leaveTypeId,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason ?? undefined,
    };
  }

  private fromLeaveTypeResponse(leaveType: LeaveTypeDto): LeaveTypeDto {
    return {
      ...leaveType,
      paid: leaveType.paid ?? undefined,
      requiresApproval: leaveType.requiresApproval ?? undefined,
      requiresDocument: leaveType.requiresDocument ?? undefined,
      maxDaysPerYear: leaveType.maxDaysPerYear ?? undefined,
      deductFromBalance: leaveType.deductFromBalance ?? false,
    };
  }

  private toLeaveTypePayload(leaveType: LeaveTypeDto): LeaveTypeDto {
    return {
      name: leaveType.name,
      paid: leaveType.paid ?? 'NO',
      requiresApproval: leaveType.requiresApproval ?? 'NO',
      requiresDocument: leaveType.requiresDocument ?? 'NO',
      maxDaysPerYear: leaveType.maxDaysPerYear ?? undefined,
      deductFromBalance: leaveType.deductFromBalance ?? false,
    };
  }
}
