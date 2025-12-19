import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public email: string;
  public userDetails: any;
  public purchases: any[] = [];  // To store purchase data
  public un: string = '';
  public num: number = 0;
  public add: string = '';
  public pc: number = 0;

  constructor(private as: AuthService, private gu: ProductService) {
    this.email = this.as.mail;  // Assuming AuthService provides the logged-in user's email
  }

  ngOnInit(): void {
    // Fetch user details after the component is initialized
    this.gu.getUserDetails(this.email).subscribe(
      (data) => {
        this.userDetails = data.user;
        this.un = this.userDetails.username;
        this.num = this.userDetails.mobilenumber;
        this.add = this.userDetails.address;
        this.pc = this.userDetails.pincode;
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );

    // Fetch user purchase data
    this.gu.getPurchasesByEmail(this.email).subscribe(
      (response) => {
        if (response.success) {
          this.purchases = response.data;
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error('Error fetching purchase data:', error);
      }
    );
  }
}
