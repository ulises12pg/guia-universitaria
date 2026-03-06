import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

import { University } from '../../../shared/models/university.model';
import { GamificationService } from '../../../core/services/gamification.service';

// Extend the base University model for Map specific needs
interface UniversityMap extends University {
  imagen: string;
  progresoExploracion: number;
  visitada: boolean;
  favorita: boolean;
  ranking: number;
  coordenadas: { lat: number; lng: number };
}

@Component({
  selector: 'app-university-map',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  template: `
    <div class="map-container">
      <div class="map-header">
        <h2>🗺️ Mapa de Universidades</h2>
        <div class="filters">
          <mat-chip-listbox>
            <mat-chip-option 
              *ngFor="let filtro of filtros"
              [selected]="filtro.activo"
              (click)="toggleFiltro(filtro)"
              [color]="filtro.activo ? 'primary' : 'accent'">
              {{filtro.nombre}}
            </mat-chip-option>
          </mat-chip-listbox>
        </div>
      </div>

      <div class="map-content">
        <!-- Simulación visual de mapa con cards de universidad -->
        <div class="universities-grid">
          <mat-card 
            *ngFor="let uni of universidadesFiltradas" 
            class="university-card"
            [class.visited]="uni.visitada"
            (click)="seleccionarUniversidad(uni)">
            
            <div class="uni-image" [style.background-image]="'url(' + uni.imagen + ')'">
              <div class="uni-badge" *ngIf="uni.visitada">
                <mat-icon>check_circle</mat-icon>
                <span>Visitada</span>
              </div>
              <div class="uni-ranking">#{{uni.ranking}}</div>
            </div>

            <mat-card-content>
              <div class="uni-header">
                <!-- Use logo placeholder if needed -->
                <mat-icon class="uni-logo-icon">{{uni.logo}}</mat-icon>
                <div>
                  <h3>{{uni.nombre}}</h3>
                  <p class="uni-siglas">{{uni.siglas}}</p>
                </div>
              </div>

              <div class="uni-stats">
                <div class="stat">
                  <mat-icon>location_on</mat-icon>
                  <span>{{uni.ubicacion}}</span>
                </div>
                <div class="stat">
                  <mat-icon>school</mat-icon>
                  <span>{{uni.areas.length || 0}} áreas</span>
                </div>
                <div class="stat">
                  <mat-icon>attach_money</mat-icon>
                  <span>{{uni.tipo}}</span>
                </div>
              </div>

              <mat-progress-bar 
                mode="determinate" 
                [value]="uni.progresoExploracion"
                color="accent">
              </mat-progress-bar>
              <span class="exploration-text">{{uni.progresoExploracion}}% explorado</span>
            </mat-card-content>

            <mat-card-actions>
              <button mat-button color="primary" (click)="verDetalle(uni)">
                Explorar
              </button>
              <button mat-icon-button 
                [color]="uni.favorita ? 'warn' : 'default'"
                (click)="toggleFavorito(uni); $event.stopPropagation()">
                <mat-icon>{{uni.favorita ? 'favorite' : 'favorite_border'}}</mat-icon>
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-container { padding: 20px; background: #f5f5f5; min-height: 100vh; }
    .map-header { margin-bottom: 30px; h2 { color: #333; margin-bottom: 15px; } }
    .universities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
    .university-card { border-radius: 16px; overflow: hidden; cursor: pointer; transition: all 0.3s; position: relative; }
    .university-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.15); }
    .university-card.visited { border: 2px solid #4CAF50; }
    .uni-image { height: 160px; background-size: cover; background-position: center; position: relative; background-color: #ddd; }
    .uni-badge { position: absolute; top: 10px; left: 10px; background: #4CAF50; color: white; padding: 5px 15px; border-radius: 20px; display: flex; align-items: center; gap: 5px; font-weight: 500; font-size: 12px; }
    .uni-ranking { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; font-size: 12px; }
    .uni-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; margin-top: 15px; }
    .uni-logo-icon { width: 40px; height: 40px; font-size: 40px; color: #555; }
    .uni-header h3 { margin: 0; font-size: 1.1rem; color: #333; line-height: 1.2; }
    .uni-siglas { margin: 0; color: #666; font-size: 0.9rem; }
    .uni-stats { display: flex; gap: 15px; margin-bottom: 15px; flex-wrap: wrap; }
    .stat { display: flex; align-items: center; gap: 5px; color: #666; font-size: 13px; }
    .exploration-text { font-size: 11px; color: #999; display: block; margin-top: 5px; text-align: right; }
  `]
})
export class UniversityMapComponent implements OnInit {
  universidades: UniversityMap[] = [];
  universidadesFiltradas: UniversityMap[] = [];
  universidadSeleccionada: UniversityMap | null = null;

