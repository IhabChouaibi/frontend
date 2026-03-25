import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { JobOffer } from '../../../models/recruitment/job-offer';
import { Page } from '../../../models/recruitment/page';

@Injectable({
  providedIn: 'root',
})
export class JobOfferService {
  private baseUrl = environment.apiUrl + Path.recruitment+"/job-offers"

  constructor(private http: HttpClient) {}
  getAllPaged(page: number = 0, size: number = 10, search?: string): Observable<Page<JobOffer>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<Page<JobOffer>>(this.baseUrl, { params });
  }

  getById(id: number): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.baseUrl}/get/${id}`);
  }

  create(jobOffer: JobOffer): Observable<JobOffer> {
    return this.http.post<JobOffer>(`${this.baseUrl}/create`, jobOffer);
  }

  update(id: number, jobOffer: JobOffer): Observable<JobOffer> {
    return this.http.put<JobOffer>(`${this.baseUrl}/update/${id}`, jobOffer);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
