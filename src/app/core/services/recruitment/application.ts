import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { buildPageParams, createApiErrorHandler, debugApiRequest } from '../../http/api.utils';
import { ApplicationCreateRequestDto } from '../../../models/recruitment/application-create-request.dto';
import { ApplicationResponseDto } from '../../../models/recruitment/application-response.dto';
import { PagedResponse } from '../../../models/shared/paged-response';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private readonly baseUrl = `${environment.apiUrl}${Path.recruitment}/applications`;

  constructor(private readonly http: HttpClient) {}

  getAllPaged(page = 0, size = 10): Observable<PagedResponse<ApplicationResponseDto>> {
    const params = buildPageParams(page, size);

    return this.http
      .get<PagedResponse<ApplicationResponseDto>>(`${this.baseUrl}/getall`, { params })
      .pipe(catchError(createApiErrorHandler('load applications')));
  }

  getById(id: number): Observable<ApplicationResponseDto> {
    return this.http
      .get<ApplicationResponseDto>(`${this.baseUrl}/get/${id}`)
      .pipe(catchError(createApiErrorHandler(`load application #${id}`)));
  }

  create(application: ApplicationCreateRequestDto): Observable<ApplicationResponseDto> {
    debugApiRequest('POST', `${this.baseUrl}/create`, application);

    return this.http
      .post<ApplicationResponseDto>(`${this.baseUrl}/create`, application)
      .pipe(catchError(createApiErrorHandler('create application')));
  }

  updateStatus(id: number, status: string): Observable<ApplicationResponseDto> {
    debugApiRequest('PUT', `${this.baseUrl}/update/${id}`, status);

    return this.http
      .put<ApplicationResponseDto>(`${this.baseUrl}/update/${id}`, status, {
        headers: { 'Content-Type': 'text/plain' }
      })
      .pipe(catchError(createApiErrorHandler(`update application #${id}`)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/delete/${id}`)
      .pipe(catchError(createApiErrorHandler(`delete application #${id}`)));
  }

  approve(id: number): Observable<ApplicationResponseDto> {
    return this.updateStatus(id, 'APPROVED');
  }

  reject(id: number): Observable<ApplicationResponseDto> {
    return this.updateStatus(id, 'REJECTED');
  }

  getByCandidatePaged(candidateId: number, page = 0, size = 10): Observable<PagedResponse<ApplicationResponseDto>> {
    const params = buildPageParams(page, size);

    return this.http
      .get<PagedResponse<ApplicationResponseDto>>(`${this.baseUrl}/getall/${candidateId}`, { params })
      .pipe(catchError(createApiErrorHandler(`load applications for candidate #${candidateId}`)));
  }
}
