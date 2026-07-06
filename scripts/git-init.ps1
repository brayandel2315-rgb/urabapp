# Bootstrap Git for UrabApp on Windows (safe.directory + optional first push)
param(
    [string]$RemoteUrl = "https://github.com/brayandel2315-rgb/urabapp.git",
    [string]$UserName = "",
    [string]$UserEmail = ""
)

$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\.."

$git = "C:\Program Files\Git\cmd\git.exe"
if (-not (Test-Path $git)) {
    Write-Host "Git no encontrado. Instala Git for Windows: https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

$repo = (Resolve-Path ".").Path -replace '\\', '/'
$gitArgs = @("-c", "safe.directory=$repo")

if (-not (Test-Path ".git")) {
    & $git @gitArgs init -b main
}

if ($UserName -and $UserEmail) {
    & $git @gitArgs config user.name $UserName
    & $git @gitArgs config user.email $UserEmail
    Write-Host "Identidad local configurada: $UserName <$UserEmail>" -ForegroundColor Cyan
} else {
    Write-Host "Tip: pasa -UserName y -UserEmail para configurar autor local en este repo." -ForegroundColor Yellow
}

if ($RemoteUrl) {
    $existing = & $git @gitArgs remote get-url origin 2>$null
    if ($LASTEXITCODE -ne 0) {
        & $git @gitArgs remote add origin $RemoteUrl
    } else {
        & $git @gitArgs remote set-url origin $RemoteUrl
    }
    Write-Host "Remote origin: $RemoteUrl" -ForegroundColor Cyan
}

& $git @gitArgs status
Write-Host ""
Write-Host "Comandos utiles:" -ForegroundColor Green
Write-Host "  git -c safe.directory=`"$repo`" log -1 --oneline"
Write-Host "  git -c safe.directory=`"$repo`" push -u origin main"
