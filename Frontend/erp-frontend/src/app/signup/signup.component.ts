import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = ''; 
  successMessage: string = ''; 
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router  
  ) {
    this.signupForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.signupForm.invalid || this.loading) {
      return; 
    }

    this.loading = true;
    this.successMessage = '';  
    this.errorMessage = '';  
    const signupData = this.signupForm.value;

    this.authService.signup(signupData).subscribe(
      (response) => {
        console.log('Signup successful', response);
        this.successMessage = 'Signup successful!'; 
        setTimeout(() => {
          this.router.navigate(['/login']);  
        }, 2000);  
      },
      (error) => {
        this.loading = false;
        console.error('Error signing up:', error);
        this.errorMessage = 'There was an error during signup. Please try again.'; 
      }
    );
  }
}
