import { Component, Input } from '@angular/core';
import { Candidate } from '../../../../models/recruitment/candidate';
import { AttachmentService } from '../../../../core/services/recruitment/attachment';

@Component({
  selector: 'app-candidate-card',
  standalone: false,
  templateUrl: './candidate-card.html',
  styleUrl: './candidate-card.scss',
})
export class CandidateCard {
  @Input() candidate!: Candidate;

  constructor(private attachmentService: AttachmentService) {}

  downloadCv() {
    const cv = this.candidate.attachments?.find(a => a.category === 'CV');
    if (!cv?.id) return;

    this.attachmentService.download(cv.id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cv.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
