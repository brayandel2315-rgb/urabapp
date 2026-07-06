# Urabapp — Deploy producción (Vercel)

param(
    [string]$VercelUrl = "https://urabapp.vercel.app",
    [switch]$SkipEnvSync
)

& "$PSScriptRoot\deploy-vercel.ps1" -VercelUrl $VercelUrl @PSBoundParameters
