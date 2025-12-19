import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service'; // Assuming the AuthService is in the service folder

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const userRole = this.authService.getUserRole();
    if (userRole === 'admin') {
      return true; // Allow navigation to the admin page
    }

    // Redirect to the login page or any other page if not admin
    this.router.navigate(['/login']);
    return false;
  }
}
