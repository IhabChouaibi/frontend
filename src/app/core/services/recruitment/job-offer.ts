import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { buildPageParams, createApiErrorHandler, debugApiRequest } from '../../http/api.utils';
import { JobOfferRequestDto } from '../../../models/recruitment/job-offer-request.dto';
import { JobOfferResponseDto } from '../../../models/recruitment/job-offer-response.dto';
import { PagedResponse } from '../../../models/shared/paged-response';

@Injectable({
  providedIn: 'root',
})
export class JobOfferService {
  private readonly baseUrl = `${environment.apiUrl}${Path.recruitment}/job-offers`;

  constructor(private readonly http: HttpClient) {}

  getAllPaged(page = 0, size = 10): Observable<PagedResponse<JobOfferResponseDto>> {
    const params = buildPageParams(page, size);

    return this.http
      .get<PagedResponse<JobOfferResponseDto>>(`${this.baseUrl}/getall`, { params })
      .pipe(catchError(createApiErrorHandler('load job offers')));
  }

  getById(id: number): Observable<JobOfferResponseDto> {
    return this.http
      .get<JobOfferResponseDto>(`${this.baseUrl}/get/${id}`)
      .pipe(catchError(createApiErrorHandler(`load job offer #${id}`)));
  }

  create(jobOffer: JobOfferRequestDto): Observable<JobOfferResponseDto> {
    debugApiRequest('POST', `${this.baseUrl}/create`, jobOffer);

    return this.http
      .post<JobOfferResponseDto>(`${this.baseUrl}/create`, jobOffer)
      .pipe(catchError(createApiErrorHandler('create job offer')));
  }

  update(id: number, jobOffer: JobOfferRequestDto): Observable<JobOfferResponseDto> {
    debugApiRequest('PATCH', `${this.baseUrl}/update/${id}`, jobOffer);

    return this.http
      .patch<JobOfferResponseDto>(`${this.baseUrl}/update/${id}`, jobOffer)
      .pipe(catchError(createApiErrorHandler(`update job offer #${id}`)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/delete/${id}`)
      .pipe(catchError(createApiErrorHandler(`delete job offer #${id}`)));
  }
}
