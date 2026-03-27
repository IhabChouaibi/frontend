import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { Attachment } from '../../../models/recruitment/attachment';
import { Page } from '../../../models/recruitment/page';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  private readonly baseUrl = `${environment.apiUrl}${Path.recruitment}/attachments`;

  constructor(private readonly http: HttpClient) {}

  upload(candidateId: number, file: File, category?: string): Observable<Attachment> {
    const formData = new FormData();
    formData.append('candidateId', candidateId.toString());
    formData.append('file', file);

    if (category) {
      formData.append('category', category);
    }

    return this.http
      .post<Attachment>(`${this.baseUrl}/upload`, formData)
      .pipe(catchError(this.handleError('upload attachment')));
  }

  download(id: number): Observable<Blob> {
    return this.http
      .get(`${this.baseUrl}/download/${id}`, { responseType: 'blob' })
      .pipe(catchError(this.handleError(`download attachment #${id}`)));
  }

  getById(id: number): Observable<Attachment> {
    return this.http
      .get<Attachment>(`${this.baseUrl}/get/${id}`)
      .pipe(catchError(this.handleError(`load attachment #${id}`)));
  }

  update(id: number, file?: File, category?: string): Observable<Attachment> {
    const formData = new FormData();

    if (file) {
      formData.append('file', file);
    }

    if (category) {
      formData.append('category', category);
    }

    return this.http
      .put<Attachment>(`${this.baseUrl}/update/${id}`, formData)
      .pipe(catchError(this.handleError(`update attachment #${id}`)));
  }

  getAllByCandidatePaged(candidateId: number, page = 0, size = 10): Observable<Page<Attachment>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    return this.http
      .get<Page<Attachment>>(`${this.baseUrl}/candidate/${candidateId}`, { params })
      .pipe(catchError(this.handleError(`load attachments for candidate #${candidateId}`)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/delete/${id}`)
      .pipe(catchError(this.handleError(`delete attachment #${id}`)));
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
