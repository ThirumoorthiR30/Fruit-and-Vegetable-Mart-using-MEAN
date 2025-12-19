// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: any[] = []; // Holds the items in the cart

  constructor() {}

  // Method to add a product to the cart, or increase the quantity if it already exists
  addToCart(product: any): void {
    const existingProduct = this.cart.find(item => item.name === product.name);
    if (existingProduct) {
      existingProduct.Quantity += 1;
    } else {
      this.cart.push({ ...product, Quantity: 1 });
    }
  }

  // Method to get all cart items
  getCartItems(): any[] {
    return this.cart;
  }

  // Method to remove an item from the cart
  removeFromCart(product: any): void {
    this.cart = this.cart.filter(item => item !== product);
  }

  // Method to clear the cart
  clearCart(): void {
    this.cart = [];
  }

  // Method to update an item's quantity in the cart
  updateCartItem(updatedProduct: any): void {
    const product = this.cart.find(item => item.name === updatedProduct.name);
    if (product) {
      product.Quantity = updatedProduct.Quantity;
    }
  }

  // Method to calculate the total price of items in the cart
  getTotal(): number {
    return this.cart.reduce((total, item) => total + item.price * item.Quantity, 0);
  }
}
