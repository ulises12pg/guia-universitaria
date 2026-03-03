import { Recompensa } from './user.model';

export interface Mision {
    id: string;
    titulo: string;
    descripcion: string;
    tipo: TipoMision;
    dificultad: 1 | 2 | 3 | 4 | 5;
    objetivos: Objetivo[];
    recompensa: Recompensa;
    tiempoLimite?: number; // en minutos
    desbloqueada: boolean;
    completada: boolean;
    progreso: number;
}

export type TipoMision =
    | 'exploracion'      // Visitar universidades
    | 'conocimiento'     // Leer sobre carreras
    | 'test'            // Realizar tests vocacionales
    | 'interaccion'     // Comparar universidades
    | 'social'          // Compartir/invitar amigos
    | 'diaria';         // Misiones diarias

export interface Objetivo {
    id: string;
    descripcion: string;
    cantidad: number;
    progreso: number;
    completado: boolean;
}
