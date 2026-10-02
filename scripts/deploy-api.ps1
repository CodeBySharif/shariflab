# Sharif Lab — deploy backend to GCP Cloud Run
# Prerequisites: gcloud CLI installed, logged in, secrets created in Secret Manager
#
# Usage:
#   .\scripts\deploy-api.ps1 -ProjectId "your-gcp-project-id" -SupabaseUrl "https://xxx.supabase.co"
#
# Optional:
#   -Tag "v1"
#   -Region "us-central1"
#   -CorsOrigins "https://temp"   # update after frontend deploy
#   -PublicApiUrl "https://..."  # skip auto-detect after first deploy

param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectId,

  [Parameter(Mandatory = $true)]
  [string]$SupabaseUrl,

  [string]$Tag = "v1",
  [string]$Region = "us-central1",
  [string]$CorsOrigins = "https://temp",
  [string]$PublicApiUrl = ""
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

$Image = "gcr.io/$ProjectId/sharif-lab-api:$Tag"

Write-Host "==> Project: $ProjectId"
Write-Host "==> Image:   $Image"
Write-Host "==> Region:  $Region"

gcloud config set project $ProjectId

Write-Host "`n==> Building image (Cloud Build)..."
gcloud builds submit "$Root\backend" --tag $Image

Write-Host "`n==> Deploying to Cloud Run..."
$deployArgs = @(
  "run", "deploy", "sharif-lab-api",
  "--image=$Image",
  "--region=$Region",
  "--platform=managed",
  "--allow-unauthenticated",
  "--min-instances=1",
  "--set-secrets=DATABASE_URL=sharif-lab-db-url:latest,SUPABASE_SERVICE_ROLE_KEY=sharif-lab-service-role:latest",
  "--set-env-vars=SUPABASE_URL=$SupabaseUrl,PUBLIC_API_URL=https://temp,CORS_ORIGINS=$CorsOrigins"
)
gcloud @deployArgs

$ApiUrl = gcloud run services describe sharif-lab-api --region $Region --format="value(status.url)"
Write-Host "`n==> Service URL: $ApiUrl"

if ($PublicApiUrl) {
  $ApiUrl = $PublicApiUrl
}

Write-Host "==> Setting PUBLIC_API_URL..."
gcloud run services update sharif-lab-api `
  --region $Region `
  --set-env-vars="SUPABASE_URL=$SupabaseUrl,PUBLIC_API_URL=$ApiUrl,CORS_ORIGINS=$CorsOrigins"

Write-Host "`n==> Health check..."
try {
  $health = Invoke-RestMethod "$ApiUrl/health"
  Write-Host "OK: $($health | ConvertTo-Json -Compress)"
} catch {
  Write-Warning "Health check failed: $_"
  Write-Host "Check logs: gcloud run services logs read sharif-lab-api --region $Region --limit 30"
}

Write-Host @"

Done.
  API URL:        $ApiUrl
  Health:         $ApiUrl/health
  Tracking script: $ApiUrl/track.js

Next: deploy frontend with VITE_API_URL=$ApiUrl/api
Then update CORS_ORIGINS to your frontend Cloud Run URL.
"@
