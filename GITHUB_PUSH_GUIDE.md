# 🚀 Push to GitHub - Step by Step Guide

## Quick Steps to Push to GitHub

### Step 1: Create New Repository on GitHub

1. Go to https://github.com/Raju-09
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `lumos` (or your preferred name)
   - **Description**: "Campus Placement Management System - AI-Powered"
   - **Visibility**: Choose **Public** or **Private**
   - **DO NOT** check "Initialize with README" (we already have code)
4. Click **"Create repository"**

### Step 2: Connect and Push from Terminal

After creating the repository, run these commands in your project folder:

```bash
# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Lumos Campus Placement Portal with AI features"

# Add remote (replace REPO_NAME with your repository name)
git remote add origin https://github.com/Raju-09/REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 3: Authentication

If prompted for credentials:
- **Username**: `Raju-09`
- **Password**: Use a **Personal Access Token** (not your GitHub password)
  - Generate token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
  - Select scopes: `repo` (full control)
  - Copy the token and use it as password

---

## Alternative: Using GitHub CLI (if installed)

```bash
gh repo create lumos --public --source=. --remote=origin --push
```

---

## After Pushing

Your code will be live at: `https://github.com/Raju-09/lumos`

Then proceed to deploy on Vercel (see DEPLOYMENT_GUIDE.md)

