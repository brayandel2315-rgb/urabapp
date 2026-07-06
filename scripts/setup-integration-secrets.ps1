# Urabapp — subir secrets de integraciones a Supabase
# Requiere: npx supabase login (una vez, con brayandel001@gmail.com)

$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\.."

$projectRef = "ekqaocauvoajpjyraeyo"
$secretsFile = "supabase/functions/.env.secrets"

if (-not (Test-Path $secretsFile)) {
    $example = "supabase/functions/.env.secrets.example"
    if (Test-Path $example) {
        Copy-Item $example $secretsFile
        Write-Host "Creado $secretsFile desde ejemplo" -ForegroundColor Yellow
    } else {
        Write-Host "No existe $secretsFile" -ForegroundColor Red
        exit 1
    }
}

$secrets = Get-Content $secretsFile -Raw
if ($secrets -notmatch 'VAPID_PUBLIC_KEY=\S+' -or $secrets -notmatch 'VAPID_PRIVATE_KEY=\S+') {
    Write-Host "Faltan claves VAPID en $secretsFile" -ForegroundColor Red
    Write-Host "Ejecuta: npm run setup:vapid" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "=== Urabapp · Secrets Edge Functions ===" -ForegroundColor Green
Write-Host "Proyecto: $projectRef" -ForegroundColor Cyan
Write-Host ""

Write-Host "Si no has iniciado sesión, se abrirá el navegador..." -ForegroundColor Yellow
npx supabase login
if ($LASTEXITCODE -ne 0) {
    Write-Host "Login falló (necesitas terminal interactiva)." -ForegroundColor Red
    Write-Host "Dashboard: https://supabase.com/dashboard/project/$projectRef/settings/functions" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "Subiendo secrets desde $secretsFile ..." -ForegroundColor Yellow
npx supabase secrets set --env-file $secretsFile --project-ref $projectRef
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error al subir secrets. Pégalos manualmente en Edge Functions → Secrets." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Listando secrets remotos:" -ForegroundColor Yellow
npx supabase secrets list --project-ref $projectRef

Write-Host ""
Write-Host "=== Listo ===" -ForegroundColor Green
Write-Host "Push: activa notificaciones en Perfil de la app" -ForegroundColor Gray
Write-Host "WhatsApp API: descomenta WHATSAPP_* en .env.secrets y vuelve a ejecutar este script" -ForegroundColor Gray
Write-Host ""
