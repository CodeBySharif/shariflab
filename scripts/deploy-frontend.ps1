param(
  [string]$ProjectId = "sharif-lab-001",
  [string]$Region = "us-central1",
  [string]$Tag = "v1",
  [string]$ApiUrl = "https://sharif-lab-api-235443778563.us-central1.run.app",
  [string]$CorsOrigins = "https://project-hub.shariflab.my"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$EnvFile = Join-Path $Root "frontend\.env"

if (-not (Test-Path $EnvFile)) {
  throw "Missing frontend/.env"
}

$vars = @{}
Get-Content $EnvFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') {
    $vars[$Matches[1].Trim()] = $Matches[2].Trim()
  }
}

$SupabaseUrl = $vars['VITE_SUPABASE_URL']
$AnonKey = $vars['VITE_SUPABASE_ANON_KEY']
$ViteApiUrl = "$ApiUrl/api"

if (-not $SupabaseUrl -or -not $AnonKey) {
  throw "frontend/.env must define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
}

$env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")

gcloud config set project $ProjectId

Write-Host "==> Building frontend image..."
gcloud builds submit $Root `
  --config "$Root\scripts\cloudbuild-frontend.yaml" `
  --substitutions="_VITE_SUPABASE_URL=$SupabaseUrl,_VITE_SUPABASE_ANON_KEY=$AnonKey,_VITE_API_URL=$ViteApiUrl,_TAG=$Tag"

$Image = "gcr.io/$ProjectId/sharif-lab-web:$Tag"

Write-Host "==> Deploying sharif-lab-web to Cloud Run..."
gcloud run deploy sharif-lab-web `
  --image $Image `
  --region $Region `
  --platform managed `
  --allow-unauthenticated

$WebUrl = gcloud run services describe sharif-lab-web --region $Region --format="value(status.url)"
Write-Host "==> Frontend URL: $WebUrl"

Write-Host "==> Updating API CORS_ORIGINS..."
gcloud run services update sharif-lab-api `
  --region $Region `
  --set-env-vars="SUPABASE_URL=$SupabaseUrl,PUBLIC_API_URL=$ApiUrl,CORS_ORIGINS=$CorsOrigins"

Write-Host @"

Done.
  Frontend (Cloud Run): $WebUrl
  Frontend (custom):    $CorsOrigins
  API:                  $ApiUrl

Supabase Auth -> URL Configuration:
  Site URL: $CorsOrigins
  Redirect URLs: $CorsOrigins/**
"@
