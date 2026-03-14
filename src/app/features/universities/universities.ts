import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
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
      stats: { prestigio: 88, empleabilidad: 90, salario: 85, accesibilidad: 95, calidadVida: 80 }
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
      stats: { prestigio: 85, empleabilidad: 82, salario: 78, accesibilidad: 90, calidadVida: 85 }
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
      stats: { prestigio: 86, empleabilidad: 88, salario: 80, accesibilidad: 65, calidadVida: 90 }
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
      stats: { prestigio: 84, empleabilidad: 88, salario: 82, accesibilidad: 80, calidadVida: 88 }
    }
  ];

  filteredUniversities: University[] = [];
  comparisonList: University[] = [];
  selectedUniversity: University | null = null;
  viewMode: any = 'list';
  hasCompared = false;
  favoriteIds: string[] = [];
  searchQuery: string = '';
  private activeTabIndex: number = 0;

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
    this.activeTabIndex = index;
    this.applyFilters();
  }

  onSearchChange() {
    this.applyFilters();
  }

  private applyFilters() {
    const query = this.searchQuery.trim().toLowerCase();
    let base: University[];

    if (this.activeTabIndex === 0) {
      base = this.universities;
    } else {
      base = this.universities.filter(u => this.favoriteIds.includes(u.id));
    }

    if (query) {
      this.filteredUniversities = base.filter(u =>
        u.nombre.toLowerCase().includes(query) ||
        (u.siglas || '').toLowerCase().includes(query) ||
        u.ubicacion.toLowerCase().includes(query) ||
        u.areas.some(a => a.toLowerCase().includes(query)) ||
        u.descripcion.toLowerCase().includes(query)
      );
    } else {
      this.filteredUniversities = base;
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
