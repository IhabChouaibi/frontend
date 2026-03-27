import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { JobOffer } from '../../../models/recruitment/job-offer';
import { Page } from '../../../models/recruitment/page';

@Injectable({
  providedIn: 'root',
})
export class JobOfferService {
  private readonly baseUrl = `${environment.apiUrl}${Path.recruitment}/job-offers`;

  constructor(private readonly http: HttpClient) {}

  getAllPaged(page = 0, size = 10, search?: string): Observable<Page<JobOffer>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http
      .get<Page<JobOffer>>(`${this.baseUrl}/getall`, { params })
      .pipe(catchError(this.handleError('load job offers')));
  }

  getById(id: number): Observable<JobOffer> {
    return this.http
      .get<JobOffer>(`${this.baseUrl}/get/${id}`)
      .pipe(catchError(this.handleError(`load job offer #${id}`)));
  }

  create(jobOffer: JobOffer): Observable<JobOffer> {
    return this.http
      .post<JobOffer>(`${this.baseUrl}/create`, jobOffer)
      .pipe(catchError(this.handleError('create job offer')));
  }

  update(id: number, jobOffer: JobOffer): Observable<JobOffer> {
    return this.http
      .patch<JobOffer>(`${this.baseUrl}/update/${id}`, jobOffer)
      .pipe(catchError(this.handleError(`update job offer #${id}`)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/delete/${id}`)
      .pipe(catchError(this.handleError(`delete job offer #${id}`)));
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
