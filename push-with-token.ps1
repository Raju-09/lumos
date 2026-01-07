# PowerShell Script to Push with Personal Access Token
# This script will help you push to GitHub using a token

Write-Host "`n=== Push Lumos to GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Get Personal Access Token from user
Write-Host "You need a Personal Access Token to push." -ForegroundColor Yellow
Write-Host "If you don't have one, create it at: https://github.com/settings/tokens" -ForegroundColor Yellow
Write-Host ""

$token = Read-Host "Enter your Personal Access Token" -AsSecureString
$tokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($token))

if ([string]::IsNullOrWhiteSpace($tokenPlain)) {
    Write-Host "Token cannot be empty!" -ForegroundColor Red
    exit 1
}

# Update remote URL with token
Write-Host "`nUpdating remote URL with token..." -ForegroundColor Cyan
$remoteUrl = "https://$tokenPlain@github.com/Raju-09/lumos.git"
git remote set-url origin $remoteUrl

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Your code is now at: https://github.com/Raju-09/lumos" -ForegroundColor Cyan
    
    # Remove token from remote URL for security
    Write-Host "`nRemoving token from remote URL for security..." -ForegroundColor Yellow
    git remote set-url origin https://github.com/Raju-09/lumos.git
    Write-Host "✓ Token removed from URL" -ForegroundColor Green
} else {
    Write-Host "`n✗ Push failed. Please check:" -ForegroundColor Red
    Write-Host "  1. Token is valid and has 'repo' scope" -ForegroundColor Yellow
    Write-Host "  2. Repository exists at https://github.com/Raju-09/lumos" -ForegroundColor Yellow
    Write-Host "  3. You have write access to the repository" -ForegroundColor Yellow
}

