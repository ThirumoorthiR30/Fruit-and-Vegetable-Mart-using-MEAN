import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:4000/api/products'; // URL to your Express API
  private signupUrl = 'http://localhost:4000/api/user'; // URL to the signup API
  private loginUrl='http://localhost:4000/api/userlogin';
  private  l1='http://localhost:4000/api/userlogin/details';
  private purchaseUrl = 'http://localhost:4000/api/purchase'; 
  private l2='http://localhost:4000/api/users';
  constructor(private http: HttpClient) {}

  // Method to fetch all products
  placeOrder(orderData: any): Observable<any> {
    return this.http.post<any>(this.purchaseUrl, orderData);
  }
  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Method to update product quantity
  updateProductQuantity(productId: string, Quantity: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updateQuantity`, { productId, Quantity });
  }

  // Method to signup the user
  signupUser(userData: any): Observable<any> {
    return this.http.post<any>(this.signupUrl, userData);
  }
 loginUser(userData: any): Observable<any> {
    return this.http.post<any>(this.loginUrl, userData);
  }
  // Get logged-in user details
  // Method to get user details by email
  getUserDetails(email: string): Observable<any> {
    const url = 'http://localhost:4000/api/user-details'; // Updated URL for POST request
    return this.http.post<any>(url, { email }); // Send email in the request body
  }
  
  getPurchasesByEmail(email: string): Observable<any> {
    const url = 'http://localhost:4000/api/purchases-by-email';  // Endpoint to get purchases by email
    return this.http.post<any>(url, { email });  // Send email in the request body
  }
  
  

}
