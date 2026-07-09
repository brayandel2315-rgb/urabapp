# Crea el repo en GitHub (si falta) y sube main.
param(
    [string]$Repo = "brayandel2315-rgb/urabapp",
    [ValidateSet("public", "private")]
    [string]$Visibility = "public"
)

$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\.."

$git = "C:\Program Files\Git\cmd\git.exe"
$gh = "C:\Program Files\GitHub CLI\gh.exe"
$repoPath = (Resolve-Path ".").Path -replace '\\', '/'
$remote = "https://github.com/$Repo.git"

if (-not (Test-Path $git)) { throw "Instala Git for Windows." }
if (-not (Test-Path $gh)) { throw "Instala GitHub CLI: winget install GitHub.cli" }

& $gh auth status | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Inicia sesion en GitHub:" -ForegroundColor Yellow
    & $gh auth login --hostname github.com --git-protocol https --web
}

$exists = & $gh repo view $Repo 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Creando repo $Repo ($Visibility)..." -ForegroundColor Cyan
    & $gh repo create $Repo --$Visibility --source . --remote origin --description "UrabApp - marketplace y tracking"
    if ($LASTEXITCODE -ne 0) { exit 1 }
} else {
    $current = & $git -c "safe.directory=$repoPath" remote get-url origin 2>$null
    if ($LASTEXITCODE -ne 0) {
        & $git -c "safe.directory=$repoPath" remote add origin $remote
    } else {
        & $git -c "safe.directory=$repoPath" remote set-url origin $remote
    }
}

Write-Host "Subiendo main..." -ForegroundColor Cyan
& $git -c "safe.directory=$repoPath" push -u origin main
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Host ""
Write-Host "Listo: https://github.com/$Repo" -ForegroundColor Green
