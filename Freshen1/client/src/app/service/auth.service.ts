import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   loggedIn: boolean = false;
   role: string = ''; 
   mail: string ='';
   mn: number = 0; 
   add: string='';
   pin : number=0;
   un:string='';
  isLoggedInService(): boolean {
    return this.loggedIn;
  }

  loginService(role: string,mail:string): void { // Accept role when logging in
    this.loggedIn = true;
    this.role = role;
    this.mail=mail;
  }

  logoutService(): void {
    this.loggedIn = false;
    this.role = ''; // Clear role on logout
  }

  getUserRole(): string {
    return this.role; // Return the stored role
  }
}
