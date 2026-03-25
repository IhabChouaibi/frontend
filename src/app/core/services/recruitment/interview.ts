import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interview } from '../../../models/recruitment/interview';
import { Page } from '../../../models/recruitment/page';

@Injectable({
  providedIn: 'root',
})
export class InterviewService {

  private baseUrl = environment.apiUrl + Path.recruitment+"/interview";

  constructor(private http: HttpClient) {}

  // 🔥 PAGINATION (IMPORTANT)
  getAllPaged(page: number = 0, size: number = 10, applicationId?: number): Observable<Page<Interview>> {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size));

    const endpoint = applicationId !== undefined
      ? `${this.baseUrl}/getall?applicationId=${applicationId}`
      : `${this.baseUrl}/getall`;

    return this.http.get<Page<Interview>>(endpoint, { params });
  }

  getById(id: number): Observable<Interview> {
    return this.http.get<Interview>(`${this.baseUrl}/get/${id}`);
  }


  update(id: number, interview: Interview): Observable<Interview> {
    return this.http.put<Interview>(`${this.baseUrl}/interviews/${id}`, interview);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  // 🔥 PLANIFIER INTERVIEW
  schedule(data: {
    applicationId: number;
    date: string;
    type: string;
  }): Observable<Interview> {
    return this.http.post<Interview>(
      `${this.baseUrl}/schedule`,
      data
    );
  }



}
