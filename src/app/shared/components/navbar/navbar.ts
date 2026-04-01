import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../core/services/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  username: string | null = null;
  role: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUser();

    // Si le username peut changer dynamiquement
    this.authService.getUsername$().subscribe(u => this.username = u);
    this.authService.getRole$().subscribe(r => this.role = r);
  }

  loadUser() {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      this.username = user?.username ?? null;
      this.role = user?.roles.length ? user.roles[0] : null;
    } else {
      this.username = null;
      this.role = null;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
