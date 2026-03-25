import { Component, OnInit } from '@angular/core';
import { JobOfferService } from '../../../../core/services/recruitment/job-offer';

@Component({
  selector: 'app-job-offers',
  standalone: false,
  templateUrl: './job-offers.html',
  styleUrl: './job-offers.scss',
})
export class JobOffers implements OnInit{
  jobs: any[] = [];
  showForm = false;

  constructor(private jobService: JobOfferService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.jobService.getAllPaged().subscribe(res => {
      this.jobs = res.content;
    });
  }

  delete(id: number) {
    this.jobService.delete(id).subscribe(() => this.load());
  }

}
