import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidateService } from '../../../core/services/recruitment/candidate';
import { ActivatedRoute, Router } from '@angular/router';
import { AttachmentService } from '../../../core/services/recruitment/attachment';

@Component({
  selector: 'app-apply',
  standalone: false,
  templateUrl: './apply.html',
  styleUrl: './apply.scss',
})
export class Apply {
  form: FormGroup;
  loading = false;
  jobId : number ;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private candidateService: CandidateService,
    private attachmentService: AttachmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      cv: [null, Validators.required]
    });
        this.jobId = +this.route.snapshot.params['id'];

  }

  ngOnInit(): void {
    this.jobId = +this.route.snapshot.params['id'];
  }

  // Gestion du fichier
  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.form.patchValue({ cv: this.selectedFile });
    }
  }

  // Soumission du formulaire
  submit() {
    if (this.form.invalid || !this.selectedFile) return;

    this.loading = true;

    // Préparer FormData pour upload
    const formData = new FormData();
    formData.append('name', this.form.get('name')?.value);
    formData.append('email', this.form.get('email')?.value);
    formData.append('phone', this.form.get('phone')?.value);
    formData.append('cv', this.selectedFile);

    // Appel CandidateService.apply()
    this.candidateService.apply(this.jobId, formData).subscribe({
      next: (res) => {
        this.loading = false;
        alert('Application submitted successfully!');
        this.router.navigate(['/public']);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert('Error submitting application!');
      }
    });
  }

}
