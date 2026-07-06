# Urabapp — Mantener Supabase activo (evita pausa por inactividad en plan gratuito)
param(
    [int]$IntervalMinutes = 20,
    [switch]$Once,
    [switch]$InstallTask,
    [switch]$UninstallTask
)

$ErrorActionPreference = "Stop"
$Root = Split-Path $PSScriptRoot -Parent
Set-Location $Root

$TaskName = "Urabapp-Supabase-KeepAlive"
$NodeScript = Join-Path $PSScriptRoot "keep-supabase-alive.mjs"

function Test-Node {
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Node.js no encontrado. Instala Node 20+." -ForegroundColor Red
        exit 1
    }
}

if ($InstallTask) {
    Test-Node
    $action = New-ScheduledTaskAction -Execute "node" -Argument "`"$NodeScript`" --once" -WorkingDirectory $Root
    # Repetición cada N min, 24 h (se renueva cada día al estar la tarea activa)
    $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) `
        -RepetitionInterval (New-TimeSpan -Minutes $IntervalMinutes) `
        -RepetitionDuration (New-TimeSpan -Days 1)
    $settings = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -StartWhenAvailable `
        -ExecutionTimeLimit (New-TimeSpan -Minutes 5) `
        -MultipleInstances IgnoreNew
    $principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited

    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Ping Supabase Urabapp cada $IntervalMinutes min para evitar pausa" | Out-Null

    Write-Host "✅ Tarea programada '$TaskName' instalada (cada $IntervalMinutes min)" -ForegroundColor Green
    Write-Host "   Ver: taskschd.msc -> Biblioteca del Programador de tareas"
    exit 0
}

if ($UninstallTask) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
    Write-Host "✅ Tarea '$TaskName' eliminada" -ForegroundColor Green
    exit 0
}

Test-Node

if ($Once) {
    node $NodeScript --once
    exit $LASTEXITCODE
}

Write-Host "Iniciando keep-alive en primer plano (cada $IntervalMinutes min)..." -ForegroundColor Cyan
node $NodeScript --interval=$IntervalMinutes
