import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
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
    selector: 'app-quick-riddles',
    standalone: true,
    imports: [
        CommonModule,
        MatProgressBarModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule
    ],
    templateUrl: './quick-riddles.html',
    styleUrls: ['./quick-riddles.scss'],
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
export class QuickRiddlesComponent implements OnInit {
    preguntas = [
        // 🧠 Los de Lógica y Números 
        {
            id: 1,
            categoria: '🧠 Lógica y Números',
            texto: 'El Mes: Algunos meses tienen 30 días, otros 31. ¿Cuántos tienen 28?',
            opciones: [
                { id: 'a', texto: 'Solo 1', icono: 'event' },
                { id: 'b', texto: 'Todos', icono: 'calendar_month', correcta: true },
                { id: 'c', texto: '6 meses', icono: 'date_range' },
                { id: 'd', texto: 'Depende del año', icono: 'update' }
            ]
        },
        {
            id: 2,
            categoria: '🧠 Lógica y Números',
            texto: 'La Carrera: Si vas en una carrera y adelantas al que va segundo, ¿en qué posición quedas?',
            opciones: [
                { id: 'a', texto: 'Primero', icono: 'emoji_events' },
                { id: 'b', texto: 'Segundo', icono: 'looks_two', correcta: true },
                { id: 'c', texto: 'Tercero', icono: 'looks_3' },
                { id: 'd', texto: 'Último', icono: 'directions_run' }
            ]
        },
        {
            id: 3,
            categoria: '🧠 Lógica y Números',
            texto: 'El Cumpleaños: Una persona cumple años hoy. El año que viene cumplirá 12 años, pero el año pasado tenía 9. ¿Cómo es posible?',
            opciones: [
                { id: 'a', texto: 'Nació un 29 de febrero', icono: 'cake', correcta: true },
                { id: 'b', texto: 'Viajó en el tiempo', icono: 'hourglass_empty' },
                { id: 'c', texto: 'Las matemáticas fallan', icono: 'calculate' },
                { id: 'd', texto: 'Nació el 1 de enero', icono: 'celebration' }
            ]
        },
        {
            id: 4,
            categoria: '🧠 Lógica y Números',
            texto: 'Las Velas: Hay 10 velas encendidas en una habitación. Entra un viento y apaga 3. ¿Cuántas quedan al final?',
            opciones: [
                { id: 'a', texto: '7 velas', icono: 'whatshot' },
                { id: 'b', texto: '0 velas', icono: 'highlight_off' },
                { id: 'c', texto: '10 velas', icono: 'wb_incandescent' },
                { id: 'd', texto: '3 velas', icono: 'flare', correcta: true }
            ]
        },
        {
            id: 5,
            categoria: '🧠 Lógica y Números',
            texto: 'Los Hermanos: Un niño tiene el mismo número de hermanos que de hermanas, pero cada hermana tiene solo la mitad de hermanas que de hermanos. ¿Cuántos son?',
            opciones: [
                { id: 'a', texto: '3 hermanos y 3 hermanas', icono: 'people' },
                { id: 'b', texto: '4 hermanos y 3 hermanas', icono: 'family_restroom', correcta: true },
                { id: 'c', texto: '5 hermanos y 2 hermanas', icono: 'boy' },
                { id: 'd', texto: '2 hermanos y 4 hermanas', icono: 'girl' }
            ]
        },
        // ⚡ Los Capciosos y Rápidos
        {
            id: 6,
            categoria: '⚡ Capciosos y Rápidos',
            texto: 'El Desastre: Un avión se estrella justo en la frontera entre España y Portugal. ¿Dónde entierran a los supervivientes?',
            opciones: [
                { id: 'a', texto: 'En España', icono: 'public' },
                { id: 'b', texto: 'En Portugal', icono: 'map' },
                { id: 'c', texto: 'Mitad y mitad', icono: 'pie_chart' },
                { id: 'd', texto: 'A los supervivientes no se les entierra', icono: 'health_and_safety', correcta: true }
            ]
        },
        {
            id: 7,
            categoria: '⚡ Capciosos y Rápidos',
            texto: 'El Padre: El padre de Rosa tiene 5 hijas: Nana, Nene, Nini, Nono y... ¿quién es la quinta?',
            opciones: [
                { id: 'a', texto: 'Nunu', icono: 'spellcheck' },
                { id: 'b', texto: 'Rosa', icono: 'local_florist', correcta: true },
                { id: 'c', texto: 'Nina', icono: 'face_3' },
                { id: 'd', texto: 'No se sabe', icono: 'question_mark' }
            ]
        },
        {
            id: 8,
            categoria: '⚡ Capciosos y Rápidos',
            texto: 'La Pregunta: ¿Qué pregunta nadie puede responder con un "no" si es verdad?',
            opciones: [
                { id: 'a', texto: '¿Estás dormido?', icono: 'snooze', correcta: true },
                { id: 'b', texto: '¿Puedes oírme?', icono: 'hearing' },
                { id: 'c', texto: '¿Mientes?', icono: 'psychology_alt' },
                { id: 'd', texto: '¿Estás vivo?', icono: 'favorite' }
            ]
        },
        {
            id: 9,
            categoria: '⚡ Capciosos y Rápidos',
            texto: 'El Peso: ¿Qué pesa más, un kilo de plumas o un kilo de plomo?',
            opciones: [
                { id: 'a', texto: 'Las plumas', icono: 'cruelty_free' },
                { id: 'b', texto: 'El plomo', icono: 'fitness_center' },
                { id: 'c', texto: 'Pesan lo mismo', icono: 'balance', correcta: true },
                { id: 'd', texto: 'Depende de la gravedad', icono: 'public' }
            ]
        },
        {
            id: 10,
            categoria: '⚡ Capciosos y Rápidos',
            texto: 'La Sombra: ¿Qué es lo que se hace más grande cuanto más le quitas?',
            opciones: [
                { id: 'a', un_agujero: true, texto: 'Un agujero', icono: 'trip_origin', correcta: true },
                { id: 'b', texto: 'Una deuda', icono: 'account_balance_wallet' },
                { id: 'c', texto: 'El hambre', icono: 'restaurant' },
                { id: 'd', texto: 'El tiempo', icono: 'schedule' }
            ]
        },
        // 💡 Un poco de ingenio extra
        {
            id: 11,
            categoria: '💡 Ingenio Extra',
            texto: 'El Interruptor: ¿Qué tiene dientes pero nunca muerde?',
            opciones: [
                { id: 'a', texto: 'Un cocodrilo de juguete', icono: 'toys' },
                { id: 'b', texto: 'Un ajo', icono: 'eco' },
                { id: 'c', texto: 'Un peine', icono: 'face_retouching_natural', correcta: true },
                { id: 'd', texto: 'Una sierra', icono: 'carpenter' }
            ]
        },
        {
            id: 12,
            categoria: '💡 Ingenio Extra',
            texto: 'El Silencio: Si me nombras, desaparezco. ¿Quién soy?',
            opciones: [
                { id: 'a', texto: 'Un secreto', icono: 'lock' },
                { id: 'b', texto: 'El silencio', icono: 'volume_off', correcta: true },
                { id: 'c', texto: 'La oscuridad', icono: 'dark_mode' },
                { id: 'd', texto: 'Un fantasma', icono: 'visibility_off' }
            ]
        },
        {
            id: 13,
            categoria: '💡 Ingenio Extra',
            texto: 'El Edificio: ¿Cuál es el edificio que tiene más historias?',
            opciones: [
                { id: 'a', texto: 'La biblioteca', icono: 'local_library', correcta: true },
                { id: 'b', texto: 'Un rascacielos', icono: 'apartment' },
                { id: 'c', texto: 'Un hospital', icono: 'local_hospital' },
                { id: 'd', texto: 'Un museo', icono: 'museum' }
            ]
        },
        {
            id: 14,
            categoria: '💡 Ingenio Extra',
            texto: 'El Café: ¿Cómo se puede tomar un café con leche si no hay vacas, ni soja, ni almendras, ni nada que dé "leche"?',
            opciones: [
                { id: 'a', texto: 'En sueños', icono: 'nights_stay' },
                { id: 'b', texto: 'Usando leche en polvo / en alta mar', icono: 'coffee', correcta: true },
                { id: 'c', texto: 'Imaginándolo', icono: 'psychology' },
                { id: 'd', texto: 'No se puede', icono: 'cancel' }
            ]
        },
        {
            id: 15,
            categoria: '💡 Ingenio Extra',
            texto: 'El Árbol: ¿Qué árbol puedes llevar en la mano?',
            opciones: [
                { id: 'a', texto: 'Un bonsai', icono: 'park' },
                { id: 'b', texto: 'La palmera', icono: 'pan_tool', correcta: true },
                { id: 'c', texto: 'Un pino', icono: 'forest' },
                { id: 'd', texto: 'El árbol genealógico', icono: 'account_tree' }
            ]
        },
        // 🧠 Tanda 2
        {
            id: 16,
            categoria: '🧠 Tanda 2',
            texto: 'El Ascensor: Un hombre vive en el piso 10. Siempre toma el ascensor hasta la planta baja para ir a trabajar. Cuando vuelve, sube hasta el piso 7 y luego camina por las escaleras los 3 pisos restantes. ¿Por qué lo hace?',
            opciones: [
                { id: 'a', texto: 'Porque quiere hacer ejercicio', icono: 'fitness_center' },
                { id: 'b', texto: 'Es de baja estatura y no llega al botón del 10', icono: 'child_care', correcta: true },
                { id: 'c', texto: 'El ascensor no sube más del 7', icono: 'warning' },
                { id: 'd', texto: 'Es su rutina', icono: 'loop' }
            ]
        },
        {
            id: 17,
            categoria: '🧠 Tanda 2',
            texto: 'El Mes Probable: ¿En qué mes hablan menos los humanos?',
            opciones: [
                { id: 'a', texto: 'Diciembre', icono: 'ac_unit' },
                { id: 'b', texto: 'Febrero', icono: 'event', correcta: true },
                { id: 'c', texto: 'Agosto', icono: 'wb_sunny' },
                { id: 'd', texto: 'Octubre', icono: 'park' }
            ]
        },
        {
            id: 18,
            categoria: '🧠 Tanda 2',
            texto: 'El Pariente: El hermano de mi padre tiene un hermano, pero no es mi tío. ¿Quién es?',
            opciones: [
                { id: 'a', texto: 'Mi abuelo', icono: 'elderly' },
                { id: 'b', texto: 'Yo', icono: 'person' },
                { id: 'c', texto: 'Mi padre', icono: 'man', correcta: true },
                { id: 'd', texto: 'Mi primo', icono: 'boy' }
            ]
        },
        {
            id: 19,
            categoria: '🧠 Tanda 2',
            texto: 'La Cesta: Tienes una cesta con 6 huevos. Si 6 personas se llevan un huevo cada una, ¿cómo es posible que quede un huevo en la cesta?',
            opciones: [
                { id: 'a', texto: 'Es magia', icono: 'auto_awesome' },
                { id: 'b', texto: 'Había 7 huevos', icono: 'egg' },
                { id: 'c', texto: 'Uno se llevó la cesta con el huevo', icono: 'shopping_basket', correcta: true },
                { id: 'd', texto: 'Alguien trajo otro', icono: 'add_circle' }
            ]
        },
        {
            id: 20,
            categoria: '🧠 Tanda 2',
            texto: 'El Color: Un tren eléctrico viaja hacia el norte a 100 km/h. El viento sopla hacia el sur a 50 km/h. ¿Hacia dónde va el humo?',
            opciones: [
                { id: 'a', texto: 'Hacia el sur', icono: 'south' },
                { id: 'b', texto: 'No echa humo, es eléctrico', icono: 'electric_rickshaw', correcta: true },
                { id: 'c', texto: 'Hacia el este', icono: 'east' },
                { id: 'd', texto: 'Hacia arriba', icono: 'arrow_upward' }
            ]
        },
        {
            id: 21,
            categoria: '🧠 Tanda 2',
            texto: 'La Palabra: ¿Qué palabra de 5 letras se escribe más corta si le añades dos letras?',
            opciones: [
                { id: 'a', texto: 'Corta', icono: 'text_decrease' },
                { id: 'b', texto: 'Largo', icono: 'text_increase' },
                { id: 'c', texto: 'Menos', icono: 'remove' },
                { id: 'd', texto: 'Corto', icono: 'short_text', correcta: true }
            ]
        },
        {
            id: 22,
            categoria: '🧠 Tanda 2',
            texto: 'El Barco: Un barco tiene una escalera colgada. Cada peldaño está a 30 cm. Si la marea sube 60 cm, ¿cuántos peldaños cubrirá el agua?',
            opciones: [
                { id: 'a', texto: '2 peldaños', icono: 'stairs' },
                { id: 'b', texto: 'Ninguno, el barco flota y sube', icono: 'sailing', correcta: true },
                { id: 'c', texto: '3 peldaños', icono: 'waves' },
                { id: 'd', texto: '5 peldaños', icono: 'water' }
            ]
        },
        {
            id: 23,
            categoria: '🧠 Tanda 2',
            texto: 'El Pobre: ¿Qué es lo que el pobre tiene, el rico necesita y si lo comes te mueres?',
            opciones: [
                { id: 'a', texto: 'Dinero', icono: 'attach_money' },
                { id: 'b', texto: 'Hambre', icono: 'restaurant' },
                { id: 'c', texto: 'Felicidad', icono: 'mood' },
                { id: 'd', texto: 'Nada', icono: 'block', correcta: true }
            ]
        },
        {
            id: 24,
            categoria: '🧠 Tanda 2',
            texto: 'La Rueda: ¿Qué rueda no gira cuando un coche gira a la derecha?',
            opciones: [
                { id: 'a', texto: 'La trasera derecha', icono: 'tire_repair' },
                { id: 'b', texto: 'La delantera izquierda', icono: 'explore' },
                { id: 'c', texto: 'La de repuesto', icono: 'album', correcta: true },
                { id: 'd', texto: 'Ninguna', icono: 'cancel' }
            ]
        },
        {
            id: 25,
            categoria: '🧠 Tanda 2',
            texto: 'El Sueño: ¿Cómo puede un hombre estar 8 días sin dormir?',
            opciones: [
                { id: 'a', texto: 'Bebiendo café', icono: 'local_cafe' },
                { id: 'b', texto: 'Trabajando', icono: 'work' },
                { id: 'c', texto: 'Durmiendo de noche', icono: 'nights_stay', correcta: true },
                { id: 'd', texto: 'Es imposible', icono: 'sentiment_dissatisfied' }
            ]
        },
        {
            id: 26,
            categoria: '🧠 Tanda 2',
            texto: 'El Árbol 2: ¿Qué parte del árbol siempre está en el suelo pero nunca se ensucia?',
            opciones: [
                { id: 'a', texto: 'La raíz', icono: 'grass' },
                { id: 'b', texto: 'La semilla', icono: 'eco' },
                { id: 'c', texto: 'La sombra', icono: 'dark_mode', correcta: true },
                { id: 'd', texto: 'La hoja', icono: 'spa' }
            ]
        },
        {
            id: 27,
            categoria: '🧠 Tanda 2',
            texto: 'La Inicial: ¿Qué empieza por "e", termina por "e" y solo tiene una letra?',
            opciones: [
                { id: 'a', texto: 'Un elefante', icono: 'pets' },
                { id: 'b', texto: 'La letra E', icono: 'sort_by_alpha' },
                { id: 'c', texto: 'Un sobre', icono: 'mail', correcta: true },
                { id: 'd', texto: 'Un espejo', icono: 'aspect_ratio' }
            ]
        },
        {
            id: 28,
            categoria: '🧠 Tanda 2',
            texto: 'El Autobús: Conduces un autobús. En la parada 1 bajan 3 y suben 5. En la 2 bajan 2 y sube 1. ¿Cómo se llama el conductor?',
            opciones: [
                { id: 'a', texto: 'Juan', icono: 'face' },
                { id: 'b', texto: 'El chofer', icono: 'directions_bus' },
                { id: 'c', texto: 'Tu nombre', icono: 'fingerprint', correcta: true },
                { id: 'd', texto: 'Pedro', icono: 'person' }
            ]
        },
        {
            id: 29,
            categoria: '🧠 Tanda 2',
            texto: 'El Animal: ¿Cuál es el animal que tiene más dientes?',
            opciones: [
                { id: 'a', texto: 'El tiburón', icono: 'sailing' },
                { id: 'b', texto: 'El cocodrilo', icono: 'warning' },
                { id: 'c', texto: 'La ballena', icono: 'water' },
                { id: 'd', texto: 'El ratoncito Pérez', icono: 'cruelty_free', correcta: true }
            ]
        },
        {
            id: 30,
            categoria: '🧠 Tanda 2',
            texto: 'La Cena: Dos padres y dos hijos fueron a pescar. Cada uno pescó un pez, pero llevaron 3 peces a casa. ¿Cómo?',
            opciones: [
                { id: 'a', texto: 'Uno se perdió', icono: 'question_mark' },
                { id: 'b', texto: 'Son abuelo, padre e hijo', icono: 'family_restroom', correcta: true },
                { id: 'c', texto: 'Se comieron uno', icono: 'restaurant' },
                { id: 'd', texto: 'Uno lo tiraron', icono: 'delete' }
            ]
        }
    ];

