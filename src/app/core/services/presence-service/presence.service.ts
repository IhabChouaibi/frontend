import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { CheckInRequest } from '../../../models/presence-service/check-in-request';
import { CheckOutRequest } from '../../../models/presence-service/check-out-request';
import { PresenceValidationRequest } from '../../../models/presence-service/presence-validation-request';
import { Presence } from '../../../models/presence-service/presence';
import { Page } from '../../../models/recruitment/page';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private readonly baseUrl = `${environment.apiUrl}${Path.presencePath}/presences`;

  constructor(private readonly http: HttpClient) {}

  getAll(page = 0, size = 10): Observable<Page<Presence>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    return this.http
      .get<Page<Presence>>(`${this.baseUrl}/getall`, { params })
      .pipe(
        map((pageResponse) => this.normalizePage(pageResponse)),
        catchError(this.handleError('load presence records'))
      );
  }

  checkIn(request: CheckInRequest): Observable<Presence> {
    return this.http
      .post<Presence>(`${this.baseUrl}/check-in`, request)
      .pipe(catchError(this.handleError('check in')));
  }

  checkOut(request: CheckOutRequest): Observable<Presence> {
    return this.http
      .post<Presence>(`${this.baseUrl}/check-out`, request)
      .pipe(catchError(this.handleError('check out')));
  }

  getEmployeeHistory(employeeId: number): Observable<Presence[]> {
    return this.http
      .get<Presence[]>(`${this.baseUrl}/employee/${employeeId}`)
      .pipe(
        map((items) => items ?? []),
        catchError(this.handleError(`load presence history for employee #${employeeId}`))
      );
  }

  getEmployeeHistoryPaged(employeeId: number, page = 0, size = 10): Observable<Page<Presence>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    return this.http
      .get<Page<Presence>>(`${this.baseUrl}/employee/${employeeId}/history`, { params })
      .pipe(
        map((pageResponse) => this.normalizePage(pageResponse)),
        catchError(this.handleError(`load paged presence history for employee #${employeeId}`))
      );
  }

  validatePresence(id: number, payload: PresenceValidationRequest): Observable<Presence> {
    return this.http
      .put<Presence>(`${this.baseUrl}/${id}/validate`, payload)
      .pipe(catchError(this.handleError(`validate presence record #${id}`)));
  }

  getPendingValidation(page = 0, size = 10): Observable<Page<Presence>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    return this.http
      .get<Page<Presence>>(`${this.baseUrl}/pending-validation`, { params })
      .pipe(
        map((pageResponse) => this.normalizePage(pageResponse)),
        catchError(this.handleError('load pending presence validations'))
      );
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
