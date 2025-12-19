import { Component } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private productService: ProductService, private router: Router, private authService: AuthService) {}

  login() {
    const userData = {
      email: this.email,
      password: this.password
    };
    this.productService.loginUser(userData).subscribe(
      (response: any) => {
        if (response.success) {
          this.successMessage = 'Login successful! Redirecting...';

          // Log the user in and store the role in AuthService
          this.authService.loginService(response.role,this.email); 
          
          // Redirect based on user role
          setTimeout(() => {
            if (response.role === 'admin') {
              this.router.navigate(['/admin']); // Redirect to admin page
            } else {
              this.router.navigate(['/']); // Redirect to home page
            }
          }, 2000); // 2-second delay for displaying the success message
        }
      },
      (error) => {
        this.errorMessage = error.error?.message || 'Invalid email or password.';
      }
    );
  }
}
