import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { Employee } from '../../../models/employee-service/employee';
import { EmployeeListItem } from '../../../models/employee-service/employee-list-item';
import { Page } from '../../../models/recruitment/page';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly baseUrl = `${environment.apiUrl}${Path.employeePath}/api/employees`;

  constructor(private readonly http: HttpClient) {}

  getAll(page = 0, size = 10): Observable<Page<EmployeeListItem>> {
    return this.getPaginated(page, size);
  }

  getPaginated(page: number, size: number): Observable<Page<EmployeeListItem>> {
    return this.http
      .get<Page<EmployeeListItem>>(`${this.baseUrl}/getall`, {
        params: this.buildPageParams(page, size),
      })
      .pipe(catchError(this.handleError('load employees')));
  }

  getById(id: number): Observable<Employee> {
    return this.http
      .get<Employee>(`${this.baseUrl}/get/${id}`)
      .pipe(catchError(this.handleError(`load employee #${id}`)));
  }

  create(employee: Employee): Observable<Employee> {
    return this.http
      .post<Employee>(`${this.baseUrl}/create`, employee)
      .pipe(catchError(this.handleError('create employee')));
  }

  update(id: number, employee: Employee): Observable<Employee> {
    return this.http
      .put<Employee>(`${this.baseUrl}/update/${id}`, employee)
      .pipe(catchError(this.handleError(`update employee #${id}`)));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/delete/${id}`)
      .pipe(catchError(this.handleError(`delete employee #${id}`)));
  }

  search(keyword: string, page = 0, size = 10): Observable<Page<EmployeeListItem>> {
    const trimmedKeyword = keyword.trim();
    let params = this.buildPageParams(page, size);

    if (trimmedKeyword) {
      params = params.set('keyword', trimmedKeyword);
    }

    return this.http
      .get<Page<EmployeeListItem>>(`${this.baseUrl}/search`, { params })
      .pipe(catchError(this.handleError(`search employees with "${trimmedKeyword}"`)));
  }

  private buildPageParams(page: number, size: number): HttpParams {
    return new HttpParams()
      .set('page', String(page))
      .set('size', String(size));
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
