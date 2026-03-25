import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Department } from '../../../models/organisation-service/department';
import { Page } from '../../../models/recruitment/page';
import { OrganizationService } from './organization.service';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private readonly organizationService: OrganizationService) {}

  addDepartment(department: Department): Observable<Department> {
    return this.organizationService.createDepartment(department);
  }

  getDepartmentById(id: number): Observable<Department> {
    return this.organizationService.getById(id);
  }

  updateDepartment(id: number, department: Department): Observable<Department> {
    return this.organizationService.updateDepartment(id, department);
  }

  deleteDepartment(id: number): Observable<void> {
    return this.organizationService.deleteDepartment(id);
  }

  getAllDepartmentsPaged(page: number = 0, size: number = 10): Observable<Page<Department>> {
    return this.organizationService.getAll({ page, size });
  }

  getDepartmentByCode(code: string): Observable<Department> {
    return this.organizationService.getDepartmentByCode(code);
  }
}
