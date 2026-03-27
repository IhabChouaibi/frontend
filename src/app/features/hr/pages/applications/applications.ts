import { Component } from '@angular/core';

import { ApplicationService } from '../../../../core/services/recruitment/application';
import { Application } from '../../../../models/recruitment/application';

@Component({
  selector: 'app-applications',
  standalone: false,
  templateUrl: './applications.html',
  styleUrl: './applications.scss',
})
export class Applications {
  applications: Application[] = [];
  showInterviewModal = false;
  selectedApplicationId: number | null = null;

  constructor(private readonly appService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  schedule(applicationId: number): void {
    this.selectedApplicationId = applicationId;
    this.showInterviewModal = true;
  }

  loadApplications(): void {
    this.appService.getAllPaged().subscribe((res) => this.applications = res.content);
  }
}
