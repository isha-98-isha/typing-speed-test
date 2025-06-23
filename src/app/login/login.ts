import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';

// Declare the global 'google' object for TypeScript
declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit {
  loginForm: any;
  forgotPasswordForm: any;
  resetPasswordForm: any;
  user: SocialUser | null = null;

  // UI state management
  showForgotPassword = false;
  showResetPassword = false;
  resetToken = '';
  isTokenValid = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: SocialAuthService
  ) { }

  ngOnInit(): void {
    this.initializeForms();

    // Check if user is already logged in with Google
    this.authService.authState.subscribe((user: SocialUser) => {
      this.user = user;
      if (user) {
        console.log('User already logged in:', user);
        this.router.navigate(['/level-selection']);
      }
    });

    // Check for reset token in URL parameters
    this.checkForResetToken();
  }

  private initializeForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if passwords match
  private passwordMatchValidator(form: any) {
    const password = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  private checkForResetToken(): void {
    // In a real application, you would get this from route parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      this.resetToken = token;
      this.validateResetToken(token);
    }
  }

  // Traditional form login
  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;

      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);

        if (user.email === formData.email && user.password === formData.password) {
          alert('Login successful');
          // Save login state
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('loginMethod', 'traditional');
          this.router.navigate(['/level-selection']);
        } else {
          alert('Invalid email or password');
        }
      } else {
        alert('No user registered. Please signup first.');
      }
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }

  // Google OAuth login
  signInWithGoogle(): void {
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
      localStorage.setItem('userName', user.name);
      this.router.navigate(['/level-selection']);

      alert(`Welcome ${user.name}! Login successful via Google`);
      this.router.navigate(['/level-selection']);
    }).catch(err => {
      console.error('Google login error details:', err);
      if (err.error === 'popup_closed_by_user') {
        alert('Login cancelled by user');
      } else if (err.error === 'idpiframe_initialization_failed') {
        alert('Google login configuration error. Please check your setup.');
      } else {
        alert('Google login failed. Please check your internet connection and try again.');
      }
    });
  }

  // Show forgot password form
  showForgotPasswordForm(): void {
    this.showForgotPassword = true;
    this.showResetPassword = false;
  }

  // Hide forgot password form and return to login
  hideForgotPasswordForm(): void {
    this.showForgotPassword = false;
    this.forgotPasswordForm.reset();
  }

  // Handle forgot password submission
  onForgotPasswordSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;

      // Check if user exists
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);

        if (user.email === email) {
          // Generate reset token (in real app, this would be done on server)
          const resetToken = this.generateResetToken();

          // Store reset token with expiration (24 hours)
          const resetData = {
            email: email,
            token: resetToken,
            expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
          };
          localStorage.setItem('passwordReset', JSON.stringify(resetData));

          // Simulate sending email (in real app, send actual email)
          this.simulatePasswordResetEmail(email, resetToken);

          alert(`Password reset instructions have been sent to ${email}. Please check your email.`);
          this.hideForgotPasswordForm();
        } else {
          alert('No account found with this email address.');
        }
      } else {
        alert('No account found with this email address.');
      }
    } else {
      alert('Please enter a valid email address.');
    }
  }

  // Generate a random reset token
  private generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  }

  // Simulate sending password reset email
  private simulatePasswordResetEmail(email: string, token: string): void {
    // In a real application, you would send an email with a link like:
    // https://yourapp.com/reset-password?token=${token}

    console.log(`Password reset email would be sent to: ${email}`);
    console.log(`Reset link: ${window.location.origin}/login?token=${token}`);

    // For demo purposes, show the reset link
    setTimeout(() => {
      if (confirm(`Demo: Click OK to simulate clicking the reset link sent to ${email}`)) {
        this.resetToken = token;
        this.validateResetToken(token);
      }
    }, 2000);
  }

  // Validate reset token
  private validateResetToken(token: string): void {
    const resetData = localStorage.getItem('passwordReset');

    if (resetData) {
      const reset = JSON.parse(resetData);

      if (reset.token === token && reset.expires > Date.now()) {
        this.isTokenValid = true;
        this.showResetPassword = true;
        this.showForgotPassword = false;
        console.log('Valid reset token');
      } else {
        alert('Invalid or expired reset token. Please request a new password reset.');
        this.isTokenValid = false;
      }
    } else {
      alert('Invalid reset token.');
      this.isTokenValid = false;
    }
  }

  // Handle password reset submission
  onResetPasswordSubmit(): void {
    if (this.resetPasswordForm.valid && this.isTokenValid) {
      const newPassword = this.resetPasswordForm.value.newPassword;
      const resetData = JSON.parse(localStorage.getItem('passwordReset') || '{}');

      // Update user's password
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);

        if (user.email === resetData.email) {
          user.password = newPassword;
          localStorage.setItem('user', JSON.stringify(user));

          // Clear reset token
          localStorage.removeItem('passwordReset');

          alert('Password has been successfully reset. You can now login with your new password.');
          this.resetPasswordForm.reset();
          this.showResetPassword = false;
          this.isTokenValid = false;
          this.resetToken = '';
        } else {
          alert('Error: User account not found.');
        }
      } else {
        alert('Error: User account not found.');
      }
    } else if (!this.isTokenValid) {
      alert('Invalid reset token.');
    } else {
      alert('Please fill in all fields correctly.');
    }
  }

  // Cancel password reset
  cancelPasswordReset(): void {
    this.showResetPassword = false;
    this.resetPasswordForm.reset();
    this.isTokenValid = false;
    this.resetToken = '';
  }

  // Logout method (for both traditional and Google)
  logout(): void {
    if (this.user) {
      // Google logout
      this.authService.signOut().then(() => {
        this.user = null;
        this.clearLocalStorage();
        console.log('Google user logged out');
      }).catch(err => {
        console.error('Google logout error:', err);
      });
    } else {
      // Traditional logout
      this.clearLocalStorage();
    }
  }

  private clearLocalStorage(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginMethod');
    localStorage.removeItem('googleUser');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true' || this.user !== null;
  }

  // Getter methods for template access
  get newPassword() { return this.resetPasswordForm.get('newPassword'); }
  get confirmPassword() { return this.resetPasswordForm.get('confirmPassword'); }
  get forgotEmail() { return this.forgotPasswordForm.get('email'); }
}