import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../../../../core/services/recruitment/candidate';

@Component({
  selector: 'app-candidates',
  standalone: false,
  templateUrl: './candidates.html',
  styleUrl: './candidates.scss',
})
export class Candidates implements OnInit {
    candidates: any[] = [];

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.candidateService.getAllPaged().subscribe(res => {
      this.candidates = res.content;
    });
  }

}
