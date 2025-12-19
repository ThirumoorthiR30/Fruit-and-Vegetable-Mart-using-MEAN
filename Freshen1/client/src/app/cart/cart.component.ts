import { Component, OnInit } from '@angular/core';
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';  // Import Router
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  pro: any[]=[];
  // Inject CartService and Router in the constructor
  constructor(private cartService: CartService,private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    // Get cart items when the component initializes
    this.cartItems = this.cartService.getCartItems();
    this.productService.getProducts().subscribe(data => {
    this.pro = data;
    console.log('Products:', this.pro);
  }); // print it to the console
  }

  // Method to remove an item from the cart
  removeFromCart(product: any): void {
    this.cartService.removeFromCart(product);
    this.cartItems = this.cartService.getCartItems(); // Update the cart after removal
  }

  // Method to increase the Quantity of a product
 increaseQuantity(product: any): void {
  const actualProduct = this.pro.find(p => p._id === product._id);

  if (actualProduct && product.Quantity < actualProduct.Quantity) {
    product.Quantity += 1;
    this.cartService.updateCartItem(product); // Optionally uhgfghgjhkjlkpdate the service
  } else {
    console.log('Cannot increase. Stock limit reached.');
  }

  console.log('Updated Quantity:', product.Quantity);
}


  // Method to decrease the quantity of a product
  decreaseQuantity(product: any): void {
    if (product.Quantity > 1) {
      product.Quantity -= 1;
      this.cartService.updateCartItem(product); // Optionally update the service for consistency
    }
  }

  // Method to calculate the total price of items in the cart
  getTotal(): number {
    return this.cartService.getTotal();
  }

  // Method to clear the cart
  clearCart(): void {
    this.cartService.clearCart();
    this.cartItems = []; // Update the cart after clearing
  }

  // Method to navigate to the checkout page
  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
