import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { JobOfferService } from '../../../core/services/recruitment/job-offer';
import { JobOffer } from '../../../models/recruitment/job-offer';

@Component({
  selector: 'app-job-offers',
  standalone: false,
  templateUrl: './job-offers.html',
  styleUrl: './job-offers.scss',
})
export class JobOffers {
  readonly fallbackOffers: JobOffer[] = [
    {
      id: 1,
      title: 'Angular Frontend Engineer',
      description: 'Concevoir des interfaces premium et modulaires pour des plateformes RH et digitales.',
      location: 'Tunis / Hybrid',
      employmentType: 'Full time',
      experienceLevel: 'Mid-Senior'
    },
    {
      id: 2,
      title: 'Spring Boot Backend Engineer',
      description: 'Construire des microservices robustes pour des projets e-Government et e-Finance.',
      location: 'Tunis / On-site',
      employmentType: 'Full time',
      experienceLevel: 'Senior'
    },
    {
      id: 3,
      title: 'Business Consultant',
      description: 'Accompagner la reingenierie, la digitalisation et la transformation des processus metier.',
      location: 'Tunisia',
      employmentType: 'Consulting',
      experienceLevel: 'Experienced'
    }
  ];

  jobOffers: JobOffer[] = [];
  loading = true;

  constructor(
    private readonly jobService: JobOfferService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.jobService.getAllPaged(0, 12).subscribe({
      next: (page) => {
        this.jobOffers = page.content.length ? page.content : this.fallbackOffers;
        this.loading = false;
      },
      error: () => {
        this.jobOffers = this.fallbackOffers;
        this.loading = false;
      }
    });
  }

  apply(id?: number): void {
    if (!id) {
      return;
    }

    this.router.navigate(['/apply', id]);
  }
}
