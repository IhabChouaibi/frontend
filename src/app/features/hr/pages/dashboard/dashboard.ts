import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';

import { CandidateService } from '../../../../core/services/recruitment/candidate';
import { EmployeeService } from '../../../../core/services/employee-service/employee.service';
import { JobOfferService } from '../../../../core/services/recruitment/job-offer';
import { LeaveService } from '../../../../core/services/leave-service/leave.service';
import { PresenceService } from '../../../../core/services/presence-service/presence.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  stats = {
    employees: 0,
    pendingLeaves: 0,
    pendingPresence: 0,
    jobOffers: 0,
    candidates: 0
  };

  loading = false;
  error = '';

  constructor(
    private readonly employeeService: EmployeeService,
    private readonly leaveService: LeaveService,
    private readonly presenceService: PresenceService,
    private readonly jobService: JobOfferService,
    private readonly candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    forkJoin({
      employees: this.employeeService.getAll(0, 1),
      pendingLeaves: this.leaveService.getPending(0, 10),
      pendingPresence: this.presenceService.getPendingValidation(0, 10),
      jobOffers: this.jobService.getAllPaged(0, 1),
      candidates: this.candidateService.getAllPaged(0, 1)
    }).subscribe({
      next: ({ employees, pendingLeaves, pendingPresence, jobOffers, candidates }) => {
        this.stats = {
          employees: employees.totalElements,
          pendingLeaves: pendingLeaves.totalElements,
          pendingPresence: pendingPresence.totalElements,
          jobOffers: jobOffers.totalElements,
          candidates: candidates.totalElements
        };
        this.loading = false;
      },
      error: (error: Error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }
}
