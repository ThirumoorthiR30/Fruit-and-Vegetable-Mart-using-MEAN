import { Component, OnInit } from '@angular/core';
import { CartService } from '../service/cart.service';
import { ProductService } from '../service/product.service';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;

  constructor(private cartService: CartService,
    private productService: ProductService,
    private authservice:AuthService,
    private router:Router
  ) {}

  ngOnInit(): void {
    // Get cart items when the component initializes
    this.cartItems = this.cartService.getCartItems();
    this.totalAmount = this.cartService.getTotal();
  }

  // Method to calculate the total price of items in the cart
  getTotal(): number {
    return this.cartService.getTotal();
  }
  confirm(): void {
    const user_email = this.authservice.mail; // Get logged-in user email
    const orderData = {
      user_email: user_email, // User's email
      cartItems: this.cartItems.map(item => ({
        productName: item.name,
        productPrice: item.price,
        quantity: item.Quantity,
        totalPrice: item.price * item.Quantity
      })),
      totalAmount: this.getTotal(),
      orderDate: new Date() // Save order date
    };
    console.log("data:",orderData);
    this.productService.placeOrder(orderData).subscribe(
      (response) => {
        console.log('Order saved successfully:', response);
        alert('Order confirmed successfully!');
        this.router.navigate(['/home']);
        this.cartService.clearCart(); // Clear cart after order placement
      },
      (error) => {
        console.error('Error saving order:', error);
        alert('Failed to confirm the order. Please try again.');
      }
    );
  }
  
}
