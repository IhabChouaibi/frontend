import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth-service';

@Component({
  selector: 'app-profile-card',
  standalone: false,
  templateUrl: './profile-card.html',
  styleUrl: './profile-card.scss',
})
export class ProfileCard implements OnInit{
 username: string | null = '';

constructor(private authService: AuthService) {}

ngOnInit(): void {
  this.authService.getUsername$().subscribe(name => {
    this.username = name;
  });
}

}
