import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../../../../core/services/recruitment/application';

@Component({
  selector: 'app-applications',
  standalone: false,
  templateUrl: './applications.html',
  styleUrl: './applications.scss',
})
export class Applications implements OnInit  {


  applications: any[] = [];

  constructor(private appService: ApplicationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {
    this.appService.getAllPaged().subscribe(res => {
      this.applications = res.content;
    });
  }
}
