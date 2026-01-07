# PowerShell Script to Push to GitHub
# Run this after creating your repository on GitHub

Write-Host "`n=== Push Lumos to GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Get repository name from user
$repoName = Read-Host "Enter your repository name (e.g., 'lumos')"

if ([string]::IsNullOrWhiteSpace($repoName)) {
    Write-Host "Repository name cannot be empty!" -ForegroundColor Red
    exit 1
}

Write-Host "`nRepository will be: https://github.com/Raju-09/$repoName" -ForegroundColor Yellow
$confirm = Read-Host "Is this correct? (y/n)"

if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Cancelled." -ForegroundColor Red
    exit 1
}

# Check if remote already exists
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "`nRemote 'origin' already exists: $existingRemote" -ForegroundColor Yellow
    $remove = Read-Host "Remove and add new remote? (y/n)"
    if ($remove -eq "y" -or $remove -eq "Y") {
        git remote remove origin
    } else {
        Write-Host "Using existing remote." -ForegroundColor Green
    }
}

# Add remote
Write-Host "`nAdding remote repository..." -ForegroundColor Cyan
git remote add origin "https://github.com/Raju-09/$repoName.git"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Remote added successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to add remote. It might already exist." -ForegroundColor Red
    Write-Host "Run: git remote remove origin (if needed)" -ForegroundColor Yellow
}

# Push to GitHub
Write-Host "`nPushing to GitHub..." -ForegroundColor Cyan
Write-Host "You will be prompted for credentials:" -ForegroundColor Yellow
Write-Host "  Username: Raju-09" -ForegroundColor Yellow
Write-Host "  Password: Use Personal Access Token (not your GitHub password)" -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "Your code is now at: https://github.com/Raju-09/$repoName" -ForegroundColor Cyan
} else {
    Write-Host "`n✗ Push failed. Check your credentials and try again." -ForegroundColor Red
    Write-Host "`nTo create Personal Access Token:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://github.com/settings/tokens" -ForegroundColor Yellow
    Write-Host "2. Generate new token (classic)" -ForegroundColor Yellow
    Write-Host "3. Select 'repo' scope" -ForegroundColor Yellow
    Write-Host "4. Use the token as your password" -ForegroundColor Yellow
}

