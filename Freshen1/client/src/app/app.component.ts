import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Fix: Change 'styleUrl' to 'styleUrls'
})
export class AppComponent {
  showLayout: boolean = true;

  constructor(private router: Router, private authService: AuthService) {
    // Listen to route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Hide layout when the user is on the admin page
        this.showLayout = !event.url.includes('/admin');
      }
    });
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  signup(): void {
    this.router.navigate(['/signup']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    this.authService.logoutService();
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedInService();
  }
}
