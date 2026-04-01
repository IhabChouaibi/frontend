import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import {
  buildPageParams,
  createApiErrorHandler,
  debugApiRequest,
  normalizePagedResponse,
} from '../../http/api.utils';
import { CheckInRequestDto } from '../../../models/presence-service/check-in-request.dto';
import { CheckOutRequestDto } from '../../../models/presence-service/check-out-request.dto';
import { PresenceResponseDto } from '../../../models/presence-service/presence-response.dto';
import { PresenceValidationRequestDto } from '../../../models/presence-service/presence-validation-request.dto';
import { PagedResponse } from '../../../models/shared/paged-response';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  private readonly baseUrl = `${environment.apiUrl}${Path.presencePath}/presences`;

  constructor(private readonly http: HttpClient) {}

  getAll(page = 0, size = 10): Observable<PagedResponse<PresenceResponseDto>> {
    const params = buildPageParams(page, size);

    return this.http
      .get<PagedResponse<PresenceResponseDto>>(`${this.baseUrl}/getall`, { params })
      .pipe(
        map((pageResponse) => normalizePagedResponse(pageResponse, (item) => this.fromResponse(item))),
        catchError(createApiErrorHandler('load presence records'))
      );
  }

  checkIn(request: CheckInRequestDto): Observable<PresenceResponseDto> {
    debugApiRequest('POST', `${this.baseUrl}/check-in`, request);

    return this.http
      .post<PresenceResponseDto>(`${this.baseUrl}/check-in`, request)
      .pipe(
        map((response) => this.fromResponse(response)),
        catchError(createApiErrorHandler('check in'))
      );
  }

  checkOut(request: CheckOutRequestDto): Observable<PresenceResponseDto> {
    debugApiRequest('POST', `${this.baseUrl}/check-out`, request);

    return this.http
      .post<PresenceResponseDto>(`${this.baseUrl}/check-out`, request)
      .pipe(
        map((response) => this.fromResponse(response)),
        catchError(createApiErrorHandler('check out'))
      );
  }

  getEmployeeHistory(employeeId: number): Observable<PresenceResponseDto[]> {
    return this.http
      .get<PresenceResponseDto[]>(`${this.baseUrl}/employee/${employeeId}`)
      .pipe(
        map((items) => (items ?? []).map((item) => this.fromResponse(item))),
        catchError(createApiErrorHandler(`load presence history for employee #${employeeId}`))
      );
  }

  getEmployeeHistoryPaged(
    employeeId: number,
    page = 0,
    size = 10
  ): Observable<PagedResponse<PresenceResponseDto>> {
    const params = buildPageParams(page, size);

    return this.http
      .get<PagedResponse<PresenceResponseDto>>(`${this.baseUrl}/employee/${employeeId}/history`, { params })
      .pipe(
        map((pageResponse) => normalizePagedResponse(pageResponse, (item) => this.fromResponse(item))),
        catchError(createApiErrorHandler(`load paged presence history for employee #${employeeId}`))
      );
  }

  validatePresence(id: number, payload: PresenceValidationRequestDto): Observable<PresenceResponseDto> {
    debugApiRequest('PUT', `${this.baseUrl}/${id}/validate`, payload);

    return this.http
      .put<PresenceResponseDto>(`${this.baseUrl}/${id}/validate`, payload)
      .pipe(
        map((response) => this.fromResponse(response)),
        catchError(createApiErrorHandler(`validate presence record #${id}`))
      );
  }

  getPendingValidation(page = 0, size = 10): Observable<PagedResponse<PresenceResponseDto>> {
    const params = buildPageParams(page, size);

    return this.http
      .get<PagedResponse<PresenceResponseDto>>(`${this.baseUrl}/pending-validation`, { params })
      .pipe(
        map((pageResponse) => normalizePagedResponse(pageResponse, (item) => this.fromResponse(item))),
        catchError(createApiErrorHandler('load pending presence validations'))
      );
  }

  private fromResponse(response: PresenceResponseDto): PresenceResponseDto {
    return {
      ...response,
      date: response.date ?? undefined,
      checkIn: response.checkIn ?? undefined,
      checkOut: response.checkOut ?? undefined,
      workedMinutes: response.workedMinutes ?? undefined,
      lateMinutes: response.lateMinutes ?? undefined,
      status: response.status ?? undefined,
      validated: response.validated ?? false,
    };
  }
}
