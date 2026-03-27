import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { Candidate } from '../../../models/recruitment/candidate';
import { Page } from '../../../models/recruitment/page';
import { ApplicationService } from './application';
import { AttachmentService } from './attachment';

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

  getAllPaged(page = 0, size = 10, search?: string): Observable<Page<Candidate>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http
      .get<Page<Candidate>>(`${this.baseUrl}/getall`, { params })
      .pipe(catchError(this.handleError('load candidates')));
  }

  getById(id: number): Observable<Candidate> {
    return this.http
      .get<Candidate>(`${this.baseUrl}/get/${id}`)
      .pipe(catchError(this.handleError(`load candidate #${id}`)));
  }

  create(candidate: Candidate): Observable<Candidate> {
    return this.http
      .post<Candidate>(`${this.baseUrl}/create`, candidate)
      .pipe(catchError(this.handleError('create candidate')));
  }

  update(id: number, candidate: Candidate): Observable<Candidate> {
    return this.http
      .patch<Candidate>(`${this.baseUrl}/update/${id}`, candidate)
      .pipe(catchError(this.handleError(`update candidate #${id}`)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/delete/${id}`)
      .pipe(catchError(this.handleError(`delete candidate #${id}`)));
  }

  apply(jobId: number, formData: FormData): Observable<Candidate> {
    const firstName = String(formData.get('firstName') ?? '').trim();
    const lastName = String(formData.get('lastName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    const cv = formData.get('cv');

    if (!(cv instanceof File)) {
      return throwError(() => new Error('A CV file is required.'));
    }

    return this.create({
      firstName,
      lastName,
      email,
      phone,
    } as Candidate).pipe(
      switchMap((candidate) => {
        const candidateId = candidate.id;

        if (!candidateId) {
          return throwError(() => new Error('The candidate could not be created.'));
        }

        return this.attachmentService.upload(candidateId, cv, 'CV').pipe(
          switchMap(() =>
            this.applicationService.create({
              candidateId,
              jobOfferId: jobId,
            }).pipe(map(() => candidate))
          )
        );
      }),
      catchError(this.handleError('submit application'))
    );
  }

  private handleError(operation: string) {
    return (error: HttpErrorResponse | Error): Observable<never> => {
      if (error instanceof Error && !(error as HttpErrorResponse).status) {
        return throwError(() => error);
      }

      const httpError = error as HttpErrorResponse;
      const serverMessage =
        typeof httpError.error === 'string'
          ? httpError.error
          : httpError.error?.message ?? httpError.error?.error ?? httpError.message;

      return throwError(
        () => new Error(serverMessage || `Unable to ${operation}. Please try again.`)
      );
    };
  }
}
