import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { buildPageParams, createApiErrorHandler, debugApiRequest } from '../../http/api.utils';
import { InterviewRequestDto } from '../../../models/recruitment/interview-request.dto';
import { InterviewResponseDto } from '../../../models/recruitment/interview-response.dto';
import { PagedResponse } from '../../../models/shared/paged-response';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  private readonly baseUrl = `${environment.apiUrl}${Path.recruitment}/interview`;

  constructor(private readonly http: HttpClient) {}

  getAllPaged(page = 0, size = 10, applicationId?: number): Observable<PagedResponse<InterviewResponseDto>> {
    const params = buildPageParams(page, size);

    const endpoint = applicationId !== undefined
      ? `${this.baseUrl}/getall/${applicationId}`
      : `${this.baseUrl}/getall`;

    return this.http
      .get<PagedResponse<InterviewResponseDto>>(endpoint, { params })
      .pipe(catchError(createApiErrorHandler('load interviews')));
  }

  getById(id: number): Observable<InterviewResponseDto> {
    return this.http
      .get<InterviewResponseDto>(`${this.baseUrl}/get/${id}`)
      .pipe(catchError(createApiErrorHandler(`load interview #${id}`)));
  }

  update(id: number, interview: InterviewRequestDto): Observable<InterviewResponseDto> {
    debugApiRequest('PATCH', `${this.baseUrl}/update/${id}`, interview);

    return this.http
      .patch<InterviewResponseDto>(`${this.baseUrl}/update/${id}`, interview)
      .pipe(catchError(createApiErrorHandler(`update interview #${id}`)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/delete/${id}`)
      .pipe(catchError(createApiErrorHandler(`delete interview #${id}`)));
  }

  schedule(data: InterviewRequestDto): Observable<InterviewResponseDto> {
    debugApiRequest('POST', `${this.baseUrl}/schedule`, data);

    return this.http
      .post<InterviewResponseDto>(`${this.baseUrl}/schedule`, data)
      .pipe(catchError(createApiErrorHandler('schedule interview')));
  }
}
