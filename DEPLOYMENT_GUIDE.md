# 🚀 Deployment Guide - GitHub & Hosting

Complete step-by-step guide to push your code to GitHub and host your website.

---

## 📋 Prerequisites

- Git installed on your computer
- GitHub account
- Node.js and npm installed
- Your project code ready

---

## Part 1: Push to GitHub

### Step 1: Initialize Git Repository (if not already done)

Open terminal in your project folder and run:

```bash
# Check if git is already initialized
git status

# If not initialized, run:
git init
```

### Step 2: Create .gitignore File

Create a `.gitignore` file in your project root (if it doesn't exist):

```bash
# Create .gitignore
touch .gitignore
```

Add these contents to `.gitignore`:

```
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo
```

### Step 3: Add All Files to Git

```bash
# Add all files
git add .

# Check what will be committed
git status
```

### Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: Lumos Campus Placement Portal"
```

### Step 5: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Fill in:
   - **Repository name**: `lumos` (or your preferred name)
   - **Description**: "Campus Placement Management System"
   - **Visibility**: Choose Public or Private
   - **DO NOT** check "Initialize with README" (we already have code)
4. Click **"Create repository"**

### Step 6: Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/lumos.git

# Verify remote was added
git remote -v
```

### Step 7: Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

If prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your GitHub password)
  - Generate token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
  - Select scopes: `repo` (full control)
  - Copy the token and use it as password

---

## Part 2: Host on Vercel (Recommended for Next.js)

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (easiest option)
4. Authorize Vercel to access your GitHub

### Step 2: Import Your Repository

1. After signing in, click **"Add New..."** → **"Project"**
2. Find your `lumos` repository in the list
3. Click **"Import"**

### Step 3: Configure Project

1. **Project Name**: Keep default or change to `lumos`
2. **Framework Preset**: Should auto-detect "Next.js"
3. **Root Directory**: Leave as `./` (default)
4. **Build Command**: Leave as `npm run build` (default)
5. **Output Directory**: Leave as `.next` (default)

### Step 4: Add Environment Variables

**CRITICAL**: Add all your environment variables here!

Click **"Environment Variables"** and add:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC5APPZ7EOWMYTZ2UJaJUmek22glqirGT0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lumos-team.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lumos-team
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=lumos-team.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=387295451102
NEXT_PUBLIC_FIREBASE_APP_ID=1:387295451102:web:8277b1f8c1db5cc4662f4f
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyAfd36J-LrQ4WP6AD2rLCQDsLaSQCAlNCc
```

**Important**: 
- Add each variable separately
- Select **"Production"**, **"Preview"**, and **"Development"** for each
- Click **"Save"** after each variable

### Step 5: Deploy

1. Click **"Deploy"** button
2. Wait 2-3 minutes for build to complete
3. Your site will be live at: `https://lumos-xxxxx.vercel.app`

### Step 6: Custom Domain (Optional)

1. In your Vercel project, go to **"Settings"** → **"Domains"**
2. Add your custom domain (e.g., `lumos.app`)
3. Follow DNS configuration instructions

---

## Part 3: Alternative Hosting Options

### Option A: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Select your GitHub repository
5. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Add environment variables in **"Site settings"** → **"Environment variables"**
7. Deploy!

### Option B: Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Add environment variables
6. Railway auto-detects Next.js and deploys

### Option C: Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New"** → **"Web Service"**
4. Connect your GitHub repository
5. Settings:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
6. Add environment variables
7. Deploy!

---

## Part 4: Post-Deployment Checklist

### ✅ Verify Deployment

- [ ] Website loads without errors
- [ ] Login/Signup works
- [ ] Firebase authentication works
- [ ] AI features (Resume Builder, ATS Checker, Chatbot) work
- [ ] Theme toggle works
- [ ] All pages are accessible

### ✅ Security Checklist

- [ ] Environment variables are set (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] API keys are not exposed in GitHub
- [ ] Firebase rules are deployed

### ✅ Performance

- [ ] Run Lighthouse audit
- [ ] Check mobile responsiveness
- [ ] Test loading speeds

---

## Part 5: Continuous Deployment

### Automatic Deployments

Once connected to Vercel/Netlify:
- **Every push to `main` branch** → Auto-deploys to production
- **Pull requests** → Creates preview deployments
- **No manual deployment needed!**

### Update Your Site

```bash
# Make changes to your code
# ... edit files ...

# Commit changes
git add .
git commit -m "Update: Added new feature"

# Push to GitHub
git push origin main

# Vercel/Netlify automatically deploys!
```

---

## 🐛 Troubleshooting

### Build Fails

1. **Check build logs** in Vercel dashboard
2. **Common issues**:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies

### Environment Variables Not Working

1. **Verify** all variables are added in hosting platform
2. **Restart** deployment after adding variables
3. **Check** variable names match exactly (case-sensitive)

### Firebase Errors

1. **Deploy Firestore rules**:
   - Go to Firebase Console
   - Firestore Database → Rules
   - Copy from `firestore.rules`
   - Click "Publish"

2. **Check Firebase config** matches your project

### API Errors

1. **Verify** `NEXT_PUBLIC_GEMINI_API_KEY` is set
2. **Check** API key is valid and has quota
3. **Test** API key in Google AI Studio

---

## 📚 Quick Reference Commands

```bash
# Git Commands
git status                    # Check status
git add .                     # Stage all changes
git commit -m "Message"       # Commit changes
git push origin main          # Push to GitHub
git pull origin main          # Pull latest changes

# Local Development
npm run dev                   # Start dev server
npm run build                 # Build for production
npm start                     # Start production server

# Check Environment
echo $NEXT_PUBLIC_GEMINI_API_KEY  # Check if env var is set
```

---

## 🎉 Success!

Your website is now:
- ✅ On GitHub (version controlled)
- ✅ Hosted live on the internet
- ✅ Auto-deploying on every push
- ✅ Accessible to users worldwide

**Your live URL**: Check your hosting platform dashboard for the URL!

---

## 📞 Need Help?

- **GitHub Issues**: Check repository issues
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)

