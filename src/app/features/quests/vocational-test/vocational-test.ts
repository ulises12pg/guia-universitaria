import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GamificationService } from '../../../core/services/gamification.service';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-vocational-test',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './vocational-test.html',
  styleUrls: ['./vocational-test.scss'],
  animations: [
    trigger('slideAnimation', [
      state('in', style({ transform: 'translateX(0)', opacity: 1 })),
      state('out', style({ transform: 'translateX(-100%)', opacity: 0 })),
      transition('in => out', animate('300ms ease-in')),
      transition('out => in', animate('300ms ease-out')),
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('pulse', [
      state('inactive', style({ transform: 'scale(1)' })),
      state('active', style({ transform: 'scale(1.02)', boxShadow: '0 0 15px rgba(102, 126, 234, 0.5)' })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class VocationalTestComponent {
  preguntas = [
    {
      id: 1,
      texto: 'Si pudieras elegir un proyecto para la feria de ciencias, ¿cuál preferirías?',
      opciones: [
        { id: 'a', texto: 'Construir un modelo de un motor o un robot funcional.', icono: 'smart_toy', area: 'realista' },
        { id: 'b', texto: 'Investigar cómo afectan los distintos tipos de música al crecimiento de las plantas.', icono: 'local_florist', area: 'investigativa' },
        { id: 'c', texto: 'Escribir una obra de teatro sobre un descubrimiento científico o diseñar el cartel.', icono: 'theater_comedy', area: 'artistica' },
        { id: 'd', texto: 'Organizar la logística del evento y dirigir a los grupos.', icono: 'groups', area: 'social' }
      ]
    },
    {
      id: 2,
      texto: 'En tu tiempo libre, ¿qué actividad te resulta más atractiva?',
      opciones: [
        { id: 'a', texto: 'Reparar cosas en casa, armar muebles o hacer manualidades prácticas.', icono: 'handyman', area: 'realista' },
        { id: 'b', texto: 'Leer artículos de divulgación, resolver acertijos lógicos o jugar ajedrez.', icono: 'psychology', area: 'investigativa' },
        { id: 'c', texto: 'Dibujar, tocar un instrumento, tomar fotografías o visitar museos.', icono: 'brush', area: 'artistica' },
        { id: 'd', texto: 'Participar en debates, voluntariados o actividades sociales.', icono: 'forum', area: 'social' }
      ]
    },
    {
      id: 3,
      texto: '¿Qué tipo de problemas te sientes más capaz de resolver?',
      opciones: [
        { id: 'a', texto: 'Problemas prácticos y tangibles (ej. "el coche no arranca").', icono: 'build', area: 'realista' },
        { id: 'b', texto: 'Problemas abstractos o teóricos (ej. "¿por qué ocurre este fenómeno?").', icono: 'lightbulb', area: 'investigativa' },
        { id: 'c', texto: 'Problemas creativos o de expresión (ej. "¿cómo transmito esta emoción?").', icono: 'palette', area: 'artistica' },
        { id: 'd', texto: 'Problemas interpersonales o de comunicación (ej. "hay un conflicto en el grupo").', icono: 'record_voice_over', area: 'social' }
      ]
    },
    {
      id: 4,
      texto: '¿Qué asignatura escolar te gusta o te gustaba más?',
      opciones: [
        { id: 'a', texto: 'Tecnología, Taller o Educación Física.', icono: 'sports_soccer', area: 'realista' },
        { id: 'b', texto: 'Matemáticas, Física, Química o Biología.', icono: 'science', area: 'investigativa' },
        { id: 'c', texto: 'Arte, Literatura, Música o Diseño.', icono: 'music_note', area: 'artistica' },
        { id: 'd', texto: 'Ciencias Sociales, Historia o Psicología.', icono: 'public', area: 'social' }
      ]
    },
    {
      id: 5,
      texto: '¿Cómo prefieres trabajar?',
      opciones: [
        { id: 'a', texto: 'Con herramientas, máquinas o al aire libre.', icono: 'construction', area: 'realista' },
        { id: 'b', texto: 'En un laboratorio o biblioteca, analizando datos e información.', icono: 'biotech', area: 'investigativa' },
        { id: 'c', texto: 'En un estudio o espacio libre que permita la creatividad sin reglas.', icono: 'auto_awesome', area: 'artistica' },
        { id: 'd', texto: 'En una oficina o aula, interactuando contantemente con otras personas.', icono: 'school', area: 'social' }
      ]
    },
    {
      id: 6,
      texto: 'Si fueras a trabajar en un hospital, ¿qué rol preferirías?',
      opciones: [
        { id: 'a', texto: 'Manteniendo y reparando los equipos médicos de alta tecnología.', icono: 'settings', area: 'realista' },
        { id: 'b', texto: 'Investigando en el laboratorio nuevas curas para enfermedades.', icono: 'biotech', area: 'investigativa' },
        { id: 'c', texto: 'Diseñando campañas visuales para la prevención de enfermedades.', icono: 'design_services', area: 'artistica' },
        { id: 'd', texto: 'Atendiendo a los pacientes y escuchando sus preocupaciones.', icono: 'local_hospital', area: 'social' }
      ]
    },
    {
      id: 7,
      texto: 'Valoras más:',
      opciones: [
        { id: 'a', texto: 'La utilidad práctica y los resultados tangibles.', icono: 'check_circle', area: 'realista' },
        { id: 'b', texto: 'El conocimiento, la verdad y el descubrimiento.', icono: 'menu_book', area: 'investigativa' },
        { id: 'c', texto: 'La belleza, la originalidad y la autoexpresión.', icono: 'stars', area: 'artistica' },
        { id: 'd', texto: 'El bienestar de los demás y la justicia social.', icono: 'balance', area: 'social' }
      ]
    },
    {
      id: 8,
      texto: '¿Qué programa de televisión o canal de YouTube preferirías ver?',
      opciones: [
        { id: 'a', texto: '"Así se hace" o programas de supervivencia/construcción.', icono: 'tv', area: 'realista' },
        { id: 'b', texto: 'Documentales sobre el universo, naturaleza o historia antigua.', icono: 'history_edu', area: 'investigativa' },
        { id: 'c', texto: 'Tutoriales de arte, crítica de cine o programas de música.', icono: 'movie', area: 'artistica' },
        { id: 'd', texto: 'Entrevistas, programas de actualidad social o psicología.', icono: 'mic', area: 'social' }
      ]
    },
    {
      id: 9,
      texto: 'Cuando navegas por internet, ¿qué tipo de contenido sueles consumir?',
      opciones: [
        { id: 'a', texto: 'Tutoriales de "hágalo usted mismo", reparaciones o tecnología.', icono: 'build', area: 'realista' },
        { id: 'b', texto: 'Noticias científicas, documentales o artículos de análisis.', icono: 'article', area: 'investigativa' },
        { id: 'c', texto: 'Blogs de diseño, ilustración, música o tendencias artísticas.', icono: 'palette', area: 'artistica' },
        { id: 'd', texto: 'Redes sociales, consejos sobre relaciones o vlogs de estilo de vida.', icono: 'people', area: 'social' }
      ]
    },
    {
      id: 10,
      texto: '¿Qué sección del periódico o noticias te interesa más?',
      opciones: [
        { id: 'a', texto: 'Tecnología, autos o informática.', icono: 'directions_car', area: 'realista' },
        { id: 'b', texto: 'Ciencia, salud y descubrimientos.', icono: 'health_and_safety', area: 'investigativa' },
        { id: 'c', texto: 'Cultura, espectáculos y arte.', icono: 'theater_comedy', area: 'artistica' },
        { id: 'd', texto: 'Sociedad, política y educación.', icono: 'school', area: 'social' }
      ]
    },
    {
      id: 11,
      texto: 'En un apocalipsis zombi, ¿cuál sería tu rol en el grupo?',
      opciones: [
        { id: 'a', texto: 'Construir fortificaciones, reparar vehículos y armas.', icono: 'security', area: 'realista' },
        { id: 'b', texto: 'Investigar la cura o analizar el comportamiento de los zombis.', icono: 'science', area: 'investigativa' },
        { id: 'c', texto: 'Documentar la historia o mantener la moral con música y arte.', icono: 'mic_external_on', area: 'artistica' },
        { id: 'd', texto: 'Liderar el grupo, mediar conflictos y cuidar a los heridos.', icono: 'local_hospital', area: 'social' }
      ]
    },
    {
      id: 12,
      texto: '¿Qué regalo preferirías recibir?',
      opciones: [
        { id: 'a', texto: 'Una caja de herramientas de calidad o un gadget tecnológico.', icono: 'home_repair_service', area: 'realista' },
        { id: 'b', texto: 'Un telescopio o una suscripción a una revista científica.', icono: 'visibility', area: 'investigativa' },
        { id: 'c', texto: 'Un set de pintura profesional o entradas para un concierto.', icono: 'brush', area: 'artistica' },
        { id: 'd', texto: 'Un juego de mesa para jugar con amigos o una cena grupal.', icono: 'restaurant', area: 'social' }
      ]
    },
    {
      id: 13,
      texto: 'Si pudieras viajar en el tiempo, ¿a qué época irías?',
      opciones: [
        { id: 'a', texto: 'A la Revolución Industrial para ver las grandes máquinas.', icono: 'precision_manufacturing', area: 'realista' },
        { id: 'b', texto: 'Al futuro lejano para ver los avances científicos y tecnológicos.', icono: 'rocket_launch', area: 'investigativa' },
        { id: 'c', texto: 'Al Renacimiento para conocer a los grandes artistas.', icono: 'museum', area: 'artistica' },
        { id: 'd', texto: 'A los años 60 para participar en los movimientos sociales.', icono: 'campaign', area: 'social' }
      ]
    },
    {
      id: 14,
      texto: '¿Qué cualidad valoras más en ti mismo?',
      opciones: [
        { id: 'a', texto: 'Mi habilidad manual y mi sentido práctico para resolver cosas.', icono: 'thumb_up', area: 'realista' },
        { id: 'b', texto: 'Mi capacidad de análisis y mi curiosidad intelectual.', icono: 'psychology', area: 'investigativa' },
        { id: 'c', texto: 'Mi imaginación, creatividad y sensibilidad estética.', icono: 'auto_awesome', area: 'artistica' },
        { id: 'd', texto: 'Mi empatía y capacidad para escuchar y ayudar a otros.', icono: 'volunteer_activism', area: 'social' }
      ]
    },
    {
      id: 15,
      texto: 'Si ganaras la lotería, ¿qué harías primero?',
      opciones: [
        { id: 'a', texto: 'Comprar un taller totalmente equipado o una granja.', icono: 'storefront', area: 'realista' },
        { id: 'b', texto: 'Financiar una expedición científica o un laboratorio.', icono: 'biotech', area: 'investigativa' },
        { id: 'c', texto: 'Coleccionar obras de arte o financiar una película.', icono: 'movie_filter', area: 'artistica' },
        { id: 'd', texto: 'Crear una fundación benéfica para ayudar a los necesitados.', icono: 'foundation', area: 'social' }
      ]
    },
    {
      id: 16,
      texto: '¿Qué ambiente de trabajo prefieres?',
      opciones: [
        { id: 'a', texto: 'Al aire libre, en un taller o en una obra.', icono: 'landscape', area: 'realista' },
        { id: 'b', texto: 'En un laboratorio, biblioteca o centro de investigación.', icono: 'science', area: 'investigativa' },
        { id: 'c', texto: 'En un estudio de diseño, teatro o sala de música.', icono: 'piano', area: 'artistica' },
        { id: 'd', texto: 'En una escuela, hospital u oficina de atención al cliente.', icono: 'meeting_room', area: 'social' }
      ]
    }
  ];

  preguntaActual = 0;
  respuestas: any[] = [];
  respuestaSeleccionada: any = null;
  completado = false;
  mostrandoResultado = false;
  animationState = 'in';
  experienciaGanada = 0;
  nuevaMedalla: string | null = null;

  areaResultado = {
    nombre: '',
    descripcion: '',
    icono: '',
    color: '',
    carreras: [] as string[]
  };

  constructor(
    private gamificationService: GamificationService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    const user = this.gamificationService.getUsuarioActual();
    if (user.vocationalTestResult) {
      this.mostrandoResultado = true;
      this.completado = true;
      this.mostrarResultado(user.vocationalTestResult, true); // true = loading from save
    }
  }

  get preguntaActualPregunta() {
    return this.preguntas[this.preguntaActual];
  }

  get esUltimaPregunta() {
    return this.preguntaActual === this.preguntas.length - 1;
  }

  seleccionarRespuesta(opcion: any): void {
    this.respuestaSeleccionada = opcion;
  }

  siguientePregunta(): void {
    if (this.respuestaSeleccionada) {
      this.respuestas.push(this.respuestaSeleccionada);

      if (this.esUltimaPregunta) {
        this.calcularResultados();
      } else {
        this.animationState = 'out';
        setTimeout(() => {
          this.preguntaActual++;
          this.respuestaSeleccionada = null;
          this.animationState = 'in';
          this.cdr.detectChanges();
        }, 300);
      }
    }
  }

  calcularResultados(): void {
    // Contar respuestas por área
    const conteo: { [key: string]: number } = {};
    this.respuestas.forEach(r => {
      conteo[r.area] = (conteo[r.area] || 0) + 1;
    });

    // Encontrar área ganadora
    const areaGanadora = Object.keys(conteo).reduce((a, b) =>
      conteo[a] > conteo[b] ? a : b
    );

    this.mostrarResultado(areaGanadora);
  }

  mostrarResultado(area: string, fromSave: boolean = false): void {
    const areasInfo: { [key: string]: any } = {
      'realista': {
        nombre: 'Área Realista / Tecnológica',
        descripcion: 'Te inclinas por actividades prácticas, mecánicas y el uso de herramientas. Disfrutas ver resultados tangibles de tu trabajo.',
        icono: 'build',
        color: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
        carreras: ['Ingeniería Mecánica', 'Ingeniería Civil', 'Ingeniería Eléctrica', 'Arquitectura', 'Agronomía', 'Veterinaria', 'Informática Aplicada']
      },
      'investigativa': {
        nombre: 'Área Investigativa / Científica',
        descripcion: 'Te gusta observar, aprender, analizar y resolver problemas lógicos. Eres curioso y buscas entender el porqué de las cosas.',
        icono: 'science',
        color: 'linear-gradient(135deg, #1fa2ff 0%, #12d8fa 100%)',
        carreras: ['Física', 'Química', 'Biología', 'Matemáticas', 'Medicina', 'Economía', 'Sociología', 'Antropología']
      },
      'artistica': {
        nombre: 'Área Artística / Creativa',
        descripcion: 'Valoras la innovación, la intuición y la libertad de expresión. No te gusta la rutina estricta y buscas crear algo único.',
        icono: 'palette',
        color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        carreras: ['Diseño Gráfico', 'Diseño Industrial', 'Artes Plásticas', 'Música', 'Literatura', 'Periodismo', 'Publicidad', 'Cine']
      },
      'social': {
        nombre: 'Área Social / Humanista',
        descripcion: 'Tu fuerte es trabajar con personas. Te gusta enseñar, curar, orientar o ayudar a los demás a resolver sus problemas.',
        icono: 'groups',
        color: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        carreras: ['Psicología', 'Derecho', 'Educación / Pedagogía', 'Trabajo Social', 'Enfermería', 'Recursos Humanos', 'Comunicación']
      }
    };

    this.areaResultado = areasInfo[area];
    this.mostrandoResultado = true;
    this.completado = true;

    if (!fromSave) {
      // Otorgar recompensas only if new test
      this.experienciaGanada = 100;
      this.gamificationService.agregarExperiencia(this.experienciaGanada, 'Completar test vocacional');
      this.gamificationService.actualizarProgresoLogro('vocacion_clara', 1);
      this.gamificationService.verificarProgresoMisiones('test_completado');
      this.gamificationService.saveVocationalTestResult(area);

      // Verificar si es el primer test
      if (this.gamificationService.getUsuarioActual().testsCompletados === 0) {
        this.nuevaMedalla = 'Primer Paso Vocacional';
        this.gamificationService.otorgarMedalla('primer_test', 'Primer Paso Vocacional', '🎯', 'comun');
      }
    } else {
      // Show what was earned previously
      this.experienciaGanada = 100;
    }
  }

  compartirResultados(): void {
    this.gamificationService.compartirResultadosComoImagen('resultado-card', 'mis-resultados-innovauni.png');
  }

  explorarCarrera(carrera: string): void {
    this.router.navigate(['/universities'], {
      queryParams: { area: carrera }
    });
  }

  irAPersonalityTest(): void {
    this.router.navigate(['/quests/personality-test']);
  }

  reiniciarTest(): void {
    this.preguntaActual = 0;
    this.respuestas = [];
    this.respuestaSeleccionada = null;
    this.completado = false;
    this.mostrandoResultado = false;
  }

  volverAlDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
