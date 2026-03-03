import { Injectable, effect } from '@angular/core';
// Service for gamification logic
import { BehaviorSubject, Observable } from 'rxjs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { User, Medalla, Logro, Recompensa, Mision } from '../../shared/models/user.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class GamificationService {
    private readonly NIVELES_EXP = [0, 100, 250, 500, 1000, 1500, 2200, 3000, 4000, 5500];

    getRangoActual(nivel: number): { titulo: string, icono: string, color: string } {
        if (nivel >= 5) {
            return { titulo: 'Diamante', icono: 'diamond', color: '#b9f2ff' }; // Diamond blue
        } else if (nivel >= 3) {
            return { titulo: 'Oro', icono: 'emoji_events', color: '#ffd700' }; // Gold
        } else {
            return { titulo: 'Plata', icono: 'stars', color: '#c0c0c0' }; // Silver
        }
    }

    private logrosDefinidos: Logro[] = [
        {
            id: 'primer_paso',
            titulo: 'Primer Paso',
            descripcion: 'Completa tu perfil inicial',
            icono: '👤',
            progreso: 0,
            progresoMaximo: 1,
            completado: false,
            recompensa: { tipo: 'experiencia', cantidad: 100 }
        },
        {
            id: 'explorador_novato',
            titulo: 'Explorador Novato',
            descripcion: 'Visita 3 universidades diferentes',
            icono: '🏛️',
            progreso: 0,
            progresoMaximo: 3,
            completado: false,
            recompensa: { tipo: 'medalla', cantidad: 1, itemId: 'explorador_bronce' }
        },
        {
            id: 'autoconocimiento',
            titulo: 'Autoconocimiento',
            descripcion: 'Completa el Test de Personalidad',
            icono: '🧠',
            progreso: 0,
            progresoMaximo: 1,
            completado: false,
            recompensa: { tipo: 'experiencia', cantidad: 250 }
        },
        {
            id: 'vocacion_clara',
            titulo: 'Vocación Clara',
            descripcion: 'Completa tu primer test vocacional',
            icono: '🔮',
            progreso: 0,
            progresoMaximo: 1,
            completado: false,
            recompensa: { tipo: 'experiencia', cantidad: 400 }
        },
        {
            id: 'comparador_experto',
            titulo: 'Comparador Experto',
            descripcion: 'Compara 3 universidades',
            icono: '⚖️',
            progreso: 0,
            progresoMaximo: 3,
            completado: false,
            recompensa: { tipo: 'medalla', cantidad: 1, itemId: 'analitico' }
        },
        {
            id: 'coleccionista',
            titulo: 'Coleccionista',
            descripcion: 'Guarda 3 universidades en favoritos',
            icono: '❤️',
            progreso: 0,
            progresoMaximo: 3,
            completado: false,
            recompensa: { tipo: 'experiencia', cantidad: 250 }
        },
        {
            id: 'universitario',
            titulo: 'Universitario',
            descripcion: 'Visita 5 universidades en total',
            icono: '🎓',
            progreso: 0,
            progresoMaximo: 5,
            completado: false,
            recompensa: { tipo: 'experiencia', cantidad: 500 }
        }
    ];

    private readonly MISIONES_INICIALES: Mision[] = [
        {
            id: 'm1',
            titulo: 'Explorador de Campus',
            descripcion: 'Visita 3 universidades de tu zona',
            tipo: 'exploracion',
            dificultad: 2,
            objetivos: [
                { id: 'o1', descripcion: 'Visitar UNAM', cantidad: 1, progreso: 0, completado: false },
                { id: 'o2', descripcion: 'Visitar IPN', cantidad: 1, progreso: 0, completado: false },
                { id: 'o3', descripcion: 'Visitar UAM', cantidad: 1, progreso: 0, completado: false }
            ],
            recompensa: { tipo: 'experiencia', cantidad: 300 },
            desbloqueada: true,
            completada: false,
            progreso: 0,
            meta: 3
        },
        {
            id: 'm2',
            titulo: 'Test Vocacional Inicial',
            descripcion: 'Descubre tu área de interés',
            tipo: 'test',
            dificultad: 1,
            objetivos: [
                { id: 'o1', descripcion: 'Completar test de aptitudes', cantidad: 1, progreso: 0, completado: false }
            ],
            recompensa: { tipo: 'medalla', cantidad: 1, itemId: 'primer_test' },
            desbloqueada: true,
            completada: false,
            progreso: 0,
            meta: 1
        },
        {
            id: 'm3',
            titulo: 'Mente Ágil',
            descripcion: 'Completa 1 Reto del Día',
            tipo: 'training',
            dificultad: 1,
            objetivos: [
                { id: 'o1', descripcion: 'Completar entrenamiento diario', cantidad: 1, progreso: 0, completado: false }
            ],
            recompensa: { tipo: 'experiencia', cantidad: 150 },
            desbloqueada: true,
            completada: false,
            progreso: 0,
            meta: 1
        },
        {
            id: 'm4',
            titulo: 'Coleccionista de Saberes',
            descripcion: 'Guarda 1 universidad en favoritos',
            tipo: 'favoritos',
            dificultad: 1,
            objetivos: [
                { id: 'o1', descripcion: 'Guardar universidad favorita', cantidad: 1, progreso: 0, completado: false }
            ],
            recompensa: { tipo: 'experiencia', cantidad: 100 },
            desbloqueada: true,
            completada: false,
            progreso: 0,
            meta: 1
        },
        {
            id: 'm5',
            titulo: 'Analista Crítico',
            descripcion: 'Usa el comparador de universidades',
            tipo: 'comparador',
            dificultad: 2,
            objetivos: [
                { id: 'o1', descripcion: 'Comparar universidades', cantidad: 1, progreso: 0, completado: false }
            ],
            recompensa: { tipo: 'experiencia', cantidad: 200 },
            desbloqueada: true,
            completada: false,
            progreso: 0,
            meta: 1
        }
    ];

    private usuarioSubject = new BehaviorSubject<User>(this.getDefaultUser()); // Start with default/empty
    public usuario$ = this.usuarioSubject.asObservable();
    private currentUserId: string | null = null; // Track current key

    constructor(private authService: AuthService) {
        // Subscribe to Auth changes
        this.authService.currentUser.update(u => u); // Ensure signal is active (optional)

        // Signal effect or manual subscription? 
        // using effect() is better if in injection context, but manually subscribing to signal is fine too
        // Since we are in constructor...
        // Actually, let's use the signal directly or effect if we convert content to use basic subscription for compatibility

        // Helper to watch signal
        const val = this.authService.currentUser();
        if (val) this.loadUser(val.id, val.email);

        // We need to react to future changes. Signal -> Observable or Effect.
        // Since we don't have effect() easily outside component without runInInjectionContext sometimes
        // Let's simplified assuming we can poll or Auth notifies us.
        // Actually Auth has `currentUser: WritableSignal`.
        // Let's use a standard workaround or just verify if Auth calls us?
        // Better: Auth service can emit an event or we just check on init. 
        // User said: "según el usuario Logueado... ya lea".
        // Let's try to subscribe to the Supabase auth state change directly here too?
        // No, avoid duplication.
        // Let's make GamificationService expose a method `setUser(user: any)` and call it from App/Dashboard?
        // OR, inject Auth and use `toObservable`?
        // Simplified: Just use `effect` in constructor (Angular 16+).
    }

    // Call this when Auth detects change (or use effect if available)
    public syncWithAuth(supabaseUser: any) {
        if (supabaseUser) {
            this.loadUser(supabaseUser.id, supabaseUser.email);
        } else {
            this.loadGuestUser();
        }
    }

    getUsuarioActual(): User {
        return this.usuarioSubject.value;
    }

    private async loadUser(userId: string, email: string | undefined): Promise<void> {
        this.currentUserId = userId;
        const key = `innovauni_data_${userId}`;

        // 1. Load from LocalStorage first (Cache / Offline)
        const stored = localStorage.getItem(key);
        let localUser: User | null = null;
        if (stored) {
            localUser = JSON.parse(stored);
            this.ensureDataIntegrity(localUser!);
            if (email && localUser!.email !== email) localUser!.email = email;
            this.usuarioSubject.next(localUser!);
        }

        // 2. Fetch from Supabase (Source of Truth)
        try {
            const { data, error } = await this.authService.supabaseClient
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (data && data.game_data && Object.keys(data.game_data).length > 0) {
                const cloudUser = data.game_data as User;
                // Merge or overwrite? Cloud should win usually, unless local is newer? 
                // For simplicity: Cloud wins if it exists.

                // Ensure ID and Email are correct
                cloudUser.id = userId;
                cloudUser.email = email || cloudUser.email;
                if (!cloudUser.nombre && data.full_name) cloudUser.nombre = data.full_name;

                this.ensureDataIntegrity(cloudUser);
                this.usuarioSubject.next(cloudUser);

                // Update local cache
                localStorage.setItem(key, JSON.stringify(cloudUser));
            } else if (!localUser) {
                // No cloud data, no local data -> New User
                const newUser = this.getDefaultUser();
                newUser.id = userId;
                newUser.email = email || '';
                newUser.nombre = email?.split('@')[0] || 'Usuario';
                this.usuarioSubject.next(newUser);
                this.guardarProgreso(); // Init DB
            } else {
                // Has local data but no cloud data (or empty cloud). Sync local to cloud.
                this.guardarProgreso();
            }
        } catch (err) {
            console.error('Error loading from Supabase:', err);
            // Fallback is already loaded from localStorage
            if (!localUser) {
                const newUser = this.getDefaultUser();
                newUser.id = userId;
                newUser.email = email || '';
                this.usuarioSubject.next(newUser);
            }
        }
    }

    private loadGuestUser(): void {
        this.currentUserId = null;
        const key = 'innovauni_user';
        const stored = localStorage.getItem(key);
        if (stored) {
            const user = JSON.parse(stored);
            this.ensureDataIntegrity(user);
            this.usuarioSubject.next(user);
        } else {
            this.usuarioSubject.next(this.getDefaultUser());
        }
    }

    private ensureDataIntegrity(user: User) {
        if (!user.logros || user.logros.length === 0) user.logros = JSON.parse(JSON.stringify(this.logrosDefinidos));
        if (!user.misiones || user.misiones.length === 0) user.misiones = JSON.parse(JSON.stringify(this.MISIONES_INICIALES));
        // Merge missing missions/logros if new ones were added to code
        // (Simplified for now)
    }

    agregarExperiencia(cantidad: number, razon: string): void {
        const usuario = this.usuarioSubject.value;
        const expAnterior = usuario.experiencia;
        usuario.experiencia += cantidad;

        // Verificar subida de nivel
        while (usuario.experiencia >= usuario.experienciaSiguienteNivel) {
            this.subirNivel(usuario);
        }

        this.usuarioSubject.next({ ...usuario });
        this.mostrarNotificacionExp(cantidad, razon);
        this.guardarProgreso();
    }

    actualizarPerfil(datos: Partial<User>): void {
        const usuario = this.usuarioSubject.value;
        const nuevoUsuario = { ...usuario, ...datos };
        this.usuarioSubject.next(nuevoUsuario);
        this.guardarProgreso();
    }

    private subirNivel(usuario: User): void {
        usuario.nivel++;
        const expSobrante = usuario.experiencia - usuario.experienciaSiguienteNivel;
        usuario.experiencia = expSobrante;
        usuario.experienciaSiguienteNivel = this.NIVELES_EXP[usuario.nivel] ||
            usuario.experienciaSiguienteNivel * 1.5;

        // Recompensas por nivel
        if (usuario.nivel % 5 === 0) {
            this.otorgarMedalla(`nivel_${usuario.nivel}`, `Nivel ${usuario.nivel}`, '🏆', 'oro');
        }

        this.mostrarCelebracionNivel(usuario.nivel);
    }

    completarLogro(logroId: string): void {
        const usuario = this.usuarioSubject.value;
        const logro = usuario.logros.find(l => l.id === logroId);

        if (logro && !logro.completado) {
            logro.completado = true;
            logro.progreso = logro.progresoMaximo;

            this.otorgarRecompensa(logro.recompensa);
            this.mostrarCelebracionLogro(logro);
            this.usuarioSubject.next({ ...usuario });
            this.guardarProgreso();
        }
    }

    actualizarProgresoLogro(logroId: string, progreso: number): void {
        const usuario = this.usuarioSubject.value;
        const logro = usuario.logros?.find(l => l.id === logroId);

        if (logro && !logro.completado) {
            // Ensure logro.progresoMaximo is defined and valid before comparison
            const maximo = logro.progresoMaximo || 1;
            logro.progreso = Math.min(progreso, maximo);
            if (logro.progreso >= maximo) {
                this.completarLogro(logroId);
            } else {
                this.usuarioSubject.next({ ...usuario });
            }
        }
    }

    verificarProgresoMisiones(accion: string, datos?: any): void {
        const usuario = this.usuarioSubject.value;
        let huboCambios = false;

        usuario.misiones.forEach(mision => {
            if (mision.completada || !mision.desbloqueada) return;

            if (mision.tipo === 'exploracion' && accion === 'visita_universidad') {
                const universidadKey = datos.id; // e.g., 'unam', 'ipn'

                // Check specific objectives
                mision.objetivos.forEach(obj => {
                    if (obj.descripcion.toLowerCase().includes(universidadKey.toLowerCase()) && !obj.completado) {
                        obj.progreso = 1;
                        obj.completado = true;
                        mision.progreso++;
                        huboCambios = true;
                        this.mostrarNotificacionExp(100, `Objetivo completado: ${obj.descripcion}`);
                    }
                });
            } else if (mision.tipo === 'test' && accion === 'test_completado') {
                mision.progreso++;
                mision.objetivos.forEach(obj => {
                    if (!obj.completado) {
                        obj.progreso++;
                        if (obj.progreso >= obj.cantidad) obj.completado = true;
                    }
                });
                huboCambios = true;
            } else if (mision.tipo === 'training' && accion === 'training_completed') {
                mision.progreso++;
                mision.objetivos.forEach(obj => {
                    if (!obj.completado) {
                        obj.progreso++;
                        if (obj.progreso >= obj.cantidad) obj.completado = true;
                    }
                });
                huboCambios = true;
            } else if (mision.tipo === 'favoritos' && accion === 'favorito_agregado') {
                mision.progreso++;
                mision.objetivos.forEach(obj => {
                    if (!obj.completado) {
                        obj.progreso++;
                        if (obj.progreso >= obj.cantidad) obj.completado = true;
                    }
                });
                huboCambios = true;
            } else if (mision.tipo === 'comparador' && accion === 'comparador_usado') {
                mision.progreso++;
                mision.objetivos.forEach(obj => {
                    if (!obj.completado) {
                        obj.progreso++;
                        if (obj.progreso >= obj.cantidad) obj.completado = true;
                    }
                });
                huboCambios = true;
            }

            // Check completion
            if (mision.progreso >= (mision.meta || 1) && !mision.completada) {
                mision.completada = true;
                this.otorgarRecompensa(mision.recompensa);
                console.log(`¡Misión completada: ${mision.titulo}!`);
                huboCambios = true;
            }
        });

        if (huboCambios) {
            this.usuarioSubject.next({ ...usuario });
            this.guardarProgreso();
        }
    }

    toggleFavorito(uniId: string): void {
        const usuario = this.usuarioSubject.value;
        const index = usuario.universidadesFavoritas?.indexOf(uniId) ?? -1;

        if (!usuario.universidadesFavoritas) {
            usuario.universidadesFavoritas = [];
        }

        if (index > -1) {
            usuario.universidadesFavoritas.splice(index, 1);
        } else {
            usuario.universidadesFavoritas.push(uniId);
            // Verify 'coleccionista' achievement (Store 3 favorites)
            this.actualizarProgresoLogro('coleccionista', usuario.universidadesFavoritas.length);
            // Verify 'favoritos' mission
            this.verificarProgresoMisiones('favorito_agregado');
        }

        this.usuarioSubject.next({ ...usuario });
        this.guardarProgreso();
    }

    registrarVisitaUniversidad(uniId: string): void {
        const usuario = this.usuarioSubject.value;

        // Ensure array exists
        if (!usuario.universidadesVisitadas) {
            usuario.universidadesVisitadas = [];
        }

        // Check if already visited in this session or history to counting unique visits
        if (!usuario.universidadesVisitadas.includes(uniId)) {
            usuario.universidadesVisitadas.push(uniId);
            this.mostrarNotificacionExp(50, `Nueva universidad visitada`);

            // Update 'explorador_novato' achievement
            // Achievement ID: 'explorador_novato', Max Progress: 3
            this.actualizarProgresoLogro('explorador_novato', usuario.universidadesVisitadas.length);

            // Update 'universitario' achievement (Visit 5 universities)
            this.actualizarProgresoLogro('universitario', usuario.universidadesVisitadas.length);

            this.usuarioSubject.next({ ...usuario });
            this.guardarProgreso();
        }

        // Also verify missions (e.g. "Visit UNAM", etc.)
        this.verificarProgresoMisiones('visita_universidad', { id: uniId });
    }

    registrarEntrenamientoCompletado(xp: number): void {
        this.agregarExperiencia(xp, 'Entrenamiento Diario Completado');
        this.verificarProgresoMisiones('training_completed');
    }

    saveVocationalTestResult(result: string): void {
        const usuario = this.usuarioSubject.value;
        usuario.vocationalTestResult = result;
        // Increment testsCompletados only if not previously completed or tracked elsewhere
        // For simplicity, we rely on existing logic for 'testsCompletados' counter if separate
        this.usuarioSubject.next({ ...usuario });
        this.completarLogro('vocacion_clara'); // Award immediately on 1 test
        this.guardarProgreso();
    }

    savePersonalityTestResult(result: string): void {
        const usuario = this.usuarioSubject.value;
        usuario.personalityTestResult = result;
        this.usuarioSubject.next({ ...usuario });
        this.completarLogro('autoconocimiento');
        this.guardarProgreso();
    }

    otorgarMedalla(id: string, nombre: string, icono: string, rareza: string): void {
        const usuario = this.usuarioSubject.value;
        const medalla: Medalla = {
            id,
            nombre,
            descripcion: this.getDescripcionMedalla(id),
            icono,
            color: this.getColorPorRareza(rareza),
            rareza: rareza as any,
            fechaObtencion: new Date()
        };

        usuario.medallas.push(medalla);
        this.mostrarAnimacionMedalla(medalla);
        this.usuarioSubject.next({ ...usuario });
    }

    private getDescripcionMedalla(id: string): string {
        const descripciones: { [key: string]: string } = {
            'explorador_bronce': 'Has dado tus primeros pasos explorando universidades',
            'analitico': 'Eres un experto comparando opciones educativas',
            'nivel_5': '¡Has alcanzado el nivel 5! Sigue así',
            'maestro_vocacional': 'Completaste todos los tests disponibles'
        };
        return descripciones[id] || 'Medalla especial por tus logros';
    }

    private getColorPorRareza(rareza: string): string {
        const colores = {
            'comun': '#CD7F32',
            'rara': '#C0C0C0',
            'epica': '#FFD700',
            'legendaria': '#9370DB'
        };
        return colores[rareza as keyof typeof colores] || '#CD7F32';
    }

    private mostrarCelebracionNivel(nivel: number): void {
        // Implementar animación de confeti y notificación
        console.log(`¡Felicidades! Has alcanzado el nivel ${nivel}`);
    }

    private mostrarCelebracionLogro(logro: Logro): void {
        console.log(`¡Logro desbloqueado: ${logro.titulo}!`);
    }

    private mostrarAnimacionMedalla(medalla: Medalla): void {
        console.log(`¡Nueva medalla: ${medalla.nombre}!`);
    }

    private mostrarNotificacionExp(cantidad: number, razon: string): void {
        console.log(`+${cantidad} EXP: ${razon}`);
    }

    private otorgarRecompensa(recompensa: Recompensa): void {
        const usuario = this.usuarioSubject.value;
        switch (recompensa.tipo) {
            case 'experiencia':
                this.agregarExperiencia(recompensa.cantidad, 'Recompensa de logro');
                break;
            case 'monedas':
                usuario.monedas += recompensa.cantidad;
                break;
            case 'medalla':
                // La medalla se otorga por separado
                break;
        }
    }

    private guardarProgreso(): void {
        const user = this.usuarioSubject.value;
        let key = 'innovauni_user';

        if (this.currentUserId) {
            key = `innovauni_data_${this.currentUserId}`;
        }

        // 1. Save to LocalStorage (Immediate feedback)
        localStorage.setItem(key, JSON.stringify(user));

        // 2. Sync to Supabase (Background)
        if (this.currentUserId) {
            // Debounce could be added here to avoid spamming DB on every XP gain
            // For now, fire and forget (optimistic)
            const profileUpdate = {
                id: this.currentUserId,
                updated_at: new Date(),
                username: user.email?.split('@')[0] || 'user',
                full_name: user.nombre,
                // avatar_url removed as it may not exist in user's schema
                game_data: user
            };

            this.authService.supabaseClient
                .from('profiles')
                .upsert(profileUpdate)
                .then(({ error }) => {
                    if (error) console.error('Error syncing to Supabase:', error);
                });
        }
    }

    // getUsuarioInicial replaced by loadGasuestUser/loadUser logic
    // Keeping a helper if needed or removing it.
    // We already initialized Subject with getDefaultUser() in declaration.

    private getDefaultUser(): User {
        return {
            id: 'user_' + Date.now(),
            nombre: '',
            email: '',
            nivel: 1,
            experiencia: 0,
            experienciaSiguienteNivel: 100,
            monedas: 0,
            medallas: [],
            logros: this.logrosDefinidos.map(l => ({ ...l })), // Clone to avoid ref issues
            misiones: this.MISIONES_INICIALES,
            universidadesFavoritas: [],
            universidadesVisitadas: [],
            carrerasExploradas: [],
            testsCompletados: 0,
            rachaDias: 1,
            ultimaConexion: new Date(),
            avatar: 'avatar_default.png'
        };
    }

    // --- PDF / Hall of Fame ---
    // --- PDF / Hall of Fame ---
    checkAllMedalsEarned(): boolean {
        const usuario = this.usuarioSubject.value;
        if (!usuario || !usuario.logros) return false;

        // Achievements that reward a medal
        const achievementsWithMedals = this.logrosDefinidos.filter(l => l.recompensa.tipo === 'medalla');

        // Check if user has completed all of them
        const allEarned = achievementsWithMedals.every(def => {
            const userLogro = usuario.logros.find(ul => ul.id === def.id);
            return userLogro && userLogro.completado;
        });

        console.log('Check All Medals:', allEarned);
        return allEarned;
    }

    generateCertificate(): void {
        const user = this.usuarioSubject.value;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // --- Design Constants ---
        const width = 297;
        const height = 210;
        const margin = 20;
        const primaryColor = '#1a237e'; // Dark Blue
        const accentColor = '#ffd700'; // Gold
        const textColor = '#333333';

        // --- Background & Border (Fun Style) ---
        // Fun colorful border
        doc.setDrawColor(primaryColor);
        doc.setLineWidth(2);
        doc.rect(10, 10, width - 20, height - 20);

        doc.setDrawColor('#E91E63'); // Pink/Fun accent
        doc.setLineWidth(1);
        doc.rect(15, 15, width - 30, height - 30);

        // --- Header Section (Compressed & Fun) ---
        let yPos = 30; // Started higher (was 40)

        // Title
        doc.setFontSize(40);
        doc.setTextColor(primaryColor);
        doc.setFont('helvetica', 'bold'); // More modern than Times
        doc.text('¡TU AVENTURA COMIENZA!', width / 2, yPos, { align: 'center' });

        yPos += 15;
        doc.setFontSize(18);
        doc.setTextColor('#E91E63'); // Fun pink
        doc.text('InnovaUni 1.2 reconoce a:', width / 2, yPos, { align: 'center' });

        yPos += 20;
        doc.setFont('helvetica', 'bolditalic');
        doc.setFontSize(32);
        doc.setTextColor(textColor); // Black/Dark Grey
        doc.text(user.nombre || 'Futuro Universitario', width / 2, yPos, { align: 'center' });

        // --- Motivational Text ---
        yPos += 15;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.setTextColor('#555');
        doc.text('Por tu curiosidad, energía y ganas de descubrir tu camino.', width / 2, yPos, { align: 'center' });
        doc.text('¡El futuro es tuyo para conquistarlo!', width / 2, yPos + 7, { align: 'center' });

        // --- Two Column Content (Adjusted Position) ---
        yPos += 20; // Starts around 100-110mm
        const colWidth = (width - (margin * 3)) / 2;
        const col1X = margin + 10;
        const col2X = (width / 2) + 10;
        const boxHeight = 65; // Slightly shorter box

        // Background for columns (Softer look)
        doc.setFillColor(240, 248, 255); // AliceBlue
        doc.roundedRect(col1X - 5, yPos - 10, colWidth, boxHeight, 5, 5, 'F');
        doc.roundedRect(col2X - 5, yPos - 10, colWidth, boxHeight, 5, 5, 'F');

        // Column 1: Tu Perfil
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.text('Tu Perfil de Explorador', col1X, yPos);

        let colY = yPos + 15;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(textColor);

        doc.text(`• Personalidad:`, col1X, colY);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#E91E63');
        doc.text(`${user.personalityTestResult || 'Pendiente'}`, col1X + 40, colY);

        colY += 12;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(textColor);
        doc.text(`• Vocación:`, col1X, colY);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#E91E63');
        doc.text(`${user.vocationalTestResult || 'Pendiente'}`, col1X + 40, colY);

        colY += 12;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(textColor);
        doc.text(`• Rango Actual:`, col1X, colY);
        const rango = this.getRangoActual(user.nivel);
        doc.setTextColor(primaryColor);
        doc.setFont('helvetica', 'bold');
        doc.text(`${rango.titulo.toUpperCase()}`, col1X + 40, colY);

        // Column 2: Tus Logros
        doc.setTextColor(primaryColor);
        doc.setFontSize(16);
        doc.text('Tus Hazañas', col2X, yPos);

        colY = yPos + 15;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(textColor);

        doc.text(`• Nivel Desbloqueado: ${user.nivel}`, col2X, colY);
        colY += 10;
        doc.text(`• Unis Visitadas: ${user.universidadesVisitadas?.length || 0}`, col2X, colY);
        colY += 10;
        doc.text(`• Medallas Ganadas: ${user.logros.filter(l => l.completado).length}`, col2X, colY);

        colY += 10;
        doc.text('• Tu Top 1:', col2X, colY);
        const topFav = user.universidadesFavoritas?.[0]?.toUpperCase() || '¡Explora más!';
        doc.setFont('helvetica', 'italic');
        doc.setTextColor('#1976D2');
        doc.text(`  ${topFav}`, col2X, colY + 7);

        // --- Footer (Simple & Fun) ---
        const footerY = height - 15;

        // Date only, no signature line
        const today = new Date().toLocaleDateString();
        doc.setFont('courier', 'bold');
        doc.setFontSize(10);
        doc.setTextColor('#888');
        doc.text(`Generado el: ${today} en InnovaUni 1.2 - ¡Sigue explorando!`, width / 2, footerY, { align: 'center' });
        // Save
        doc.save(`certificado_innovauni_${user.nombre.replace(/\s+/g, '_')}.pdf`);
    }

    resetGamification(): void {
        const currentUser = this.usuarioSubject.value;
        const defaultUser = this.getDefaultUser();

        // Keep profile info
        const newUser: User = {
            ...defaultUser,
            id: currentUser.id,
            nombre: currentUser.nombre,
            email: currentUser.email,
            escuela: currentUser.escuela,
            edad: currentUser.edad,
            avatar: currentUser.avatar,
            // Keep favorites and history if desired? Request said "Reset de los Logros (Gamificacion - EXP)"
            // so we reset XP, Level, Medals, Logros, Misiones.
            // We can keep universitiesVisitadas/testsCompletados if they are "Gamification" related or "Profile" related.
            // Usually "Reset Gamification" means resetting progress, so I'll reset history too to match level 1.
        };

        this.usuarioSubject.next(newUser);
        this.guardarProgreso();
        window.location.reload(); // Reload to refresh all components cleanly
    }

    hardReset(): void {
        localStorage.removeItem('innovauni_user');
        window.location.href = '/'; // Force reload to root, which triggers onboarding check
    }
    async compartirResultadosComoImagen(elementId: string, nombreArchivo: string = 'resultado-innovauni.png', ignoreClase: string = 'no-capture'): Promise<void> {
        try {
            const element = document.getElementById(elementId);
            if (!element) {
                console.error('Elemento no encontrado para capturar:', elementId);
                return;
            }

            // Capturar el elemento como canvas
            const canvas = await html2canvas(element, {
                scale: 2, // Mejor calidad
                useCORS: true,
                backgroundColor: null, // Fondo transparente si es posible, o blanco por defecto
                ignoreElements: (el) => {
                    return el.classList.contains(ignoreClase);
                }
            });

            // Convertir a base64
            const base64Data = canvas.toDataURL('image/png');

            // Si estamos en un entorno nativo (Capacitor), guardamos y compartimos
            // Remover el prefijo data:image/png;base64, para guardar
            const cleanBase64 = base64Data.replace('data:image/png;base64,', '');

            // Guardar temporalmente en el sistema de archivos
            const savedFile = await Filesystem.writeFile({
                path: nombreArchivo,
                data: cleanBase64,
                directory: Directory.Cache
            });

            // Compartir el archivo
            await Share.share({
                title: 'Mis Resultados InnovaUni 2.0',
                text: '¡Mira mis resultados vocacionales en InnovaUni 2.0! 🚀',
                url: savedFile.uri,
                dialogTitle: 'Compartir mis resultados'
            });

        } catch (error) {
            console.error('Error al compartir imagen:', error);
            // Fallback para web: descargar la imagen
            const link = document.createElement('a');
            link.download = nombreArchivo;
            link.href = 'data:image/png;base64,'; // Placeholder, should get from canvas if failing capacitor
            // Re-intento simple para web si falla lo nativo o no es nativo
            const element = document.getElementById(elementId);
            if (element) {
                html2canvas(element).then(canvas => {
                    const base64Data = canvas.toDataURL('image/png');
                    link.href = base64Data;
                    link.click();
                });
            }
        }
    }
}
