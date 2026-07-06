# Sube variables VITE_* de .env.local a Vercel (production, preview, development)
param(
    [string]$OverrideAppUrl = ""
)

$prevErrorPref = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
Set-Location "$PSScriptRoot\.."

$scopeArgs = @("--scope", "catalogoivishopin")

$envFile = Join-Path $PWD ".env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "No existe .env.local" -ForegroundColor Red
    exit 1
}

$vars = @{}
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith('#') -and $line -match '^VITE_') {
        $parts = $line -split '=', 2
        if ($parts.Length -eq 2) {
            $vars[$parts[0].Trim()] = $parts[1].Trim()
        }
    }
}

if ($OverrideAppUrl) {
    $vars['VITE_APP_URL'] = $OverrideAppUrl.TrimEnd('/')
} elseif ($vars['VITE_APP_URL'] -match 'localhost|127\.0\.0\.1') {
    $vars.Remove('VITE_APP_URL')
    Write-Host "  Omitiendo VITE_APP_URL local (se seteara tras el primer deploy)" -ForegroundColor DarkYellow
}

if ($vars.Count -eq 0) {
    Write-Host "No hay variables VITE_* para subir" -ForegroundColor Red
    exit 1
}

$failed = $false
foreach ($key in $vars.Keys) {
    $value = $vars[$key]
    foreach ($env in @('production', 'preview', 'development')) {
        $null = $value | npx vercel env add $key $env --force @scopeArgs 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  Error al setear $key ($env)" -ForegroundColor Red
            $failed = $true
        }
    }
    if (-not $failed) {
        Write-Host "  OK $key" -ForegroundColor DarkGray
    }
}

$ErrorActionPreference = $prevErrorPref
if ($failed) { exit 1 }

Write-Host "Variables VITE_* sincronizadas con Vercel." -ForegroundColor Green
