import { Component, OnInit } from '@angular/core';
import { ProductService } from '../service/product.service'; // Adjust the import path based on your folder structure
import { CartService } from '../service/cart.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-vegetable',
  templateUrl: './vegetable.component.html',
  styleUrls: ['./vegetable.component.css'], // Ensure you have a corresponding CSS file
})
export class VegetableComponent implements OnInit {
  vegetables: any[] = []; // Array to hold only vegetables

  constructor(private productService: ProductService,
    private cartService: CartService , private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        // Filter products to include only those with type 'vegetable'
        this.vegetables = response.data.filter((product: any) => product.type === 'Vegetable');
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }
  addToCart(vegetable: any): void {
    if (!this.authService.isLoggedInService()) {
      this.showNotificationAtCenter('You need to log in to add items to the cart.', 'error');
      return;
    }

    if (vegetable.Quantity <= 0) {
      this.showNotificationAtCenter('Sorry, this product is out of stock.', 'error');
      return;
    }

    this.cartService.addToCart(vegetable);
    vegetable.Quantity--;
    this.showNotificationAtCenter('Product added to cart successfully!', 'success');
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