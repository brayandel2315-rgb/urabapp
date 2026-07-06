# Sincronizar Urabapp con Supabase
# Cuenta: brayandel001@gmail.com | Proyecto: Urabapp

$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\.."

Write-Host ""
Write-Host "=== Urabapp · Sincronización Supabase ===" -ForegroundColor Green
Write-Host "Cuenta: brayandel001@gmail.com" -ForegroundColor Cyan
Write-Host "Proyecto: Urabapp" -ForegroundColor Cyan
Write-Host ""

# 1. Login Supabase CLI
Write-Host "[1/5] Iniciar sesión en Supabase CLI..." -ForegroundColor Yellow
Write-Host "      Se abrirá el navegador. Entra con brayandel001@gmail.com" -ForegroundColor Gray
npx supabase login

# 2. Listar proyectos
Write-Host ""
Write-Host "[2/5] Buscando proyecto Urabapp..." -ForegroundColor Yellow
npx supabase projects list

$projectRef = Read-Host "Pega el PROJECT REF de Urabapp (ej: abcdefghijklmnop)"

if ([string]::IsNullOrWhiteSpace($projectRef)) {
    Write-Host "Cancelado: necesitas el project ref." -ForegroundColor Red
    exit 1
}

# 3. Vincular proyecto
Write-Host ""
Write-Host "[3/5] Vinculando proyecto local..." -ForegroundColor Yellow
npx supabase link --project-ref $projectRef

# 4. Obtener credenciales
Write-Host ""
Write-Host "[4/5] Obteniendo API keys..." -ForegroundColor Yellow
$apiKeys = npx supabase projects api-keys --project-ref $projectRef 2>&1
Write-Host $apiKeys

$publishableKey = Read-Host "Pega la Publishable key (sb_publishable_... o anon key)"

$envContent = @"
VITE_SUPABASE_URL=https://$projectRef.supabase.co
VITE_SUPABASE_ANON_KEY=$publishableKey
VITE_OWNER_EMAIL=brayandel001@gmail.com
"@

Set-Content -Path ".env.local" -Value $envContent -Encoding UTF8
Write-Host "      .env.local actualizado" -ForegroundColor Green

# 5. Subir migraciones
Write-Host ""
Write-Host "[5/5] Subiendo base de datos..." -ForegroundColor Yellow
npx supabase db push

Write-Host ""
Write-Host "=== Sincronización completada ===" -ForegroundColor Green
Write-Host ""
Write-Host "Siguiente paso:" -ForegroundColor Yellow
Write-Host "  1. En Supabase Dashboard > Authentication > Providers: activa Google y Email"
Write-Host "  2. En URL Configuration agrega: http://localhost:5173"
Write-Host "  3. Ejecuta en SQL Editor: supabase/seed.sql"
Write-Host "  4. Entra con brayandel001@gmail.com y ejecuta: supabase/migrations/002_admin_brayan.sql"
Write-Host "  5. npm run dev"
Write-Host ""
