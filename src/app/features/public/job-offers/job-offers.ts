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
  readonly expertiseAreas = [
    'e-Government',
    'Digitalisation des procedures',
    'Workflow platforms',
    'Archivage electronique / GED',
    'Plateformes d echange de donnees',
    'e-Finance',
    'Marche financier et bourse',
    'Banques et societes de gestion',
    'ERP metiers',
    'Consulting et ingenierie des solutions'
  ];

  readonly keyValues = [
    'Processus d amelioration continue',
    'Ethique des affaires appliquee au quotidien',
    'Expertise technique et fonctionnelle',
    'Pilotage PMI et execution Agile'
  ];

  jobOffers: JobOffer[] = [];
  loading = true;
  totalPages = 0;

  constructor(
    private readonly jobService: JobOfferService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.jobService.getAllPaged(0, 6).subscribe({
      next: (page) => {
        this.jobOffers = page.content;
        this.totalPages = page.totalPages;
        this.loading = false;
      },
      error: () => {
        this.jobOffers = [];
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
