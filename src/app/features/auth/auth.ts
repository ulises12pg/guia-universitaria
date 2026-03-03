import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './auth.html',
  styleUrls: ['./auth.scss']
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoginMode = signal(true);
  isLoading = signal(false);

  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async onSubmit() {
    if (this.authForm.invalid) return;

    this.isLoading.set(true);
    const { email, password } = this.authForm.getRawValue();

    try {
      if (this.isLoginMode()) {
        const { error } = await this.authService.signIn(email!, password!);
        if (error) throw error;
      } else {
        const { error } = await this.authService.signUp(email!, password!);
        if (error) throw error;
        this.snackBar.open('Registro exitoso! Por favor inicia sesión.', 'Cerrar', { duration: 3000 });
        this.isLoginMode.set(true);
        this.isLoading.set(false);
        return; // Stop here for registration
      }

      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.snackBar.open(err.message || 'Error de autenticación', 'Cerrar', { duration: 3000 });
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleMode() {
    this.isLoginMode.update(prev => !prev);
  }
}
