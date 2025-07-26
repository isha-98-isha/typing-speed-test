import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  user: SocialUser | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: SocialAuthService
  ) { }

  ngOnInit(): void {
    this.initializeForm();

    // Check if user is already logged in with Google
    this.authService.authState.subscribe((user: SocialUser) => {
      this.user = user;
      if (user) {
        console.log('User already logged in:', user);
        this.router.navigate(['/level-selection']);
      }
    });
  }

  private initializeForm(): void {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  // Traditional form signup
onSubmit(): void {
  if (this.signupForm.valid) {
    const formData = this.signupForm.value;

    // Get existing users from localStorage or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if the email is already registered
    const userExists = existingUsers.some((user: any) => user.email === formData.email);

    if (userExists) {
      alert('User with this email already exists. Please login instead.');
      return;
    }

    // New user object
    const newUser = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      registrationDate: new Date().toISOString()
    };

    // Push new user and save updated array
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    alert(`Welcome ${formData.name}! Account created successfully. Please login to continue.`);
    this.router.navigate(['/login']);
  } else {
    this.markFormGroupTouched();
  }
}


  // Google OAuth signup
  signUpWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((user: SocialUser) => {
      this.user = user;
      console.log('Google user:', user);

      localStorage.setItem('googleUser', JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        photoUrl: user.photoUrl,
        provider: user.provider
      }));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loginMethod', 'google');

      alert(`Welcome ${user.name}! Account created successfully via Google`);
      this.router.navigate(['/level-selection']);
    }).catch(err => {
      console.error('Google signup error details:', err);
      if (err.error === 'popup_closed_by_user') {
        alert('Signup cancelled by user');
      } else if (err.error === 'idpiframe_initialization_failed') {
        alert('Google signup configuration error. Please check your setup.');
      } else {
        alert('Google signup failed. Please check your internet connection and try again.');
      }
    });
  }

  // Mark all form fields as touched to show validation errors
  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getter methods for template access
  get name() { return this.signupForm.get('name'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
}