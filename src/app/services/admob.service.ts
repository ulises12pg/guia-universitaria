
import { Injectable } from '@angular/core';
import {
    AdMob,
    BannerAdOptions,
    BannerAdSize,
    BannerAdPosition,
    AdOptions,
    RewardAdOptions,
    AdLoadInfo,
    RewardAdPluginEvents,
    AdMobRewardItem
} from '@capacitor-community/admob';

// ============================================================
// IDs de prueba de Google AdMob (cambiar por IDs reales en producción)
// Documentación: https://developers.google.com/admob/android/test-ads
// ============================================================
const TEST_AD_IDS = {
    BANNER: 'ca-app-pub-3940256099942544/6300978111',
    INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
    REWARDED: 'ca-app-pub-3940256099942544/5224354917',
    APP_ID: 'ca-app-pub-3940256099942544~3347511713'
};

// ============================================================
// PRODUCCIÓN: Cuando el cliente tenga su cuenta de AdMob,
// reemplazar los IDs de arriba con los reales:
// ============================================================
// const PROD_AD_IDS = {
//     BANNER: 'ca-app-pub-XXXXXXXXXX/YYYYYYYYYY',
//     INTERSTITIAL: 'ca-app-pub-XXXXXXXXXX/YYYYYYYYYY',
//     REWARDED: 'ca-app-pub-XXXXXXXXXX/YYYYYYYYYY',
//     APP_ID: 'ca-app-pub-XXXXXXXXXX~YYYYYYYYYY'
// };

@Injectable({
    providedIn: 'root'
})
export class AdMobService {
    private isInitialized = false;
    private isPremium = false;
    private isNativePlatform = false;

    // Control de frecuencia para interstitials
    private lastInterstitialTime = 0;
    private interstitialCooldownMs = 120000; // 2 minutos entre interstitials
    private interstitialCount = 0;
    private maxInterstitialsPerSession = 6; // Máximo por sesión

    // Estado de anuncios rewarded
    private rewardedAdLoaded = false;
    private rewardCallback: (() => void) | null = null;

    constructor() { }

    /**
     * Inicializa AdMob. Debe llamarse una vez al iniciar la app.
     */
    async initialize(): Promise<void> {
        try {
            // Verificar si estamos en una plataforma nativa
            this.isNativePlatform = this.checkNativePlatform();
            if (!this.isNativePlatform) {
                console.log('AdMob: Not on native platform, skipping initialization');
                return;
            }

            await AdMob.initialize({
                testingDevices: [],
                initializeForTesting: true, // ← Cambiar a false en producción
            });
            this.isInitialized = true;
            console.log('✅ AdMob initialized successfully');

            // Pre-cargar interstitial y rewarded
            this.preloadInterstitial();
            this.preloadRewarded();
        } catch (e) {
            console.error('❌ AdMob initialization failed', e);
        }
    }

    /**
     * Verifica si estamos en Android/iOS (no en el navegador web)
     */
    private checkNativePlatform(): boolean {
        return typeof (window as any)?.Capacitor !== 'undefined' &&
            (window as any)?.Capacitor?.isNativePlatform() === true;
    }

    // ============================================================
    // BANNER ADS - Se muestran en la parte inferior de la pantalla
    // ============================================================

    /**
     * Muestra un banner en la parte inferior de la pantalla.
     * Se mantiene visible mientras el usuario navega.
     */
    async showBanner(): Promise<void> {
        if (!this.canShowAds()) return;

        const options: BannerAdOptions = {
            adId: TEST_AD_IDS.BANNER,
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: true // ← Cambiar a false en producción
        };

        try {
            await AdMob.showBanner(options);
            console.log('📢 Banner shown');
        } catch (e) {
            console.error('Failed to show banner', e);
        }
    }

    /**
     * Oculta el banner temporalmente (ej: durante un test)
     */
    async hideBanner(): Promise<void> {
        if (!this.isNativePlatform) return;
        try {
            await AdMob.hideBanner();
        } catch (e) {
            console.error('Failed to hide banner', e);
        }
    }

    /**
     * Muestra el banner nuevamente después de ocultarlo
     */
    async resumeBanner(): Promise<void> {
        if (!this.canShowAds()) return;
        try {
            await AdMob.resumeBanner();
        } catch (e) {
            console.error('Failed to resume banner', e);
        }
    }

    // ============================================================
    // INTERSTITIAL ADS - Pantalla completa entre secciones
    // ============================================================

    /**
     * Pre-carga un interstitial para mostrarlo después.
     * Llamar después de mostrar uno, para tener el siguiente listo.
     */
    private async preloadInterstitial(): Promise<void> {
        if (!this.canShowAds()) return;

        const options: AdOptions = {
            adId: TEST_AD_IDS.INTERSTITIAL,
            isTesting: true // ← Cambiar a false en producción
        };

        try {
            await AdMob.prepareInterstitial(options);
            console.log('📦 Interstitial preloaded');
        } catch (e) {
            console.error('Failed to preload interstitial', e);
        }
    }

