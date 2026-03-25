import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Application } from '../../../models/recruitment/application';
import { Page } from '../../../models/recruitment/page';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {

  private baseUrl = environment.apiUrl + Path.recruitment+"/applications";

  constructor(private http: HttpClient) {}

  getAllPaged(page: number = 0, size: number = 10): Observable<Page<Application>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    return this.http.get<Page<Application>>(`${this.baseUrl}/getall`, { params });
  }

  getById(id: number): Observable<Application> {
    return this.http.get<Application>(`${this.baseUrl}/get/${id}`);
  }

  create(application: Application): Observable<Application> {
    return this.http.post<Application>(`${this.baseUrl}/create`, application);
  }

  update(id: number, application: Application): Observable<Application> {
    return this.http.put<Application>(`${this.baseUrl}/update/${id}`, application);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  // 🔥 APPROVE / REJECT
  approve(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/applications/${id}/approve`, {});
  }

  reject(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/applications/${id}/reject`, {});
  }

  // 🔥 DOWNLOAD CV (MinIO)
  downloadCv(cvId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/files/${cvId}`, {
      responseType: 'blob'
    });
  }

  // 🔥 BY CANDIDATE
  getByCandidatePaged(candidateId: number, page: number = 0, size: number = 10): Observable<Page<Application>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    return this.http.get<Page<Application>>(
      `${this.baseUrl}/getall/${candidateId}`,
      { params }
    );
  }
}
