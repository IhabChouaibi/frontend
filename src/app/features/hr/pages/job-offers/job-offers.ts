import { Component } from '@angular/core';

import { JobOfferService } from '../../../../core/services/recruitment/job-offer';
import { JobOffer } from '../../../../models/recruitment/job-offer';

@Component({
  selector: 'app-job-offers',
  standalone: false,
  templateUrl: './job-offers.html',
  styleUrl: './job-offers.scss',
})
export class JobOffers {
  jobs: JobOffer[] = [];
  selectedJob?: JobOffer;
  showForm = false;

  constructor(private readonly jobService: JobOfferService) {}

  ngOnInit(): void {
    this.load();
  }

  openCreate(): void {
    this.selectedJob = undefined;
    this.showForm = true;
  }

  openEdit(job: JobOffer): void {
    this.selectedJob = job;
    this.showForm = true;
  }

  delete(id?: number): void {
    if (!id) {
      return;
    }

    this.jobService.delete(id).subscribe(() => this.load());
  }

  load(): void {
    this.jobService.getAllPaged().subscribe((res) => this.jobs = res.content);
  }
}
