# Guía para Personalizar el Icono de InnovaUni 2.0

## 📋 Tamaños de Iconos Requeridos

Android requiere múltiples tamaños del icono para diferentes densidades de pantalla:

| Carpeta | Tamaño | Archivo |
|---------|--------|---------|
| `mipmap-mdpi` | 48x48 px | `ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png` |
| `mipmap-hdpi` | 72x72 px | `ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png` |
| `mipmap-xhdpi` | 96x96 px | `ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png` |
| `mipmap-xxhdpi` | 144x144 px | `ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png` |
| `mipmap-xxxhdpi` | 192x192 px | `ic_launcher.png`, `ic_launcher_round.png`, `ic_launcher_foreground.png` |

## 🎨 Opción 1: Usar Herramienta Online (Recomendado)

### Icon Kitchen (https://icon.kitchen/)
1. Visita https://icon.kitchen/
2. Sube tu imagen (PNG, 512x512px o mayor)
3. Personaliza:
   - **Foreground**: Tu logo/símbolo principal
   - **Background**: Color de fondo o imagen
   - **Shape**: Cuadrado, círculo, squircle, etc.
4. Descarga el ZIP
5. Extrae y copia las carpetas `mipmap-*` a:
   ```
   android/app/src/main/res/
   ```

### Android Asset Studio (https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
1. Visita el sitio
2. Sube tu imagen
3. Ajusta padding, color de fondo, forma
4. Descarga el ZIP
5. Extrae y reemplaza los archivos

## 🖼️ Opción 2: Generar con IA

Puedo generar un icono personalizado para ti. Solo necesito que me digas:
- **Estilo**: Moderno, minimalista, académico, tecnológico, etc.
- **Colores**: Azul, morado, gradientes, etc.
- **Símbolos**: Libro, birrete, cohete, universidad, etc.

Ejemplo de prompt:
```
"Un icono moderno para una app universitaria llamada InnovaUni 2.0,
con un birrete de graduación estilizado en azul y morado,
diseño minimalista, fondo degradado"
```

## 🛠️ Opción 3: Usar Capacitor Assets

Capacitor puede generar automáticamente los iconos desde una imagen fuente:

1. Crea una imagen de 1024x1024px llamada `icon.png`
2. Colócala en: `resources/icon.png`
3. Ejecuta:
   ```bash
   npm install @capacitor/assets --save-dev
   npx capacitor-assets generate
   ```

## 📝 Estructura de Archivos de Iconos

```
android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png (48x48)
│   ├── ic_launcher_round.png (48x48)
│   └── ic_launcher_foreground.png (108x108)
├── mipmap-hdpi/
│   ├── ic_launcher.png (72x72)
│   ├── ic_launcher_round.png (72x72)
│   └── ic_launcher_foreground.png (162x162)
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96x96)
│   ├── ic_launcher_round.png (96x96)
│   └── ic_launcher_foreground.png (216x216)
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144x144)
│   ├── ic_launcher_round.png (144x144)
│   └── ic_launcher_foreground.png (324x324)
├── mipmap-xxxhdpi/
│   ├── ic_launcher.png (192x192)
│   ├── ic_launcher_round.png (192x192)
│   └── ic_launcher_foreground.png (432x432)
├── mipmap-anydpi-v26/
│   ├── ic_launcher.xml (Adaptive icon)
│   └── ic_launcher_round.xml (Adaptive icon round)
├── drawable/
│   └── ic_launcher_background.xml (Background color/drawable)
└── drawable-v24/
    └── ic_launcher_foreground.xml (Foreground vector)
```

## 🎯 Iconos Adaptativos (Android 8.0+)

Los iconos adaptativos tienen dos capas:
- **Foreground**: El logo/símbolo principal (puede ser PNG o XML vector)
- **Background**: Color sólido o imagen de fondo

Archivos clave:
- `mipmap-anydpi-v26/ic_launcher.xml`
- `drawable/ic_launcher_background.xml`
- `drawable-v24/ic_launcher_foreground.xml`

## 🔄 Después de Cambiar los Iconos

1. Sincroniza con Capacitor:
   ```bash
   npx cap sync android
   ```

2. Limpia y reconstruye:
   ```bash
   cd android
   ./gradlew clean assembleDebug
   ```

3. O simplemente reconstruye:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

## 💡 Consejos de Diseño

1. **Simplicidad**: Los iconos pequeños deben ser simples y reconocibles
2. **Contraste**: Usa colores que contrasten bien
3. **Sin texto**: Evita texto pequeño, no se leerá bien
4. **Padding**: Deja espacio alrededor del símbolo principal
5. **Prueba**: Verifica cómo se ve en diferentes fondos (claro/oscuro)

## 🎨 Colores Sugeridos para InnovaUni 2.0

Basado en el tema actual de la app:
- **Primario**: `#667eea` (Azul/Morado)
- **Secundario**: `#764ba2` (Morado)
- **Acento**: `#f093fb` (Rosa claro)
- **Fondo**: `#FFFFFF` (Blanco)

## 📦 Recursos Útiles

- **Icon Kitchen**: https://icon.kitchen/
- **Android Asset Studio**: https://romannurik.github.io/AndroidAssetStudio/
- **Capacitor Assets**: https://github.com/ionic-team/capacitor-assets
- **Material Icons**: https://fonts.google.com/icons
- **Flaticon**: https://www.flaticon.com/
- **Icons8**: https://icons8.com/

## ✅ Checklist Final

- [ ] Iconos creados para todas las densidades (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi)
- [ ] Iconos redondos creados (`ic_launcher_round.png`)
- [ ] Foreground icons creados (`ic_launcher_foreground.png`)
- [ ] Archivos XML adaptativos actualizados (si aplica)
- [ ] Color de fondo configurado en `ic_launcher_background.xml`
- [ ] Sincronizado con `npx cap sync android`
- [ ] APK reconstruido
- [ ] Probado en dispositivo/emulador
