import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DepartmentRequestDto } from '../../../models/organisation-service/department-request.dto';
import { DepartmentResponseDto } from '../../../models/organisation-service/department-response.dto';
import { PagedResponse } from '../../../models/shared/paged-response';
import { OrganizationService } from './organization.service';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private readonly organizationService: OrganizationService) {}

  addDepartment(department: DepartmentRequestDto): Observable<DepartmentResponseDto> {
    return this.organizationService.createDepartment(department);
  }

  getDepartmentById(id: number): Observable<DepartmentResponseDto> {
    return this.organizationService.getById(id);
  }

  updateDepartment(id: number, department: DepartmentRequestDto): Observable<DepartmentResponseDto> {
    return this.organizationService.updateDepartment(id, department);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.organizationService.deleteDepartment(id);
  }

  getAllDepartmentsPaged(page: number = 0, size: number = 10): Observable<PagedResponse<DepartmentResponseDto>> {
    return this.organizationService.getAll({ page, size });
  }

  getDepartmentByCode(code: string): Observable<DepartmentResponseDto> {
    return this.organizationService.getDepartmentByCode(code);
  }
}
