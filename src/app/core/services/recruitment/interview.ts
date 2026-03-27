import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { Interview } from '../../../models/recruitment/interview';
import { Page } from '../../../models/recruitment/page';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  private readonly baseUrl = `${environment.apiUrl}${Path.recruitment}/interview`;

  constructor(private readonly http: HttpClient) {}

  getAllPaged(page = 0, size = 10, applicationId?: number): Observable<Page<Interview>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    const endpoint = applicationId !== undefined
      ? `${this.baseUrl}/getall/${applicationId}`
      : `${this.baseUrl}/getall`;

    return this.http
      .get<Page<Interview>>(endpoint, { params })
      .pipe(catchError(this.handleError('load interviews')));
  }

  getById(id: number): Observable<Interview> {
    return this.http
      .get<Interview>(`${this.baseUrl}/get/${id}`)
      .pipe(catchError(this.handleError(`load interview #${id}`)));
  }

  update(
    id: number,
    interview: Pick<Interview, 'applicationId' | 'interviewerId' | 'interviewDate' | 'type'>
  ): Observable<Interview> {
    return this.http
      .patch<Interview>(`${this.baseUrl}/update/${id}`, interview)
      .pipe(catchError(this.handleError(`update interview #${id}`)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/delete/${id}`)
      .pipe(catchError(this.handleError(`delete interview #${id}`)));
  }

  schedule(
    data: Pick<Interview, 'applicationId' | 'interviewerId' | 'interviewDate' | 'type'>
  ): Observable<Interview> {
    return this.http
      .post<Interview>(`${this.baseUrl}/schedule`, data)
      .pipe(catchError(this.handleError('schedule interview')));
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
