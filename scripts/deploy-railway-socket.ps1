# Urabapp — desplegar Socket.IO en Railway y sincronizar VITE_SOCKET_URL
# Requiere: npx @railway/cli login (una vez)

param(
    [switch]$SkipVercelSync
)

$ErrorActionPreference = "Continue"
$PSNativeCommandUseErrorActionPreference = $false
Set-Location "$PSScriptRoot\.."

$scopeArgs = @("--scope", "catalogoivishopin")
$serviceName = "urabapp-socket"
$cors = "https://urabapp.vercel.app,http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174"

function Read-EnvFile($path) {
    $vars = @{}
    if (-not (Test-Path $path)) { return $vars }
    Get-Content $path | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith('#') -and $line -match '^([^=]+)=(.*)$') {
            $vars[$Matches[1].Trim()] = $Matches[2].Trim()
        }
    }
    return $vars
}

function Set-EnvLine($path, $key, $value) {
    $lines = @()
    $found = $false
    if (Test-Path $path) {
        $lines = Get-Content $path
        $lines = $lines | ForEach-Object {
            if ($_ -match "^$key=") {
                $found = $true
                "$key=$value"
            } else { $_ }
        }
    }
    if (-not $found) {
        $lines += "$key=$value"
    }
    $lines | Set-Content $path -Encoding UTF8
}

Write-Host ""
Write-Host "=== Urabapp · Railway Socket.IO ===" -ForegroundColor Green
Write-Host ""

$local = Read-EnvFile ".env.local"
$supabaseUrl = $local['SUPABASE_URL']
if (-not $supabaseUrl) { $supabaseUrl = $local['VITE_SUPABASE_URL'] }
$supabaseKey = $local['SUPABASE_ANON_KEY']
if (-not $supabaseKey) { $supabaseKey = $local['SUPABASE_PUBLISHABLE_KEY'] }
if (-not $supabaseKey) { $supabaseKey = $local['VITE_SUPABASE_ANON_KEY'] }

if (-not $supabaseUrl -or -not $supabaseKey) {
    Write-Host "Faltan SUPABASE_URL y clave anon/publishable en .env.local" -ForegroundColor Red
    exit 1
}

$whoami = (npx @railway/cli whoami 2>&1 | Out-String)
if ($whoami -notmatch "Logged in as") {
    Write-Host "Inicia sesion en Railway:" -ForegroundColor Yellow
    npx @railway/cli login
}

if (-not (Test-Path ".railway") -and -not (Test-Path "railway.json")) {
    $status = (npx @railway/cli status 2>&1 | Out-String)
    if ($status -notmatch "Project:") {
        Write-Host "Vinculando proyecto Railway..." -ForegroundColor Cyan
        npx @railway/cli link -p $serviceName
    }
}

Write-Host "Configurando variables Railway..." -ForegroundColor Cyan
npx @railway/cli variables set "SOCKET_CORS_ORIGINS=$cors"
npx @railway/cli variables set "SUPABASE_URL=$supabaseUrl"
npx @railway/cli variables set "SUPABASE_ANON_KEY=$supabaseKey"
npx @railway/cli variables set "SOCKET_REQUIRE_AUTH=true"

Write-Host "Desplegando..." -ForegroundColor Yellow
npx @railway/cli up --detach

Write-Host ""
Write-Host "Obteniendo URL publica..." -ForegroundColor Cyan
$domainOut = npx @railway/cli domain 2>&1 | Out-String
Write-Host $domainOut -ForegroundColor Gray

$socketUrl = $null
if ($domainOut -match "https://[^\s]+") {
    $socketUrl = $Matches[0].TrimEnd('/')
}

if (-not $socketUrl) {
    Write-Host "No se pudo obtener dominio. Ejecuta: npx @railway/cli domain" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Socket URL: $socketUrl" -ForegroundColor Green

Set-EnvLine ".env.local" "VITE_SOCKET_URL" $socketUrl
Write-Host "Actualizado .env.local -> VITE_SOCKET_URL=$socketUrl" -ForegroundColor Cyan

if (-not $SkipVercelSync) {
    Write-Host ""
    Write-Host "Sincronizando VITE_SOCKET_URL a Vercel..." -ForegroundColor Yellow
    & "$PSScriptRoot\set-vercel-env.ps1"
    if ($LASTEXITCODE -ne 0) { exit 1 }

    Write-Host ""
    Write-Host "Redeploy frontend produccion..." -ForegroundColor Yellow
    npx vercel deploy --prod --yes @scopeArgs
    if ($LASTEXITCODE -ne 0) { exit 1 }
}

Write-Host ""
Write-Host "=== Listo ===" -ForegroundColor Green
Write-Host "Socket: $socketUrl/health"
Write-Host "Frontend: https://urabapp.vercel.app"
Write-Host ""
