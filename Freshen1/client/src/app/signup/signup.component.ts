import { Component } from '@angular/core';
import { ProductService } from '../service/product.service';
import { Router } from '@angular/router'; // Import Router for navigation
import { AuthService } from '../service/auth.service'; 

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  // Form fields
  username: string = '';
  mobilenumber: string = '';
  address: string = '';
  pincode: string = '';
  email: string = '';
  password: string = '';

  // Success and error messages
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private productService: ProductService, private router: Router, private authService: AuthService 
  ) {}

  signup() {
    // Validate if the form is filled correctly
    if (this.username && this.mobilenumber && this.address && this.pincode && this.email && this.password) {
      const userData = {
        username: this.username,
        mobilenumber: this.mobilenumber,
        address: this.address,
        pincode: this.pincode,
        email: this.email,
        password: this.password,
        role: 'user'
      };

      // Call the productService to handle user registration
      this.productService.signupUser(userData).subscribe(
        (response) => {
          if (response.success) {
            // Success scenario
            this.successMessage = 'User registered successfully!';
            this.errorMessage = ''; // Clear error message if any

            this.authService.loginService(response.role,this.email); // Log the user in


            // Delay to display success message before redirecting
            setTimeout(() => {
              this.router.navigate(['/']); // Navigate to the home page after 2 seconds
            }, 2000); // 2-second delay
          }
        },
        (error) => {
          // Error scenario
          this.errorMessage = 'There was an error registering the user.';
          this.successMessage = ''; // Clear success message if any
        }
      );
    } else {
      this.errorMessage = 'Please fill out all fields correctly.';
    }
  }
}
