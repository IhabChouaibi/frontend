import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { CheckInRequest } from '../../../models/presence-service/check-in-request';
import { CheckOutRequest } from '../../../models/presence-service/check-out-request';
import { PresenceQueryParams } from '../../../models/presence-service/presence-query-params';
import { PresenceUpsertRequest } from '../../../models/presence-service/presence-upsert-request';
import { PresenceValidationRequest } from '../../../models/presence-service/presence-validation-request';
import { Presence } from '../../../models/presence-service/presence';
import { WorkSchedule } from '../../../models/presence-service/work-schedule';
import { Page } from '../../../models/recruitment/page';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private readonly baseUrl = `${environment.apiUrl}${Path.presencePath}`;
  private readonly presencesUrl = `${this.baseUrl}/presences`;
  private readonly schedulesUrl = `${this.baseUrl}/schedules`;

  constructor(private readonly http: HttpClient) {}

  getAll(query: PresenceQueryParams = {}): Observable<Page<Presence>> {
    return this.http
      .get<Page<Presence>>(this.presencesUrl, {
        params: this.buildParams(query, {
          page: 0,
          size: 10,
        }),
      })
      .pipe(
        map((pageResponse) => this.normalizePage(pageResponse)),
        catchError(this.handleError('load presence records'))
      );
  }

  getById(id: number): Observable<Presence> {
    return this.http.get<Presence>(`${this.presencesUrl}/${id}`).pipe(
      catchError(this.handleError(`load presence record #${id}`))
    );
  }

  create(data: PresenceUpsertRequest): Observable<Presence> {
    return this.http.post<Presence>(this.presencesUrl, data).pipe(
      catchError(this.handleError('create presence record'))
    );
  }

  update(id: number, data: PresenceUpsertRequest): Observable<Presence> {
    return this.http.put<Presence>(`${this.presencesUrl}/${id}`, data).pipe(
      catchError(this.handleError(`update presence record #${id}`))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.presencesUrl}/${id}`).pipe(
      catchError(this.handleError(`delete presence record #${id}`))
    );
  }

  checkIn(request: CheckInRequest): Observable<Presence> {
    return this.http.post<Presence>(`${this.presencesUrl}/check-in`, request).pipe(
      catchError(this.handleError('check in'))
    );
  }

  checkOut(request: CheckOutRequest): Observable<Presence> {
    return this.http.post<Presence>(`${this.presencesUrl}/check-out`, request).pipe(
      catchError(this.handleError('check out'))
    );
  }

  getEmployeeHistory(employeeId: number): Observable<Presence[]> {
    return this.http.get<Presence[]>(`${this.presencesUrl}/employee/${employeeId}`).pipe(
      map((items) => items ?? []),
      catchError(this.handleError(`load presence history for employee #${employeeId}`))
    );
  }

  getEmployeeHistoryPaged(employeeId: number, page = 0, size = 10): Observable<Page<Presence>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    return this.http
      .get<Page<Presence>>(`${this.presencesUrl}/employee/${employeeId}/history`, { params })
      .pipe(
        map((pageResponse) => this.normalizePage(pageResponse)),
        catchError(this.handleError(`load paged presence history for employee #${employeeId}`))
      );
  }

  getMyPresences(employeeId: number, page = 0, size = 10): Observable<Page<Presence>> {
    return this.getEmployeeHistoryPaged(employeeId, page, size);
  }

  validatePresence(id: number, payload: PresenceValidationRequest): Observable<Presence> {
    return this.http.put<Presence>(`${this.presencesUrl}/${id}/validate`, payload).pipe(
      catchError(this.handleError(`validate presence record #${id}`))
    );
  }

  getPendingValidation(page = 0, size = 10): Observable<Page<Presence>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('validated', 'false');

    return this.http.get<Page<Presence>>(`${this.presencesUrl}/pending-validation`, { params }).pipe(
      map((pageResponse) => this.normalizePage(pageResponse)),
      catchError(this.handleError('load pending presence validations'))
    );
  }

  getTeamPresence(query: PresenceQueryParams = {}): Observable<Page<Presence>> {
    return this.http
      .get<Page<Presence>>(`${this.presencesUrl}/team`, {
        params: this.buildParams(query, {
          page: 0,
          size: 10,
        }),
      })
      .pipe(
        map((pageResponse) => this.normalizePage(pageResponse)),
        catchError(this.handleError('load team presence'))
      );
  }

  getWorkSchedules(): Observable<WorkSchedule[]> {
    return this.http.get<WorkSchedule[]>(this.schedulesUrl).pipe(
      map((items) => items ?? []),
      catchError(this.handleError('load work schedules'))
    );
  }

  getActiveWorkSchedule(): Observable<WorkSchedule> {
    return this.http.get<WorkSchedule>(`${this.schedulesUrl}/active`).pipe(
      catchError(this.handleError('load active work schedule'))
    );
  }

  createWorkSchedule(schedule: WorkSchedule): Observable<WorkSchedule> {
    return this.http.post<WorkSchedule>(this.schedulesUrl, schedule).pipe(
      catchError(this.handleError('create work schedule'))
    );
  }

  updateWorkSchedule(id: number, schedule: WorkSchedule): Observable<WorkSchedule> {
    return this.http.put<WorkSchedule>(`${this.schedulesUrl}/${id}`, schedule).pipe(
      catchError(this.handleError(`update work schedule #${id}`))
    );
  }

  deleteWorkSchedule(id: number): Observable<void> {
    return this.http.delete<void>(`${this.schedulesUrl}/${id}`).pipe(
      catchError(this.handleError(`delete work schedule #${id}`))
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

  private normalizePage(page: Page<Presence> | null | undefined): Page<Presence> {
    return {
      content: page?.content ?? [],
      totalElements: page?.totalElements ?? 0,
      totalPages: page?.totalPages ?? 0,
      size: page?.size ?? 0,
      number: page?.number ?? 0,
      first: page?.first ?? true,
      last: page?.last ?? true,
      numberOfElements: page?.numberOfElements ?? 0,
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
