import { Component } from '@angular/core';

import { CandidateService } from '../../../../core/services/recruitment/candidate';
import { Candidate } from '../../../../models/recruitment/candidate';

@Component({
  selector: 'app-candidates',
  standalone: false,
  templateUrl: './candidates.html',
  styleUrl: './candidates.scss',
})
export class Candidates {
  candidates: Candidate[] = [];

  constructor(private readonly candidateService: CandidateService) {}

  ngOnInit(): void {
    this.candidateService.getAllPaged(0, 20).subscribe((res) => this.candidates = res.content);
  }
}
