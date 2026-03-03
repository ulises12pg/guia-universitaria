import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GamificationService } from '../../../core/services/gamification.service';
import { AdMobService } from '../../../services/admob.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface Pregunta {
    id: number;
    texto: string;
    opciones: {
        valor: 'A' | 'B';
        texto: string;
    }[];
}

export const pulseAnimation = trigger('pulse', [
    state('active', style({ transform: 'scale(0.98)' })),
    state('inactive', style({ transform: 'scale(1)' })),
    transition('inactive => active', animate('100ms ease-in')),
    transition('active => inactive', animate('100ms ease-out'))
]);

export const fadeInAnimation = trigger('fadeIn', [
    transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ])
]);

@Component({
    selector: 'app-personality-test',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule
    ],
    templateUrl: './personality-test.html',
    styleUrls: ['./personality-test.scss'],
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
        pulseAnimation,
        fadeInAnimation
    ]
})
export class PersonalityTestComponent {
    preguntas: Pregunta[] = [
        {
            id: 1,
            texto: 'Después de una semana larga y estresante, ¿qué prefieres hacer para recargar energías?',
            opciones: [
                { valor: 'A', texto: 'Quedarme en casa viendo películas, leyendo o descansando solo.' },
                { valor: 'B', texto: 'Salir con amigos, ir a una fiesta o estar rodeado de gente.' }
            ]
        },
        {
            id: 2,
            texto: 'En una reunión social con muchas personas que no conoces, ¿cómo te sientes?',
            opciones: [
                { valor: 'A', texto: 'Un poco agotado; prefiero quedarme con la gente que ya conozco o irme temprano.' },
                { valor: 'B', texto: 'Energizado; me encanta conocer gente nueva y socializar.' }
            ]
        },
        {
            id: 3,
            texto: '¿Cómo prefieres comunicarte en el trabajo o en la escuela?',
            opciones: [
                { valor: 'A', texto: 'Por correo electrónico o mensajes de texto, para tener tiempo de pensar mi respuesta.' },
                { valor: 'B', texto: 'En persona o por llamada telefónica, para resolverlo rápido y charlar.' }
            ]
        },
        {
            id: 4,
            texto: '¿Qué tipo de pasatiempos disfrutas más?',
            opciones: [
                { valor: 'A', texto: 'Actividades solitarias como leer, escribir, pintar, videojuegos de un solo jugador o jardinería.' },
                { valor: 'B', texto: 'Actividades grupales como deportes de equipo, juegos de mesa con amigos o clubes sociales.' }
            ]
        },
        {
            id: 5,
            texto: 'Cuando tienes un problema personal, ¿qué sueles hacer?',
            opciones: [
                { valor: 'A', texto: 'Reflexiono sobre ello internamente antes de compartirlo con alguien más.' },
                { valor: 'B', texto: 'Lo hablo inmediatamente con amigos o familiares para desahogarme y buscar consejo.' }
            ]
        },
        {
            id: 6,
            texto: '¿Cómo te describirían tus amigos más cercanos?',
            opciones: [
                { valor: 'A', texto: 'Como alguien tranquilo, observador y que sabe escuchar.' },
                { valor: 'B', texto: 'Como alguien animado, hablador y el alma de la fiesta.' }
            ]
        },
        {
            id: 7,
            texto: '¿Te sientes cómodo siendo el centro de atención?',
            opciones: [
                { valor: 'A', texto: 'No mucho, prefiero pasar desapercibido o que se reconozca mi trabajo sin tanto protagonismo.' },
                { valor: 'B', texto: 'Sí, no me molesta e incluso puedo disfrutarlo en ciertas situaciones.' }
            ]
        },
        {
            id: 8,
            texto: '¿Prefieres tener...?',
            opciones: [
                { valor: 'A', texto: 'Unos pocos amigos muy cercanos y profundos.' },
                { valor: 'B', texto: 'Un círculo social amplio con muchos conocidos y amigos de diferentes grupos.' }
            ]
        }
    ];

    preguntaActual = 0;
    respuestas: ('A' | 'B')[] = [];
    completado = false;
    resultado: string = '';
    descripcionResultado: string = '';
    currentQuestion: Pregunta;
    animationState = 'in';
    respuestaTemp: 'A' | 'B' | null = null;

    constructor(
        private router: Router,
        private gamificationService: GamificationService,
        private admobService: AdMobService,
        private cdr: ChangeDetectorRef
    ) {
        this.currentQuestion = this.preguntas[0];
        // Load saved result if exists
        const user = this.gamificationService.getUsuarioActual();
        if (user.personalityTestResult) {
            this.completado = true;
            this.calcularResultado(user.personalityTestResult);
        }
    }

    seleccionarOpcion(valor: 'A' | 'B') {
        this.respuestaTemp = valor;
    }

    siguientePregunta() {
        if (!this.respuestaTemp) return;

        this.respuestas.push(this.respuestaTemp);
        this.respuestaTemp = null;

        if (this.preguntaActual < this.preguntas.length - 1) {
            this.animationState = 'out';
            setTimeout(() => {
                this.preguntaActual++;
                this.currentQuestion = this.preguntas[this.preguntaActual];
                this.animationState = 'in';
                this.cdr.detectChanges();
            }, 300);
        } else {
            this.calcularResultado();
        }
    }

    calcularResultado(savedResult?: string) {
        if (savedResult) {
            this.resultado = savedResult;
            this.setDescripcion(savedResult);
            return;
        }

        const conteoA = this.respuestas.filter(r => r === 'A').length;
        const conteoB = this.respuestas.filter(r => r === 'B').length;

        if (conteoA > conteoB + 2) {
            this.resultado = 'Introvertido';
        } else if (conteoB > conteoA + 2) {
            this.resultado = 'Extrovertido';
        } else {
            this.resultado = 'Ambivertido';
        }

        this.setDescripcion(this.resultado);
        this.completado = true;

        // Save result
        this.gamificationService.savePersonalityTestResult(this.resultado);
        this.gamificationService.agregarExperiencia(80, 'Test de Personalidad Completado');

        // Mostrar interstitial al completar el test
        this.admobService.showInterstitial();
    }

    setDescripcion(tipo: string) {
        if (tipo === 'Introvertido') {
            this.descripcionResultado = 'Tiendes a recargar energía estando a solas o en entornos tranquilos. Prefieres la reflexión interna antes que la acción inmediata y valoras las relaciones profundas con pocas personas sobre las interacciones superficiales con muchas.';
        } else if (tipo === 'Extrovertido') {
            this.descripcionResultado = 'Obtienes energía al interactuar con el mundo exterior y con otras personas. Te sientes cómodo en grupos grandes, sueles pensar mientras hablas y disfrutas de la variedad y la estimulación social.';
        } else {
            this.descripcionResultado = 'Tus respuestas están muy equilibradas. Esto significa que puedes adaptarte bien tanto a la soledad como a la compañía, dependiendo de tu estado de ánimo y del contexto.';
        }
    }

    reiniciarTest() {
        this.preguntaActual = 0;
        this.currentQuestion = this.preguntas[0];
        this.respuestas = [];
        this.respuestaTemp = null;
        this.completado = false;
        this.resultado = '';
        this.animationState = 'in';
    }

    volverAlDashboard() {
        this.router.navigate(['/dashboard']);
    }

    compartirResultados(): void {
        this.gamificationService.compartirResultadosComoImagen('resultado-personalidad', 'mi-personalidad-innovauni.png');
    }
}
