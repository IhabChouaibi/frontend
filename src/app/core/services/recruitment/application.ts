import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { Application } from '../../../models/recruitment/application';
import { Page } from '../../../models/recruitment/page';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private readonly baseUrl = `${environment.apiUrl}${Path.recruitment}/applications`;

  constructor(private readonly http: HttpClient) {}

  getAllPaged(page = 0, size = 10): Observable<Page<Application>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    return this.http
      .get<Page<Application>>(`${this.baseUrl}/getall`, { params })
      .pipe(catchError(this.handleError('load applications')));
  }

  getById(id: number): Observable<Application> {
    return this.http
      .get<Application>(`${this.baseUrl}/get/${id}`)
      .pipe(catchError(this.handleError(`load application #${id}`)));
  }

  create(application: Pick<Application, 'candidateId' | 'jobOfferId'>): Observable<Application> {
    return this.http
      .post<Application>(`${this.baseUrl}/create`, application)
      .pipe(catchError(this.handleError('create application')));
  }

  updateStatus(id: number, status: string): Observable<Application> {
    return this.http
      .put<Application>(`${this.baseUrl}/update/${id}`, status, {
        headers: { 'Content-Type': 'text/plain' }
      })
      .pipe(catchError(this.handleError(`update application #${id}`)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/delete/${id}`)
      .pipe(catchError(this.handleError(`delete application #${id}`)));
  }

  approve(id: number): Observable<Application> {
    return this.updateStatus(id, 'APPROVED');
  }

  reject(id: number): Observable<Application> {
    return this.updateStatus(id, 'REJECTED');
  }

  getByCandidatePaged(candidateId: number, page = 0, size = 10): Observable<Page<Application>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    return this.http
      .get<Page<Application>>(`${this.baseUrl}/getall/${candidateId}`, { params })
      .pipe(catchError(this.handleError(`load applications for candidate #${candidateId}`)));
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
