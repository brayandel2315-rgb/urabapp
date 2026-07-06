# Urabapp — desplegar Edge Functions en Supabase
# Requiere: npx supabase login

$ErrorActionPreference = "Stop"
Set-Location "$PSScriptRoot\.."

$projectRef = "ekqaocauvoajpjyraeyo"
$functions = @(
  @{ Name = "openroute-directions"; Jwt = $true },
  @{ Name = "geocode-proxy"; Jwt = $true },
  @{ Name = "send-push"; Jwt = $true },
  @{ Name = "dispatch-tracking-push"; Jwt = $true },
  @{ Name = "send-whatsapp"; Jwt = $true },
  @{ Name = "auto-assign-rider"; Jwt = $true },
  @{ Name = "create-wompi-checkout"; Jwt = $true },
  @{ Name = "create-wompi-membership-checkout"; Jwt = $true },
  @{ Name = "create-wompi-shipment-checkout"; Jwt = $true },
  @{ Name = "wompi-webhook"; Jwt = $false },
  @{ Name = "send-email"; Jwt = $true },
  @{ Name = "dispatch-comm-webhook"; Jwt = $true },
  @{ Name = "send-business-campaign"; Jwt = $true },
  @{ Name = "send-sms"; Jwt = $true },
  @{ Name = "process-comm-retries"; Jwt = $true },
  @{ Name = "send-daily-digest"; Jwt = $true },
  @{ Name = "process-scheduled-comms"; Jwt = $true }
)

Write-Host ""
Write-Host "=== Urabapp · Deploy Edge Functions ===" -ForegroundColor Green
Write-Host "Proyecto: $projectRef" -ForegroundColor Cyan
Write-Host ""

foreach ($fn in $functions) {
  Write-Host "Desplegando $($fn.Name)..." -ForegroundColor Yellow
  if ($fn.Jwt) {
    npx supabase functions deploy $fn.Name --project-ref $projectRef
  } else {
    npx supabase functions deploy $fn.Name --no-verify-jwt --project-ref $projectRef
  }
}

Write-Host ""
Write-Host "=== Listo ===" -ForegroundColor Green
Write-Host "Webhook Wompi: https://$projectRef.supabase.co/functions/v1/wompi-webhook" -ForegroundColor Gray
Write-Host "Verificar: npm run verify:integrations" -ForegroundColor Gray
Write-Host ""
