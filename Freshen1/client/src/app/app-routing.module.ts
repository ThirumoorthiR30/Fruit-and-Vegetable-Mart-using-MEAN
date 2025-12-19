import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { FruitsComponent } from './fruits/fruits.component';
import { VegetableComponent } from './vegetable/vegetable.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AboutComponent } from './about/about.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProfileComponent } from './profile/profile.component'; // Add ProfileComponent import
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './guards/admin.guard'; // Import AdminGuard

const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Login route
  { path: 'profile', component: ProfileComponent }, // Profile route
  {
    path: '', // Base layout route
    children: [
      { path: '', component: HomeComponent }, // Default route (HomeComponent)
      { path: 'home', component: HomeComponent }, // Redundant but kept for clarity
      { path: 'cart', component: CartComponent },
      { path: 'fruits', component: FruitsComponent },
      { path: 'vegetable', component: VegetableComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'about', component: AboutComponent },
      { path: 'checkout', component: CheckoutComponent },
    ],
  },
  { path: 'admin', component: AdminComponent ,canActivate: [AdminGuard]},
  { path: '**', redirectTo: '' }, // Redirect unknown routes to Home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