  filtros = [
    { nombre: 'Todas', activo: true, tipo: 'todas' },
    { nombre: 'Públicas', activo: false, tipo: 'Publica' },
    { nombre: 'Privadas', activo: false, tipo: 'Privada' },
    { nombre: 'Visitadas', activo: false, tipo: 'visitadas' },
    { nombre: 'Favoritas', activo: false, tipo: 'favoritas' }
  ];

  constructor(private gamificationService: GamificationService) { }

  ngOnInit(): void {
    this.cargarUniversidades();
  }

  cargarUniversidades(): void {
    // Mock data adapted from University model
    this.universidades = [
      {
        id: 'unam',
        nombre: 'Universidad Nacional Autónoma de México',
        siglas: 'UNAM',
        logo: 'school',
        ubicacion: 'Ciudad de México',
        tipo: 'Publica',
        costoPromedio: 'Muy Bajo',
        salarioPromedio: '$18,000 - $35,000',
        empleabilidad: 'Muy Alta',
        sitioWeb: 'https://www.unam.mx',
        descripcion: 'La máxima casa de estudios...',
        areas: ['Investigación', 'Humanidades'],
        stats: { prestigio: 98, empleabilidad: 95, salario: 85, accesibilidad: 90, calidadVida: 88 },
        // Map specific
        imagen: 'assets/universidades/unam.jpg', // Placeholder
        progresoExploracion: 30,
        visitada: false,
        favorita: true,
        ranking: 1,
        coordenadas: { lat: 19.332, lng: -99.187 }
      },
      {
        id: 'itesm',
        nombre: 'Tecnológico de Monterrey',
        siglas: 'ITESM',
        logo: 'business',
        ubicacion: 'Nacional',
        tipo: 'Privada',
        costoPromedio: 'Muy Alto',
        salarioPromedio: '$25,000',
        empleabilidad: 'Muy Alta',
        sitioWeb: 'https://tec.mx',
        descripcion: 'Innovación y emprendimiento',
        areas: ['Negocios', 'Ingeniería'],
        stats: { prestigio: 96, empleabilidad: 98, salario: 95, accesibilidad: 60, calidadVida: 95 },
        imagen: 'assets/universidades/tec.jpg',
        progresoExploracion: 0,
        visitada: false,
        favorita: false,
        ranking: 2,
        coordenadas: { lat: 25.65, lng: -100.29 }
      },
      {
        id: 'tecnm',
        nombre: 'Tecnológico Nacional de México',
        siglas: 'TecNM',
        logo: 'engineering',
        ubicacion: 'Nacional',
        tipo: 'Publica',
        costoPromedio: 'Muy Bajo',
        salarioPromedio: '$15,000 - $30,000',
        empleabilidad: 'Alta',
        sitioWeb: 'https://www.tecnm.mx',
        descripcion: 'La institución de educación superior tecnológica más grande de México y Latinoamérica.',
        areas: ['Ingeniería', 'Tecnología', 'Ciencias'],
        stats: { prestigio: 88, empleabilidad: 90, salario: 85, accesibilidad: 95, calidadVida: 80 },
        imagen: 'assets/universidades/tecnm.jpg',
        progresoExploracion: 0,
        visitada: false,
        favorita: false,
        ranking: 15,
        coordenadas: { lat: 19.4326, lng: -99.1332 }
      },
      {
        id: 'uaeh',
        nombre: 'Universidad Autónoma del Estado de Hidalgo',
        siglas: 'UAEH',
        logo: 'account_balance',
        ubicacion: 'Pachuca, Hidalgo',
        tipo: 'Publica',
        costoPromedio: 'Bajo',
        salarioPromedio: '$12,000 - $25,000',
        empleabilidad: 'Media',
        sitioWeb: 'https://www.uaeh.edu.mx',
        descripcion: 'La máxima casa de estudios del estado de Hidalgo, con una amplia oferta educativa y cultural.',
        areas: ['Salud', 'Ciencias Sociales', 'Ingeniería', 'Humanidades'],
        stats: { prestigio: 85, empleabilidad: 82, salario: 78, accesibilidad: 90, calidadVida: 85 },
        imagen: 'assets/universidades/uaeh.jpg',
        progresoExploracion: 0,
        visitada: false,
        favorita: false,
        ranking: 30,
        coordenadas: { lat: 20.1011, lng: -98.7591 }
      },
      {
        id: 'ufd',
        nombre: 'Universidad del Fútbol y Ciencias del Deporte',
        siglas: 'UFD',
        logo: 'sports_soccer',
        ubicacion: 'Pachuca, Hidalgo',
        tipo: 'Privada',
        costoPromedio: 'Alto',
        salarioPromedio: '$15,000 - $35,000',
        empleabilidad: 'Alta',
        sitioWeb: 'https://ufd.mx',
        descripcion: 'Institución pionera enfocada exclusivamente en el deporte, sus ciencias y gestión.',
        areas: ['Deporte', 'Ciencias de la Salud', 'Negocios', 'Comunicación'],
        stats: { prestigio: 86, empleabilidad: 88, salario: 80, accesibilidad: 65, calidadVida: 90 },
        imagen: 'assets/universidades/ufd.jpg',
        progresoExploracion: 0,
        visitada: false,
        favorita: false,
        ranking: 45,
        coordenadas: { lat: 20.0911, lng: -98.7611 }
      },
      {
        id: 'uvm',
        nombre: 'Universidad del Valle de México',
        siglas: 'UVM',
        logo: 'school',
        ubicacion: 'Nacional',
        tipo: 'Privada',
        costoPromedio: 'Medio',
        salarioPromedio: '$18,000 - $35,000',
        empleabilidad: 'Alta',
        sitioWeb: 'https://uvm.mx',
        descripcion: 'Una de las universidades privadas más grandes de México, enfocada en la preparación integral con visión global.',
        areas: ['Salud', 'Negocios', 'Sociales', 'Ingeniería'],
        stats: { prestigio: 84, empleabilidad: 88, salario: 82, accesibilidad: 80, calidadVida: 88 },
        imagen: 'assets/universidades/uvm.jpg',
        progresoExploracion: 0,
        visitada: false,
        favorita: false,
        ranking: 25,
        coordenadas: { lat: 19.3321, lng: -99.1871 }
      }
    ];
    this.universidadesFiltradas = this.universidades;
  }

  toggleFiltro(filtro: any): void {
    this.filtros.forEach(f => f.activo = false);
    filtro.activo = true;

    switch (filtro.tipo) {
      case 'Publica':
      case 'Privada':
        this.universidadesFiltradas = this.universidades.filter(u => u.tipo === filtro.tipo);
        break;
      case 'visitadas':
        this.universidadesFiltradas = this.universidades.filter(u => u.visitada);
        break;
      case 'favoritas':
        this.universidadesFiltradas = this.universidades.filter(u => u.favorita);
        break;
      default:
        this.universidadesFiltradas = this.universidades;
    }
  }

  seleccionarUniversidad(uni: UniversityMap): void {
    this.universidadSeleccionada = uni;
  }

  verDetalle(uni: UniversityMap): void {
    this.seleccionarUniversidad(uni);
    this.gamificationService.verificarProgresoMisiones('visita_universidad', { id: uni.id });
  }

  toggleFavorito(uni: UniversityMap): void {
    uni.favorita = !uni.favorita;
  }
}