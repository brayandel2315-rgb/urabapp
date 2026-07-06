# Urabapp - Deploy produccion en Vercel

param(
    [string]$VercelUrl = "",
    [switch]$SkipEnvSync
)

$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\.."

$scopeArgs = @("--scope", "catalogoivishopin")

Write-Host ""
Write-Host "=== URABAPP - DEPLOY VERCEL ===" -ForegroundColor Green
Write-Host ""

Write-Host "[1/5] Verificando Supabase..." -ForegroundColor Yellow
npm run verify:supabase
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Corrige .env.local antes de continuar." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "[2/5] Sincronizando variables VITE_* a Vercel..." -ForegroundColor Yellow
& "$PSScriptRoot\set-vercel-env.ps1"
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host ""
Write-Host "[3/5] Build produccion..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host ""
Write-Host "[4/5] Deploy Vercel (produccion)..." -ForegroundColor Yellow
$deployLog = @()
npx vercel deploy --prod --yes --archive=tgz @scopeArgs 2>&1 | ForEach-Object {
    $deployLog += $_
    Write-Host $_
}
if ($LASTEXITCODE -ne 0) { exit 1 }

$deployUrl = ($deployLog | Select-String -Pattern 'https://[a-z0-9-]+\.vercel\.app' -AllMatches | ForEach-Object { $_.Matches } | Select-Object -Last 1).Value
if (-not $deployUrl) {
    $deployUrl = ($deployLog | Select-String -Pattern 'https://[^\s]+' -AllMatches | ForEach-Object { $_.Matches } | Where-Object { $_.Value -match 'vercel\.app' } | Select-Object -Last 1).Value
}

if ($deployUrl) {
    Write-Host ""
    Write-Host "URL produccion: $deployUrl" -ForegroundColor Cyan
    Write-Host "[5/5] Actualizando VITE_APP_URL y redeploy..." -ForegroundColor Yellow
    & "$PSScriptRoot\set-vercel-env.ps1" -OverrideAppUrl $deployUrl
    if ($LASTEXITCODE -ne 0) { exit 1 }
    npx vercel deploy --prod --yes --archive=tgz @scopeArgs
    if ($LASTEXITCODE -ne 0) { exit 1 }
    if (-not $SkipEnvSync) {
        npm run sync:vercel -- -VercelUrl $deployUrl
    }
} elseif ($VercelUrl -and -not $SkipEnvSync) {
    npm run sync:vercel -- -VercelUrl $VercelUrl
}

Write-Host ""
Write-Host "=== POST-DEPLOY ===" -ForegroundColor Green
Write-Host "1. Supabase Auth: aplicado con npm run sync:supabase-auth"
Write-Host "2. VITE_APP_URL en Vercel debe coincidir con la URL de produccion"
Write-Host "3. Edge Functions: APP_URL en secrets de Supabase"
Write-Host "4. Prueba E2E: login -> pedido -> admin -> mensajero -> entregado"
Write-Host "5. Panel /admin -> checklist de lanzamiento"
Write-Host ""
