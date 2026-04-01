import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { buildPageParams, createApiErrorHandler } from '../../http/api.utils';
import { ApplicationService } from './application';
import { AttachmentService } from './attachment';
import { ApplicationCreateRequestDto } from '../../../models/recruitment/application-create-request.dto';
import { CandidateRequestDto } from '../../../models/recruitment/candidate-request.dto';
import { CandidateResponseDto } from '../../../models/recruitment/candidate-response.dto';
import { PagedResponse } from '../../../models/shared/paged-response';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private readonly baseUrl = `${environment.apiUrl}${Path.recruitment}/candidate`;

  constructor(
    private readonly http: HttpClient,
    private readonly applicationService: ApplicationService,
    private readonly attachmentService: AttachmentService
  ) {}

  getAllPaged(page = 0, size = 10): Observable<PagedResponse<CandidateResponseDto>> {
    const params = buildPageParams(page, size);

    return this.http
      .get<PagedResponse<CandidateResponseDto>>(`${this.baseUrl}/getall`, { params })
      .pipe(catchError(createApiErrorHandler('load candidates')));
  }

  getById(id: number): Observable<CandidateResponseDto> {
    return this.http
      .get<CandidateResponseDto>(`${this.baseUrl}/get/${id}`)
      .pipe(catchError(createApiErrorHandler(`load candidate #${id}`)));
  }

  create(candidate: CandidateRequestDto): Observable<CandidateResponseDto> {
    return this.http
      .post<CandidateResponseDto>(`${this.baseUrl}/create`, candidate)
      .pipe(catchError(createApiErrorHandler('create candidate')));
  }

  update(id: number, candidate: CandidateRequestDto): Observable<CandidateResponseDto> {
    return this.http
      .patch<CandidateResponseDto>(`${this.baseUrl}/update/${id}`, candidate)
      .pipe(catchError(createApiErrorHandler(`update candidate #${id}`)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/delete/${id}`)
      .pipe(catchError(createApiErrorHandler(`delete candidate #${id}`)));
  }

  apply(jobOfferId: number, candidate: CandidateRequestDto, cv: File): Observable<CandidateResponseDto> {
    if (!cv) {
      return throwError(() => new Error('A CV file is required.'));
    }

    return this.create(candidate).pipe(
      switchMap((candidate) => {
        const candidateId = candidate.id;

        if (!candidateId) {
          return throwError(() => new Error('The candidate could not be created.'));
        }

        const applicationPayload: ApplicationCreateRequestDto = {
          candidateId,
          jobOfferId,
        };

        return this.attachmentService.upload({
          candidateId,
          file: cv,
          category: 'CV',
        }).pipe(
          switchMap(() =>
            this.applicationService.create(applicationPayload).pipe(map(() => candidate))
          )
        );
      }),
      catchError(createApiErrorHandler('submit application'))
    );
  }
}