    preguntaActual = 0;
    aciertos = 0;
    respuestaSeleccionada: any = null;
    haRespondido = false;
    completado = false;
    mostrandoResultado = false;
    animationState = 'in';
    experienciaGanada = 0;

    constructor(
        private gamificationService: GamificationService,
        private cdr: ChangeDetectorRef,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.mezclarPreguntas();
    }

    mezclarPreguntas(): void {
        for (let i = this.preguntas.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.preguntas[i], this.preguntas[j]] = [this.preguntas[j], this.preguntas[i]];
        }
    }

    get preguntaActualPregunta() {
        return this.preguntas[this.preguntaActual];
    }

    get esUltimaPregunta() {
        return this.preguntaActual === this.preguntas.length - 1;
    }

    seleccionarRespuesta(opcion: any): void {
        if (this.haRespondido) return; // No dejar cambiar respuesta una vez seleccionado
        this.respuestaSeleccionada = opcion;
        this.haRespondido = true;
        if (opcion.correcta) {
            this.aciertos++;
        }
    }

    getOpcionClass(opcion: any): string {
        if (!this.haRespondido) {
            return this.respuestaSeleccionada === opcion ? 'selected' : '';
        }
        // Después de responder, mostrar qué era correcto y qué era incorrecto
        if (opcion.correcta) {
            return 'correct';
        }
        if (this.respuestaSeleccionada === opcion && !opcion.correcta) {
            return 'incorrect';
        }
        return '';
    }

    siguientePregunta(): void {
        if (this.haRespondido) {
            if (this.esUltimaPregunta) {
                this.calcularResultados();
            } else {
                this.animationState = 'out';
                setTimeout(() => {
                    this.preguntaActual++;
                    this.respuestaSeleccionada = null;
                    this.haRespondido = false;
                    this.animationState = 'in';
                    this.cdr.detectChanges();
                }, 300);
            }
        }
    }

    calcularResultados(): void {
        this.mostrandoResultado = true;
        this.completado = true;

        // Calcular experiencia basada en aciertos (ej. 10 EXP por acierto)
        this.experienciaGanada = this.aciertos * 10;
        if (this.experienciaGanada > 0) {
            this.gamificationService.agregarExperiencia(this.experienciaGanada, `Acertijos Completados (${this.aciertos}/${this.preguntas.length})`);
        }
    }

    get calificacion(): string {
        const porcentaje = (this.aciertos / this.preguntas.length) * 100;
        if (porcentaje === 100) return '¡Mente Maestra!';
        if (porcentaje >= 80) return '¡Excelente Ingenio!';
        if (porcentaje >= 50) return 'Buen Intento';
        return 'Necesitas más café...';
    }

    get colorResultado(): string {
        const porcentaje = (this.aciertos / this.preguntas.length) * 100;
        if (porcentaje === 100) return 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
        if (porcentaje >= 80) return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
        if (porcentaje >= 50) return 'linear-gradient(135deg, #1fa2ff 0%, #12d8fa 100%)';
        return 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)';
    }

    compartirResultados(): void {
        this.gamificationService.compartirResultadosComoImagen('resultado-card', 'mis-acertijos-innovauni.png');
    }

    reiniciarTest(): void {
        this.mezclarPreguntas();
        this.preguntaActual = 0;
        this.aciertos = 0;
        this.respuestaSeleccionada = null;
        this.haRespondido = false;
        this.completado = false;
        this.mostrandoResultado = false;
    }

    volverAlDashboard(): void {
        this.router.navigate(['/dashboard']);
    }
}
