# Sincroniza URLs de Supabase Auth con el sitio Netlify de Urabapp
param(
    [Parameter(Mandatory = $true)]
    [string]$NetlifyUrl
)

$NetlifyUrl = $NetlifyUrl.TrimEnd('/')
$projectRef = 'ekqaocauvoajpjyraeyo'

Write-Host ""
Write-Host "=== Urabapp: sincronizar Supabase con Netlify ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "URL Netlify: $NetlifyUrl"
Write-Host ""
Write-Host "Abre Supabase URL Configuration y configura:" -ForegroundColor Yellow
Write-Host "  https://supabase.com/dashboard/project/$projectRef/auth/url-configuration"
Write-Host ""
Write-Host "Site URL:" -ForegroundColor Green
Write-Host "  $NetlifyUrl"
Write-Host ""
Write-Host "Redirect URLs (agregar, no borrar localhost):" -ForegroundColor Green
Write-Host "  $NetlifyUrl/**"
Write-Host "  http://localhost:5173/**"
Write-Host ""
Write-Host "Variables en Netlify (Site configuration -> Environment variables):" -ForegroundColor Yellow
Write-Host "  VITE_SUPABASE_URL=https://$projectRef.supabase.co"
Write-Host "  VITE_SUPABASE_ANON_KEY=<tu publishable key>"
Write-Host "  VITE_OWNER_EMAIL=brayandel001@gmail.com"
Write-Host "  VITE_WHATSAPP_NUMBER=57XXXXXXXXXX"
Write-Host "  VITE_APP_URL=$NetlifyUrl"
Write-Host "  VITE_AUTO_WHATSAPP_NOTIFY=false"
