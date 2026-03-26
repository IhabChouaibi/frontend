import { Component } from '@angular/core';

import { InterviewService } from '../../../../core/services/recruitment/interview';
import { Interview } from '../../../../models/recruitment/interview';

@Component({
  selector: 'app-interviews',
  standalone: false,
  templateUrl: './interviews.html',
  styleUrl: './interviews.scss',
})
export class Interviews {
  interviews: Interview[] = [];
  showModal = false;
  selectedApplicationId = 0;

  constructor(private readonly interviewService: InterviewService) {}

  ngOnInit(): void {
    this.load();
  }

  openModal(applicationId: number): void {
    this.selectedApplicationId = applicationId;
    this.showModal = true;
  }

  load(): void {
    this.interviewService.getAllPaged().subscribe((res) => this.interviews = res.content);
  }
}
