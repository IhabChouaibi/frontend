import { Component, OnInit } from '@angular/core';
import { JobOfferService } from '../../../../core/services/recruitment/job-offer';
import { CandidateService } from '../../../../core/services/recruitment/candidate';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit{
  stats = {
    jobs: 0,
    candidates: 0
  };

  constructor(
    private jobService: JobOfferService,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats() {
    this.jobService.getAllPaged().subscribe(res => {
      this.stats.jobs = res.totalElements;
    });

    this.candidateService.getAllPaged().subscribe(res => {
      this.stats.candidates = res.totalElements;
    });
  }

}
