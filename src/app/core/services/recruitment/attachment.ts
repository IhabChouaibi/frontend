import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { buildPageParams, createApiErrorHandler, debugApiRequest } from '../../http/api.utils';
import { AttachmentResponseDto } from '../../../models/recruitment/attachment-response.dto';
import { AttachmentUploadRequestDto } from '../../../models/recruitment/attachment-upload-request.dto';
import { PagedResponse } from '../../../models/shared/paged-response';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  private readonly baseUrl = `${environment.apiUrl}${Path.recruitment}/attachments`;

  constructor(private readonly http: HttpClient) {}

  upload(payload: AttachmentUploadRequestDto): Observable<AttachmentResponseDto> {
    const formData = new FormData();
    formData.append('candidateId', payload.candidateId.toString());
    formData.append('file', payload.file);

    if (payload.category) {
      formData.append('category', payload.category);
    }

    debugApiRequest('POST', `${this.baseUrl}/upload`, {
      candidateId: payload.candidateId,
      fileName: payload.file.name,
      category: payload.category ?? undefined,
    });

    return this.http
      .post<AttachmentResponseDto>(`${this.baseUrl}/upload`, formData)
      .pipe(catchError(createApiErrorHandler('upload attachment')));
  }

  download(id: number): Observable<Blob> {
    return this.http
      .get(`${this.baseUrl}/download/${id}`, { responseType: 'blob' })
      .pipe(catchError(createApiErrorHandler(`download attachment #${id}`)));
  }

  getById(id: number): Observable<AttachmentResponseDto> {
    return this.http
      .get<AttachmentResponseDto>(`${this.baseUrl}/get/${id}`)
      .pipe(catchError(createApiErrorHandler(`load attachment #${id}`)));
  }

  update(id: number, file?: File, category?: string): Observable<AttachmentResponseDto> {
    const formData = new FormData();

    if (file) {
      formData.append('file', file);
    }

    if (category) {
      formData.append('category', category);
    }

    debugApiRequest('PUT', `${this.baseUrl}/update/${id}`, {
      fileName: file?.name,
      category: category ?? undefined,
    });

    return this.http
      .put<AttachmentResponseDto>(`${this.baseUrl}/update/${id}`, formData)
      .pipe(catchError(createApiErrorHandler(`update attachment #${id}`)));
  }

  getAllByCandidatePaged(candidateId: number, page = 0, size = 10): Observable<PagedResponse<AttachmentResponseDto>> {
    const params = buildPageParams(page, size);

    return this.http
      .get<PagedResponse<AttachmentResponseDto>>(`${this.baseUrl}/candidate/${candidateId}`, { params })
      .pipe(catchError(createApiErrorHandler(`load attachments for candidate #${candidateId}`)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/delete/${id}`)
      .pipe(catchError(createApiErrorHandler(`delete attachment #${id}`)));
  }
}
