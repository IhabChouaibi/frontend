import { Component } from '@angular/core';
import { JobOfferService } from '../../../core/services/recruitment/job-offer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-offers',
  standalone: false,
  templateUrl: './job-offers.html',
  styleUrl: './job-offers.scss',
})
export class JobOffers {
  jobOffers: any[] = [];
  loading = true;
  totalPages=0 ;

  constructor(private jobService: JobOfferService
    , private router: Router) {}

  ngOnInit(): void {
   this.jobService.getAllPaged(0, 10, 'developer').subscribe({
  next: (page) => {
    this.jobOffers = page.content;
    this.totalPages = page.totalPages;
  },
  error: (err) => console.error(err)
});
  }

  apply(id: number) {
    this.router.navigate(['/public/apply', id]);
  }

}
