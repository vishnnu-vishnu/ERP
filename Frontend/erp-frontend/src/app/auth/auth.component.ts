import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = ''; 
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: LoginService,
    private router: Router 
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid || this.loading) {
      return; 
    }
  
    this.loading = true;
    this.successMessage = '';  
    this.errorMessage = '';  
  
    const loginData = this.loginForm.value;
  
    this.authService.login(loginData).subscribe(
      (response) => {
        console.log('Login successful', response);
  
        const user_type = response.user_type;  
        this.successMessage = 'Login successful!'; 
        if("access" in response){
          localStorage.setItem('access_token', response.access);
        }
  
        setTimeout(() => {
          if (user_type === 'Admin') {
            this.router.navigate(['/admin']);
          } else if (user_type === 'SalesStaff') {
            this.router.navigate(['/products']);
          } else if (user_type === 'WarehouseStaff') {
            this.router.navigate(['/warehouse']);
          } else {
            this.errorMessage = 'Unrecognized role. Please contact support.';
          }
        }, 1000);
      },
      (error) => {
        this.loading = false;
        console.error('Error logging in:', error);
        this.errorMessage = 'Invalid username or password. Please try again.';
      }
    );

    
  }
  logout() {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}  