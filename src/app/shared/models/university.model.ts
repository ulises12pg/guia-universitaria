export interface UniversityStats {
    prestigio: number;
    empleabilidad: number;
    salario: number;
    accesibilidad: number;
    calidadVida: number;
}

export interface University {
    id: string;
    nombre: string;
    siglas?: string;
    logo: string;
    ubicacion: string;
    tipo: 'Publica' | 'Privada';
    costoPromedio: string;
    salarioPromedio: string;
    empleabilidad: string;
    sitioWeb: string;
    descripcion: string; // Was missing in previous usage or named description
    areas: string[];
    stats: UniversityStats;
}
