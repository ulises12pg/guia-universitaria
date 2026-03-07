import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GamificationService } from '../../core/services/gamification.service';
import { User, Logro, Mision } from '../../shared/models/user.model';
import { Observable } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileDialogComponent } from './profile-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule
  ],
  styleUrl: './dashboard.scss',
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  usuario$!: Observable<User>;
  usuario: User | null = null;
  today = new Date();

  stats = [
    { icono: 'school', valor: 0, label: 'Universidades' },
    { icono: 'menu_book', valor: 0, label: 'Carreras' },
    { icono: 'quiz', valor: 0, label: 'Tests' },
    { icono: 'monetization_on', valor: 0, label: 'Monedas' }
  ];

  misionesActivas: Mision[] = [];

  constructor(
    private gamificationService: GamificationService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.usuario$ = this.gamificationService.usuario$;
  }

  ngOnInit(): void {
    this.gamificationService.usuario$.subscribe(usuario => {
      this.usuario = usuario;
      this.misionesActivas = usuario.misiones || [];
      this.actualizarStats();
    });
  }

  actualizarStats(): void {
    if (!this.usuario) return;
    this.stats[0].valor = this.usuario.universidadesVisitadas?.length || 0;
    this.stats[1].valor = this.usuario.carrerasExploradas?.length || 0;
    this.stats[2].valor = this.usuario.testsCompletados || 0;
    this.stats[3].valor = this.usuario.monedas || 0;
  }



  editProfile(): void {
    if (!this.usuario) return;
    const dialogRef = this.dialog.open(ProfileDialogComponent, {
      width: '400px',
      data: { user: this.usuario }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.gamificationService.actualizarPerfil(result);
        this.snackBar.open('Perfil actualizado', 'OK', { duration: 3000 });
      }
    });
  }

  showAchievementDetails(logro: Logro): void {
    this.snackBar.open(`${logro.titulo}: ${logro.descripcion}`, 'Cerrar', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }

  // Helpers
  getGradientMision(mision: any): string {
    const gradients: Record<string, string> = {
      'exploracion': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'test': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'comparador': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Added
      'training': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Added
      'favoritos': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' // Added
    };
    return gradients[mision.tipo] || gradients['exploracion'];
  }

  getIconoMision(tipo: string): string {
    const iconos: Record<string, string> = {
      'exploracion': 'explore',
      'test': 'psychology',
      'training': 'fitness_center',
      'favoritos': 'favorite',
      'comparador': 'compare_arrows'
    };
    return iconos[tipo] || 'star';
  }

  iniciarMision(mision: any): void {
    if (mision.tipo === 'test') {
      this.router.navigate(['/quests/vocational-test']);
    } else if (mision.tipo === 'exploracion') {
      this.router.navigate(['/universities']);
    } else if (mision.tipo === 'training') {
      this.router.navigate(['/training']);
    } else if (mision.tipo === 'comparador') {
      this.router.navigate(['/universities']); // Comparison is there
    }
  }

  getPorcentajeNivel(usuario: User | null): number {
    if (!usuario) return 0;
    return (usuario.experiencia / usuario.experienciaSiguienteNivel) * 100;
  }

  get rangoActual(): { titulo: string, icono: string, color: string } {
    if (!this.usuario) return { titulo: 'Plata', icono: 'stars', color: '#c0c0c0' };
    return this.gamificationService.getRangoActual(this.usuario.nivel);
  }

  // Navigation Methods for Quick Actions
  irATestVocacional(): void { this.router.navigate(['/quests/vocational-test']); }
  irATestPersonalidad(): void { this.router.navigate(['/quests/personality-test']); }
  irAAcertijos(): void { this.router.navigate(['/quests/quick-riddles']); }

  irATraining(): void { this.router.navigate(['/training']); }
  irAExams(): void { this.router.navigate(['/exams']); }

  irAUniversidades(): void { this.router.navigate(['/universities']); }
  // Favorites view or similar? For now simple navigation

  get allMedalsEarned(): boolean {
    return this.gamificationService.checkAllMedalsEarned();
  }

  downloadCertificate(): void {
    this.gamificationService.generateCertificate();
  }

  mostrarCompendio = false;
  verCompendio(): void { this.mostrarCompendio = true; }
  cerrarCompendio(): void { this.mostrarCompendio = false; }
  compartirCompendio(): void {
    this.gamificationService.compartirResultadosComoImagen('compendio-card', 'mi-historia-innovauni.png');
  }

  resetGamification(): void {
    if (confirm('¿Estás seguro de que quieres reiniciar tu progreso (EXP, Logros)? Tu perfil se mantendrá.')) {
      this.gamificationService.resetGamification();
    }
  }

  hardReset(): void {
    if (confirm('¿Estás seguro de que quieres BORRAR TODO? Esto eliminará tu cuenta y progreso permanentemente.')) {
      this.gamificationService.hardReset();
    }
  }
}
