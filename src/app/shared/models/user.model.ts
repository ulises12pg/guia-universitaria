export interface User {
    id: string;
    nombre: string;
    edad?: number;
    escuela?: string;
    email: string;
    nivel: number;
    experiencia: number;
    experienciaSiguienteNivel: number;
    monedas: number;
    medallas: Medalla[];
    logros: Logro[];
    universidadesVisitadas: string[];
    carrerasExploradas: string[];
    testsCompletados: number;
    misiones: Mision[];
    universidadesFavoritas: string[]; // IDs of favorite universities
    vocationalTestResult?: string; // Area name (e.g., 'Realista')
    personalityTestResult?: string; // Type (e.g., 'Introvertido')
    rachaDias: number;
    ultimaConexion: Date;
    avatar: string;
}

export interface Mision {
    id: string;
    titulo: string;
    descripcion: string;
    tipo: 'exploracion' | 'test' | 'conocimiento' | string;
    dificultad: number;
    objetivos: {
        id: string;
        descripcion: string;
        cantidad: number;
        progreso: number;
        completado: boolean;
    }[];
    recompensa: Recompensa;
    desbloqueada: boolean;
    completada: boolean;
    progreso: number;
    meta?: number;
}

export interface Medalla {
    id: string;
    nombre: string;
    descripcion: string;
    icono: string;
    color: string;
    rareza: 'comun' | 'rara' | 'epica' | 'legendaria';
    fechaObtencion: Date;
}

export interface Logro {
    id: string;
    titulo: string;
    descripcion: string;
    icono: string;
    progreso: number;
    progresoMaximo: number;
    completado: boolean;
    recompensa: Recompensa;
}

export interface Recompensa {
    tipo: 'experiencia' | 'monedas' | 'medalla' | 'avatar';
    cantidad: number;
    itemId?: string;
}
