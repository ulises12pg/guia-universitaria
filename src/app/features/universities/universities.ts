import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, ActivatedRoute } from '@angular/router';
import { GamificationService } from '../../core/services/gamification.service';

import { University } from '../../shared/models/university.model';

@Component({
  selector: 'app-universities',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule
  ],
  templateUrl: './universities.html',
  styleUrls: ['./universities.scss']
})
export class UniversitiesComponent {
  universities: University[] = [
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
      descripcion: 'La máxima casa de estudios de México y una de las mejores universidades de Iberoamérica. Destaca en investigación y oferta académica.',
      areas: ['Investigación', 'Humanidades', 'Ciencias', 'Artes'],
      stats: { prestigio: 98, empleabilidad: 95, salario: 85, accesibilidad: 90, calidadVida: 88 }
    },
    {
      id: 'ipn',
      nombre: 'Instituto Politécnico Nacional',
      siglas: 'IPN',
      logo: 'engineering',
      ubicacion: 'Ciudad de México',
      tipo: 'Publica',
      costoPromedio: 'Bajo',
      salarioPromedio: '$20,000 - $40,000',
      empleabilidad: 'Alta',
      sitioWeb: 'https://www.ipn.mx',
      descripcion: 'Líder en educación tecnológica en México. Enfocada en ingeniería, física, matemáticas y nuevas tecnologías.',
      areas: ['Ingeniería', 'Tecnología', 'Ciencias'],
      stats: { prestigio: 92, empleabilidad: 94, salario: 88, accesibilidad: 85, calidadVida: 80 }
    },
    {
      id: 'itesm',
      nombre: 'Tecnológico de Monterrey',
      siglas: 'ITESM',
      logo: 'business',
      ubicacion: 'Nacional',
      tipo: 'Privada',
      costoPromedio: 'Muy Alto',
      salarioPromedio: '$25,000 - $50,000',
      empleabilidad: 'Muy Alta',
      sitioWeb: 'https://tec.mx',
      descripcion: 'Institución privada de vanguardia, reconocida por su excelencia académica, innovación y visión emprendedora.',
      areas: ['Negocios', 'Ingeniería', 'Tecnología'],
      stats: { prestigio: 96, empleabilidad: 98, salario: 95, accesibilidad: 60, calidadVida: 95 }
    },
    {
      id: 'uam',
      nombre: 'Universidad Autónoma Metropolitana',
      siglas: 'UAM',
      logo: 'menu_book',
      ubicacion: 'Ciudad de México',
      tipo: 'Publica',
      costoPromedio: 'Muy Bajo',
      salarioPromedio: '$15,000 - $30,000',
      empleabilidad: 'Media',
      sitioWeb: 'https://www.uam.mx',
      descripcion: 'Destacada por su modelo educativo innovador y su fuerte compromiso con la investigación social y científica.',
      areas: ['Ciencias Sociales', 'Diseño', 'Salud'],
      stats: { prestigio: 85, empleabilidad: 80, salario: 75, accesibilidad: 88, calidadVida: 82 }
    },
    {
      id: 'udg',
      nombre: 'Universidad de Guadalajara',
      siglas: 'UDG',
      logo: 'auto_stories',
      ubicacion: 'Guadalajara, Jalisco',
      tipo: 'Publica',
      costoPromedio: 'Bajo',
      salarioPromedio: '$14,000 - $28,000',
      empleabilidad: 'Alta',
      sitioWeb: 'https://www.udg.mx',
      descripcion: 'Una de las universidades con mayor tradición e impacto en el occidente del país.',
      areas: ['Multidisciplinaria', 'Artes', 'Salud'],
      stats: { prestigio: 88, empleabilidad: 85, salario: 78, accesibilidad: 92, calidadVida: 85 }
    },
    {
      id: 'ibero',
      nombre: 'Universidad Iberoamericana',
      siglas: 'IBERO',
      logo: 'architecture',
      ubicacion: 'Ciudad de México',
      tipo: 'Privada',
      costoPromedio: 'Alto',
      salarioPromedio: '$22,000 - $45,000',
      empleabilidad: 'Alta',
      sitioWeb: 'https://ibero.mx',
      descripcion: 'Institución jesuita de prestigio, enfocada en la formación humanista y la excelencia académica.',
      areas: ['Humanidades', 'Arquitectura', 'Diseño'],
      stats: { prestigio: 90, empleabilidad: 88, salario: 85, accesibilidad: 70, calidadVida: 92 }
    },
    {
      id: 'anahuac',
      nombre: 'Universidad Anáhuac',
      siglas: 'Anáhuac',
      logo: 'gavel',
      ubicacion: 'Nacional',
      tipo: 'Privada',
      costoPromedio: 'Alto',
      salarioPromedio: '$20,000 - $42,000',
      empleabilidad: 'Alta',
      sitioWeb: 'https://www.anahuac.mx',
      descripcion: 'Reconocida por su liderazgo en negocios, derecho y medicina, formando líderes de acción positiva.',
      areas: ['Negocios', 'Salud', 'Derecho'],
      stats: { prestigio: 89, empleabilidad: 87, salario: 84, accesibilidad: 68, calidadVida: 90 }
    },
    {
      id: 'uanl',
      nombre: 'Universidad Autónoma de Nuevo León',
      siglas: 'UANL',
      logo: 'pets',
      ubicacion: 'Monterrey, Nuevo León',
      tipo: 'Publica',
      costoPromedio: 'Bajo',
      salarioPromedio: '$16,000 - $32,000',
      empleabilidad: 'Alta',
      sitioWeb: 'https://www.uanl.mx',
      descripcion: 'La institución pública de educación superior más importante del norte de México.',
      areas: ['Ingeniería', 'Salud', 'Agropecuaria'],
      stats: { prestigio: 87, empleabilidad: 86, salario: 80, accesibilidad: 85, calidadVida: 84 }
    }
  ];

  filteredUniversities: University[] = [];
  comparisonList: University[] = [];
  selectedUniversity: University | null = null;
  viewMode: any = 'list';
  hasCompared = false;
  favoriteIds: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gamificationService: GamificationService
  ) {
    this.filteredUniversities = this.universities;
    this.gamificationService.usuario$.subscribe(user => {
      this.favoriteIds = user.universidadesFavoritas || [];
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const area = params['area'];
      if (area) {
        // Simple filtering logic
        this.filteredUniversities = this.universities.filter(u =>
          u.areas.some(a => a.toLowerCase().includes(area.toLowerCase())) ||
          u.descripcion.toLowerCase().includes(area.toLowerCase())
        );
      }
    });
  }

  // Comparison Logic
  toggleComparison(uni: University) {
    const index = this.comparisonList.findIndex(u => u.id === uni.id);
    if (index >= 0) {
      this.comparisonList.splice(index, 1);
    } else {
      if (this.comparisonList.length < 3) {
        this.comparisonList.push(uni);
      } else {
        // Show notification or alert: Max 3
        console.warn('Max 3 universities for comparison');
      }
    }
  }

  isInComparison(uni: University): boolean {
    return this.comparisonList.some(u => u.id === uni.id);
  }

  startComparison() {
    this.viewMode = 'comparison';
    window.scrollTo(0, 0); // Scroll to top when opening comparison

    if (!this.hasCompared) {
      // Now max progress is 3
      const currentProgress = this.comparisonList.length;
      this.gamificationService.actualizarProgresoLogro('comparador_experto', currentProgress);
      // Trigger mission
      this.gamificationService.verificarProgresoMisiones('comparador_usado');
      this.hasCompared = true;
    }
  }

  resetComparison() {
    this.comparisonList = [];
  }

  removeFromComparison(uni: University) {
    const index = this.comparisonList.findIndex(u => u.id === uni.id);
    if (index >= 0) {
      this.comparisonList.splice(index, 1);
      // If no universities left, go back to list? Or stay empty? 
      // User requested "quit user from comparison view", probably implies dynamic updates.
      if (this.comparisonList.length === 0) {
        this.viewMode = 'list';
      }
    }
  }

  isFavorite(uni: University): boolean {
    return this.favoriteIds.includes(uni.id);
  }

  toggleFavorito(uni: University, event: Event): void {
    event.stopPropagation();
    this.gamificationService.toggleFavorito(uni.id);
  }

  onTabChange(index: number) {
    if (index === 0) {
      this.filteredUniversities = this.universities;
    } else {
      this.filteredUniversities = this.universities.filter(u => this.favoriteIds.includes(u.id));
    }
  }

  // Detail View Logic
  openDetails(uni: University) {
    this.selectedUniversity = uni;
    this.viewMode = 'details';
    this.gamificationService.registrarVisitaUniversidad(uni.id);
  }

  closeOverlay() {
    this.viewMode = 'list';
    this.selectedUniversity = null;
  }

  // Radial Chart Helper
  getRadialPath(stats: any): string {
    const radius = 100;
    const center = 110; // Slightly offset to fit labels if needed
    const angles = [0, 72, 144, 216, 288]; // 5 axes: 360 / 5
    const values = [
      stats.prestigio,
      stats.empleabilidad,
      stats.salario,
      stats.accesibilidad,
      stats.calidadVida
    ];

    const points = values.map((value, i) => {
      const angleRad = (angles[i] - 90) * (Math.PI / 180); // -90 to start at top
      const r = (value / 100) * radius;
      const x = center + r * Math.cos(angleRad);
      const y = center + r * Math.sin(angleRad);
      return `${x},${y}`;
    });

    return points.join(' ');
  }

  getAxisLine(index: number): string {
    const radius = 100;
    const center = 110;
    const angleRad = ((index * 72) - 90) * (Math.PI / 180);
    const x = center + radius * Math.cos(angleRad);
    const y = center + radius * Math.sin(angleRad);
    return `${center},${center} ${x},${y}`;
  }

  visitWebsite(url: string) {
    window.open(url, '_blank');
  }

  backToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  viewStudyPlan(uni: University) {
    const url = `https://www.google.com/search?q=plan+estudios+${uni.nombre}`;
    window.open(url, '_blank');
  }

  viewAdmissions(uni: University) {
    const url = `https://www.google.com/search?q=convocatoria+${uni.nombre}`;
    window.open(url, '_blank');
  }

  searchCareer(uni: University, area: string) {
    const url = `https://www.google.com/search?q=carreras+${area}+${uni.nombre}`;
    window.open(url, '_blank');
  }
}
