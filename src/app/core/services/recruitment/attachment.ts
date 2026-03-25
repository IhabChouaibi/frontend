import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Attachment } from '../../../models/recruitment/attachment';
import { Page } from '../../../models/recruitment/page';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
 private baseUrl = `${environment.apiUrl}${Path.recruitment}/attachments`;

  constructor(private http: HttpClient) {}

  upload(candidateId: number, file: File, category?: string): Observable<Attachment> {
    const formData = new FormData();
    formData.append('candidateId', candidateId.toString());
    formData.append('file', file);
    if (category) formData.append('category', category);

    return this.http.post<Attachment>(`${this.baseUrl}/upload`, formData);
  }

  download(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${id}`, { responseType: 'blob' });
  }

  getAllByCandidatePaged(candidateId: number, page: number = 0, size: number = 10): Observable<Page<Attachment>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<Attachment>>(`${this.baseUrl}/candidate/${candidateId}`, { params });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  //update manqué
}
