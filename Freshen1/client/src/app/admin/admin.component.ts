import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../service/auth.service'; 
import { Router } from '@angular/router';  

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  products: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService, private router: Router ) {}

  ngOnInit(): void {
    const userRole = this.authService.getUserRole();
    console.log('User Role:', userRole); // Check if user role is 'admin'
    if (userRole !== 'admin') {
      this.router.navigate(['/login']);
    } else {
      this.fetchProducts();
    }
  }
  logout()
  {
    this.authService.logoutService();
    this.router.navigate(['/']); 
  }
  fetchProducts(): void {
    this.http.get('http://localhost:4000/api/admin/products').subscribe({
      next: (response: any) => {
        console.log('API response:', response);  // Check the response in the console
        if (response && response.success) {
          this.products = response.data;
        } else {
          console.error('Failed to fetch products:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }

  updateQuantity(product: any): void {
    const updatedQuantity = parseInt(product.updatedQuantity, 10);

    if (isNaN(updatedQuantity) || updatedQuantity < 0) {
      alert('Please enter a valid quantity');
      return;
    }

    this.http
      .put('http://localhost:4000/api/products/updateQuantity', { productId: product._id, Quantity: updatedQuantity })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('Quantity updated successfully');
            // Update the local product list to reflect the new quantity
            console.log(updatedQuantity);
            product.Quantity = updatedQuantity; // Sync with the updated quantity
            product.updatedQuantity = null; // Clear the updated quantity input field
          } else {
            alert('Failed to update quantity');
          }
        },
        error: (error) => {
          console.error('Error updating quantity:', error);
          alert('Failed to update quantity');
        },
      });
  }
}
