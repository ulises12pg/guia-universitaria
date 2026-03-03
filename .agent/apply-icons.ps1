# Script para Aplicar Iconos de Icon Kitchen a InnovaUni 2.0

# CONFIGURACIÓN
$origenIconos = "C:\Users\ulica\Downloads\IconKitchen-Output\android\res"
$destinoProyecto = "C:\Users\ulica\.gemini\antigravity\scratch\guia-universitaria\android\app\src\main\res"

# Verificar que la carpeta de origen existe
if (-not (Test-Path $origenIconos)) {
    Write-Host "ERROR: No se encontro la carpeta de origen: $origenIconos" -ForegroundColor Red
    exit 1
}

Write-Host "Aplicando iconos personalizados a InnovaUni 2.0..." -ForegroundColor Cyan
Write-Host ""

# Crear backup de los iconos actuales
$timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$backupFolder = "C:\Users\ulica\.gemini\antigravity\scratch\guia-universitaria\android\app\src\main\res_backup_$timestamp"
Write-Host "Creando backup de iconos actuales en: $backupFolder" -ForegroundColor Yellow

# Carpetas de iconos a respaldar
$carpetasIconos = @(
    "mipmap-mdpi",
    "mipmap-hdpi", 
    "mipmap-xhdpi",
    "mipmap-xxhdpi",
    "mipmap-xxxhdpi",
    "mipmap-anydpi-v26",
    "drawable",
    "drawable-v24"
)

# Crear backup
New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null
foreach ($carpeta in $carpetasIconos) {
    $origen = Join-Path $destinoProyecto $carpeta
    if (Test-Path $origen) {
        $destino = Join-Path $backupFolder $carpeta
        Copy-Item -Path $origen -Destination $destino -Recurse -Force
        Write-Host "  Backup de $carpeta" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Copiando nuevos iconos..." -ForegroundColor Cyan

# Copiar los nuevos iconos
$carpetasMipmap = @("mipmap-mdpi", "mipmap-hdpi", "mipmap-xhdpi", "mipmap-xxhdpi", "mipmap-xxxhdpi")

foreach ($carpeta in $carpetasMipmap) {
    $origen = Join-Path $origenIconos $carpeta
    $destino = Join-Path $destinoProyecto $carpeta
    
    if (Test-Path $origen) {
        $archivos = Get-ChildItem -Path $origen -Filter "ic_launcher*"
        foreach ($archivo in $archivos) {
            Copy-Item -Path $archivo.FullName -Destination $destino -Force
            Write-Host "  Copiado: $carpeta\$($archivo.Name)" -ForegroundColor Green
        }
    } else {
        Write-Host "  No se encontro: $carpeta" -ForegroundColor Yellow
    }
}

# Copiar archivos XML adaptativos si existen
$xmlAdaptativo = Join-Path $origenIconos "mipmap-anydpi-v26"
if (Test-Path $xmlAdaptativo) {
    $destinoXml = Join-Path $destinoProyecto "mipmap-anydpi-v26"
    Copy-Item -Path "$xmlAdaptativo\*" -Destination $destinoXml -Force
    Write-Host "  Copiados archivos XML adaptativos" -ForegroundColor Green
}

# Copiar drawables si existen
$drawableOrigen = Join-Path $origenIconos "drawable"
if (Test-Path $drawableOrigen) {
    $drawableDestino = Join-Path $destinoProyecto "drawable"
    $archivosDrawable = Get-ChildItem -Path $drawableOrigen -Filter "ic_launcher*"
    foreach ($archivo in $archivosDrawable) {
        Copy-Item -Path $archivo.FullName -Destination $drawableDestino -Force
        Write-Host "  Copiado: drawable\$($archivo.Name)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Iconos aplicados exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Cyan
Write-Host "1. Sincronizar con Capacitor:" -ForegroundColor White
Write-Host "   npx cap sync android" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Reconstruir el APK:" -ForegroundColor White
Write-Host "   cd android" -ForegroundColor Gray
Write-Host "   Set JAVA_HOME y ejecutar gradlew assembleDebug" -ForegroundColor Gray
Write-Host ""
Write-Host "Backup guardado en: $backupFolder" -ForegroundColor Yellow
