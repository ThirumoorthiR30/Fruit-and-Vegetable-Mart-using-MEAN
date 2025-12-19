import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../service/product.service';
import { CartService } from '../service/cart.service';
import { AuthService } from '../service/auth.service'; 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  error: string = '';
  searchQuery: string = '';
  notification = { message: '', type: '' };

  constructor(
    private http: HttpClient,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (response) => {
        if (response.success) {
          this.products = response.data;
          this.filteredProducts = [...this.products];
        }
      },
      (error) => {
        this.error = 'Failed to fetch products. Please try again later.';
        console.error(error);
      }
    );
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  addToCart(product: any): void {
    if (!this.authService.isLoggedInService()) {
        this.showNotificationAtCenter('You need to log in to add items to the cart.', 'error');
        return;
    }

    if (product.Quantity <= 0) {
        this.showNotificationAtCenter('Sorry, this product is out of stock.', 'error');
        return;
    }

    this.cartService.addToCart(product);
    product.Quantity--;
    this.showNotificationAtCenter('Product added to cart successfully!', 'success');
}
updateQuantity(product: any): void {
    const updatedQuantity = parseInt(product.updatedQuantity, 10);

    if (isNaN(updatedQuantity) || updatedQuantity < 0) {
      alert('Please enter a valid quantity');
      return;
    }

    this.http.put('http://localhost:4000/api/products/updateQuantity', { productId: product._id, quantity: updatedQuantity })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            alert('Quantity updated successfully');
            // Update the local product list to reflect the new quantity
            product.quantity = updatedQuantity; // Sync with the updated quantity
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
/**
 * Displays a notification at the center of the page.
 * @param message The notification message.
 * @param type The notification type ('success', 'error', etc.).
 */
showNotificationAtCenter(message: string, type: string): void {
    const notificationElement = document.createElement('div');
    notificationElement.innerText = message;

    // Apply styles for centering
    Object.assign(notificationElement.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: type === 'error' ? '#f44336' : '#4caf50', // Red for error, green for success
        color: '#fff',
        padding: '1rem',
        borderRadius: '0.5rem',
        textAlign: 'center',
        zIndex: '1000',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    });

    document.body.appendChild(notificationElement);

    // Remove notification after 3 seconds
    setTimeout(() => {
        document.body.removeChild(notificationElement);
    }, 3000);
}

}
