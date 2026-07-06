# Libera puertos de desarrollo de Vite en Windows (5173-5177 por defecto).
param(
    [int[]]$Ports = @(5173, 5174, 5175, 5176, 5177)
)

$ErrorActionPreference = 'SilentlyContinue'
Set-Location "$PSScriptRoot\.."

$viteProcessNames = @('node', 'esbuild')

Write-Host ""
Write-Host "=== URABAPP - Liberar puertos de desarrollo ===" -ForegroundColor Green
Write-Host ""

$killed = @()
$skipped = @()

foreach ($Port in $Ports) {
    $raw = @(Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue)
    $pids = @($raw | ForEach-Object { $_.OwningProcess } | Where-Object { $_ -gt 0 } | Sort-Object -Unique)

    if ($pids.Count -eq 0) { continue }

    foreach ($pid in $pids) {
        if ($killed -contains $pid -or $skipped -contains $pid) { continue }

        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if (-not $proc) { continue }

        if ($viteProcessNames -notcontains $proc.ProcessName) {
            Write-Host "Omitiendo $($proc.ProcessName) (PID $pid) en puerto $Port" -ForegroundColor DarkYellow
            $skipped += $pid
            continue
        }

        Write-Host "Deteniendo $($proc.ProcessName) (PID $pid) en puerto $Port..." -ForegroundColor Yellow
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        $killed += $pid
    }
}

Start-Sleep -Milliseconds 500

$stillBlocking = @()
foreach ($Port in $Ports) {
    $raw = @(Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue)
    $pids = @($raw | ForEach-Object { $_.OwningProcess } | Where-Object { $_ -gt 0 } | Sort-Object -Unique)
    foreach ($pid in $pids) {
        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
        if ($proc -and ($viteProcessNames -contains $proc.ProcessName)) {
            $stillBlocking += [PSCustomObject]@{ Port = $Port; Process = $proc }
        }
    }
}

if ($stillBlocking.Count -gt 0) {
    Write-Host ""
    Write-Host "Algunos puertos siguen ocupados por Vite/Node:" -ForegroundColor Red
    foreach ($item in $stillBlocking) {
        Write-Host "  - puerto $($item.Port): $($item.Process.ProcessName) (PID $($item.Process.Id))" -ForegroundColor Red
    }
    Write-Host "Cierra las terminales donde corre npm run dev." -ForegroundColor Red
    exit 1
}

Write-Host ""
if ($killed.Count -gt 0) {
    Write-Host ('Puertos liberados ({0} proceso(s) detenido(s)).' -f $killed.Count) -ForegroundColor Green
} else {
    Write-Host "Puertos de desarrollo ya estaban libres." -ForegroundColor Cyan
}
Write-Host 'Ejecuta: npm run dev' -ForegroundColor Green
Write-Host ""
