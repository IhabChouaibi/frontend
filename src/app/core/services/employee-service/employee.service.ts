import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../../enviroment/enviroment';
import { Path } from '../../../enums/path';
import { buildPageParams, createApiErrorHandler, debugApiRequest } from '../../http/api.utils';
import { CreateEmployeeRequestDto } from '../../../models/employee-service/create-employee-request.dto';
import { EmployeeListItemResponseDto } from '../../../models/employee-service/employee-list-item-response.dto';
import { EmployeeResponseDto } from '../../../models/employee-service/employee-response.dto';
import { UpdateEmployeeRequestDto } from '../../../models/employee-service/update-employee-request.dto';
import { PagedResponse } from '../../../models/shared/paged-response';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly baseUrl = `${environment.apiUrl}${Path.employeePath}/api/employees`;

  constructor(private readonly http: HttpClient) {}

  getAll(page = 0, size = 10): Observable<PagedResponse<EmployeeListItemResponseDto>> {
    return this.getPaginated(page, size);
  }

  getPaginated(page: number, size: number): Observable<PagedResponse<EmployeeListItemResponseDto>> {
    return this.http
      .get<PagedResponse<EmployeeListItemResponseDto>>(`${this.baseUrl}/getall`, {
        params: buildPageParams(page, size),
      })
      .pipe(
        map((response) => ({
          ...response,
          content: (response.content ?? []).map((item) => this.fromListItemResponse(item)),
        })),
        catchError(createApiErrorHandler('load employees'))
      );
  }

  getById(id: number): Observable<EmployeeResponseDto> {
    return this.http
      .get<EmployeeResponseDto>(`${this.baseUrl}/get/${id}`)
      .pipe(
        map((response) => this.fromEmployeeResponse(response)),
        catchError(createApiErrorHandler(`load employee #${id}`))
      );
  }

  create(payload: CreateEmployeeRequestDto): Observable<EmployeeResponseDto> {
    debugApiRequest('POST', `${this.baseUrl}/create`, payload);

    return this.http
      .post<EmployeeResponseDto>(`${this.baseUrl}/create`, payload)
      .pipe(
        map((response) => this.fromEmployeeResponse(response)),
        catchError(createApiErrorHandler('create employee'))
      );
  }

  update(id: number, payload: UpdateEmployeeRequestDto): Observable<EmployeeResponseDto> {
    debugApiRequest('PUT', `${this.baseUrl}/update/${id}`, payload);

    return this.http
      .put<EmployeeResponseDto>(`${this.baseUrl}/update/${id}`, payload)
      .pipe(
        map((response) => this.fromEmployeeResponse(response)),
        catchError(createApiErrorHandler(`update employee #${id}`))
      );
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/delete/${id}`)
      .pipe(catchError(createApiErrorHandler(`delete employee #${id}`)));
  }

  search(keyword: string, page = 0, size = 10): Observable<PagedResponse<EmployeeListItemResponseDto>> {
    const trimmedKeyword = keyword.trim();
    const params = buildPageParams(page, size, { keyword: trimmedKeyword });

    return this.http
      .get<PagedResponse<EmployeeListItemResponseDto>>(`${this.baseUrl}/search`, { params })
      .pipe(
        map((response) => ({
          ...response,
          content: (response.content ?? []).map((item) => this.fromListItemResponse(item)),
        })),
        catchError(createApiErrorHandler(`search employees with "${trimmedKeyword}"`))
      );
  }

  private fromEmployeeResponse(response: EmployeeResponseDto): EmployeeResponseDto {
    return {
      ...response,
      phone: response.phone ?? undefined,
      hireDate: response.hireDate ?? undefined,
      status: response.status ?? undefined,
      jobTitle: response.jobTitle ?? undefined,
      departmentCode: response.departmentCode ?? undefined,
    };
  }

  private fromListItemResponse(response: EmployeeListItemResponseDto): EmployeeListItemResponseDto {
    return {
      ...response,
      userId: response.userId ?? undefined,
      jobTitle: response.jobTitle ?? undefined,
      departmentCode: response.departmentCode ?? undefined,
    };
  }
}
