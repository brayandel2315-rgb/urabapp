# Sincroniza URLs de Supabase Auth con el sitio Vercel de Urabapp
param(
    [Parameter(Mandatory = $true)]
    [string]$VercelUrl
)

$VercelUrl = $VercelUrl.TrimEnd('/')
$projectRef = 'ekqaocauvoajpjyraeyo'

Write-Host ""
Write-Host "=== Urabapp: sincronizar Supabase con Vercel ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "URL Vercel: $VercelUrl"
Write-Host ""

Write-Host "Aplicando Auth (Site URL + Redirects)..." -ForegroundColor Yellow
node "$PSScriptRoot\configure-supabase-auth.mjs" $VercelUrl
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "No se pudo aplicar Auth automaticamente. Configura manualmente:" -ForegroundColor Red
    Write-Host "  https://supabase.com/dashboard/project/$projectRef/auth/url-configuration"
    Write-Host "  Site URL: $VercelUrl"
    Write-Host "  Redirect: $VercelUrl/** , http://localhost:5173/**"
    exit 1
}

Write-Host ""
Write-Host "Variables en Vercel (Project Settings -> Environment Variables):" -ForegroundColor Yellow
Write-Host "  VITE_SUPABASE_URL=https://$projectRef.supabase.co"
Write-Host "  VITE_SUPABASE_ANON_KEY=<tu publishable key>"
Write-Host "  VITE_OWNER_EMAIL=brayandel001@gmail.com"
Write-Host "  VITE_WHATSAPP_NUMBER=57XXXXXXXXXX"
Write-Host "  VITE_APP_URL=$VercelUrl"
Write-Host "  VITE_AUTO_WHATSAPP_NOTIFY=false"
Write-Host ""
Write-Host "Edge Functions (Supabase secrets):" -ForegroundColor Yellow
Write-Host "  APP_URL=$VercelUrl"
Write-Host ""
Write-Host "Dashboard Auth:" -ForegroundColor Green
Write-Host "  https://supabase.com/dashboard/project/$projectRef/auth/url-configuration"
Write-Host ""