    /**
     * Muestra un interstitial (pantalla completa).
     * Respeta el cooldown para no molestar al usuario.
     * Ideal para llamar al:
     * - Terminar entrenamiento diario
     * - Completar un test vocacional/personalidad
     * - Salir de la sección de exámenes
     */
    async showInterstitial(): Promise<boolean> {
        if (!this.canShowAds()) return false;

        // Verificar cooldown
        const now = Date.now();
        if (now - this.lastInterstitialTime < this.interstitialCooldownMs) {
            console.log('⏳ Interstitial on cooldown, skipping');
            return false;
        }

        // Verificar máximo por sesión
        if (this.interstitialCount >= this.maxInterstitialsPerSession) {
            console.log('🛑 Max interstitials per session reached');
            return false;
        }

        try {
            await AdMob.showInterstitial();
            this.lastInterstitialTime = now;
            this.interstitialCount++;
            console.log(`📢 Interstitial shown (${this.interstitialCount}/${this.maxInterstitialsPerSession})`);

            // Pre-cargar el siguiente
            this.preloadInterstitial();
            return true;
        } catch (e) {
            console.error('Failed to show interstitial', e);
            // Intentar pre-cargar de nuevo
            this.preloadInterstitial();
            return false;
        }
    }

    // ============================================================
    // REWARDED ADS - El usuario ve un anuncio a cambio de algo
    // ============================================================

    /**
     * Pre-carga un anuncio rewarded.
     */
    private async preloadRewarded(): Promise<void> {
        if (!this.canShowAds()) return;

        const options: RewardAdOptions = {
            adId: TEST_AD_IDS.REWARDED,
            isTesting: true // ← Cambiar a false en producción
        };

        try {
            await AdMob.prepareRewardVideoAd(options);
            this.rewardedAdLoaded = true;
            console.log('📦 Rewarded ad preloaded');
        } catch (e) {
            this.rewardedAdLoaded = false;
            console.error('Failed to preload rewarded ad', e);
        }
    }

    /**
     * Muestra un anuncio rewarded. El usuario debe verlo completo
     * para recibir la recompensa.
     * 
     * @param onReward Callback que se ejecuta cuando el usuario completa el anuncio
     * @returns true si se mostró el anuncio, false si no estaba disponible
     * 
     * Ejemplo de uso:
     * ```
     * const shown = await admobService.showRewarded(() => {
     *     // Dar 5 preguntas extra al usuario
     *     this.addBonusQuestions(5);
     * });
     * ```
     */
    async showRewarded(onReward: () => void): Promise<boolean> {
        if (!this.canShowAds()) {
            // Si no podemos mostrar ads (web o premium), dar la recompensa gratis
            onReward();
            return true;
        }

        if (!this.rewardedAdLoaded) {
            console.log('⏳ Rewarded ad not loaded yet, trying to load...');
            await this.preloadRewarded();
            if (!this.rewardedAdLoaded) {
                console.log('❌ Could not load rewarded ad');
                return false;
            }
        }

        try {
            // Configurar el listener para la recompensa
            this.rewardCallback = onReward;
            AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward: AdMobRewardItem) => {
                console.log('🎁 User earned reward:', reward);
                if (this.rewardCallback) {
                    this.rewardCallback();
                    this.rewardCallback = null;
                }
            });

            await AdMob.showRewardVideoAd();
            this.rewardedAdLoaded = false;
            console.log('📢 Rewarded ad shown');

            // Pre-cargar el siguiente
            this.preloadRewarded();
            return true;
        } catch (e) {
            console.error('Failed to show rewarded ad', e);
            this.rewardCallback = null;
            this.preloadRewarded();
            return false;
        }
    }

    /**
     * Verifica si hay un anuncio rewarded disponible para mostrar
     */
    isRewardedAdReady(): boolean {
        return this.rewardedAdLoaded && this.canShowAds();
    }

    // ============================================================
    // PREMIUM / CONTROL
    // ============================================================

    /**
     * Establece si el usuario es premium (no mostrar anuncios)
     */
    setPremiumStatus(isPremium: boolean): void {
        this.isPremium = isPremium;
        if (isPremium) {
            this.hideBanner();
        }
    }

    /**
     * Verifica si se pueden mostrar anuncios
     */
    private canShowAds(): boolean {
        if (this.isPremium) return false;
        if (!this.isNativePlatform) return false;
        if (!this.isInitialized) return false;
        return true;
    }

    /**
     * Verifica si estamos en plataforma nativa
     */
    isNative(): boolean {
        return this.isNativePlatform;
    }
}
