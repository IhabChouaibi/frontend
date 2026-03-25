import { Component, OnInit } from '@angular/core';
import { InterviewService } from '../../../../core/services/recruitment/interview';

@Component({
  selector: 'app-interviews',
  standalone: false,
  templateUrl: './interviews.html',
  styleUrl: './interviews.scss',
})
export class Interviews implements OnInit {
  interviews: any[] = [];
  showModal = false;
  selectedApplicationId!: number;

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.interviewService.getAllPaged().subscribe(res => {
      this.interviews = res.content;
    });
  }

  openModal(appId: number) {
    this.selectedApplicationId = appId;
    this.showModal = true;
  }

}
