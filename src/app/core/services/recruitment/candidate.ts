import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../../models/recruitment/page';
import { Candidate } from '../../../models/recruitment/candidate';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private baseUrl = environment.apiUrl + Path.recruitment+"/candidate"
    constructor(private http: HttpClient) {}


  getAllPaged(page: number = 0, size: number = 10, search?: string): Observable<Page<Candidate>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<Page<Candidate>>(`${this.baseUrl}/getall`, { params });
  }
  getById(id: number): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.baseUrl}/get/${id}`);
  }

  create(candidate: Candidate): Observable<Candidate> {
    return this.http.post<Candidate>(`${this.baseUrl}/create`, candidate);
  }

  update(id: number, candidate: Candidate): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.baseUrl}/update/${id}`, candidate);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
  // manque dans backend
    apply(jobId: number, formData: FormData): Observable<Candidate> {
    return this.http.post<Candidate>(`${this.baseUrl}/apply/${jobId}`, formData);
  }


}
