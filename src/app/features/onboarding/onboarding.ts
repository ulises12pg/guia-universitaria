import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GamificationService } from '../../core/services/gamification.service';
import { User } from '../../shared/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
})
export class OnboardingComponent {
  avatarUrl = 'assets/avatars/avatar_default.png';

  userData: Partial<User> = {
    nombre: '',
    edad: undefined,
    escuela: ''
  };

  constructor(
    private router: Router,
    private gamificationService: GamificationService
  ) { }

  comenzar() {
    if (this.userData.nombre && this.userData.edad && this.userData.escuela) {
      this.gamificationService.actualizarPerfil(this.userData);
      this.gamificationService.completarLogro('primer_paso');
      this.router.navigate(['/dashboard']);
    }
  }
}
