# Script para copiar y renombrar iconos de Icon Kitchen correctamente

$origenIconos = "C:\Users\ulica\Downloads\IconKitchen-Output\android\res"
$destinoProyecto = "C:\Users\ulica\.gemini\antigravity\scratch\guia-universitaria\android\app\src\main\res"

Write-Host "Copiando y renombrando iconos personalizados..." -ForegroundColor Cyan
Write-Host ""

# Carpetas mipmap
$carpetasMipmap = @("mipmap-mdpi", "mipmap-hdpi", "mipmap-xhdpi", "mipmap-xxhdpi", "mipmap-xxxhdpi")

foreach ($carpeta in $carpetasMipmap) {
    $origen = Join-Path $origenIconos $carpeta
    $destino = Join-Path $destinoProyecto $carpeta
    
    if (Test-Path $origen) {
        # Copiar y renombrar InnovaUni.png -> ic_launcher.png
        $archivoOrigen = Join-Path $origen "InnovaUni.png"
        if (Test-Path $archivoOrigen) {
            Copy-Item -Path $archivoOrigen -Destination (Join-Path $destino "ic_launcher.png") -Force
            Copy-Item -Path $archivoOrigen -Destination (Join-Path $destino "ic_launcher_round.png") -Force
            Write-Host "  Copiado: $carpeta\ic_launcher.png" -ForegroundColor Green
        }
        
        # Copiar InnovaUni_foreground.png -> ic_launcher_foreground.png
        $foregroundOrigen = Join-Path $origen "InnovaUni_foreground.png"
        if (Test-Path $foregroundOrigen) {
            Copy-Item -Path $foregroundOrigen -Destination (Join-Path $destino "ic_launcher_foreground.png") -Force
            Write-Host "  Copiado: $carpeta\ic_launcher_foreground.png" -ForegroundColor Green
        }
    }
}

# Copiar archivos XML adaptativos
$xmlOrigen = Join-Path $origenIconos "mipmap-anydpi-v26\InnovaUni.xml"
if (Test-Path $xmlOrigen) {
    $xmlDestino = Join-Path $destinoProyecto "mipmap-anydpi-v26"
    
    # Leer el contenido del XML y reemplazar referencias
    $xmlContent = Get-Content $xmlOrigen -Raw
    $xmlContent = $xmlContent -replace 'InnovaUni_background', 'ic_launcher_background'
    $xmlContent = $xmlContent -replace 'InnovaUni_foreground', 'ic_launcher_foreground'
    $xmlContent = $xmlContent -replace 'InnovaUni_monochrome', 'ic_launcher_monochrome'
    
    # Guardar como ic_launcher.xml
    $xmlContent | Set-Content (Join-Path $xmlDestino "ic_launcher.xml") -Force
    $xmlContent | Set-Content (Join-Path $xmlDestino "ic_launcher_round.xml") -Force
    
    Write-Host "  Copiado: mipmap-anydpi-v26\ic_launcher.xml" -ForegroundColor Green
    Write-Host "  Copiado: mipmap-anydpi-v26\ic_launcher_round.xml" -ForegroundColor Green
}

# Copiar drawables (background y foreground)
$drawableDestino = Join-Path $destinoProyecto "drawable"
$drawableV24Destino = Join-Path $destinoProyecto "drawable-v24"

# Crear archivos de background y foreground
# Background color (usar blanco por defecto)
$backgroundXml = @"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FFFFFF</color>
</resources>
"@

$backgroundXml | Set-Content (Join-Path $destinoProyecto "values\ic_launcher_background.xml") -Force
Write-Host "  Creado: values\ic_launcher_background.xml" -ForegroundColor Green

Write-Host ""
Write-Host "Iconos aplicados correctamente!" -ForegroundColor Green
Write-Host ""
