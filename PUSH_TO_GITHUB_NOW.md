# 🚀 Push to GitHub - Ready to Execute!

## ✅ Your code is committed and ready!

All your files have been committed. Now follow these steps:

---

## Step 1: Create Repository on GitHub

1. **Open your browser** and go to: https://github.com/new
   - Or go to https://github.com/Raju-09 and click **"New"** button

2. **Fill in the form**:
   - **Repository name**: `lumos` (or any name you prefer)
   - **Description**: `Campus Placement Management System - AI-Powered Portal`
   - **Visibility**: Choose **Public** or **Private**
   - ⚠️ **IMPORTANT**: **DO NOT** check "Add a README file"
   - ⚠️ **IMPORTANT**: **DO NOT** check "Add .gitignore"
   - ⚠️ **IMPORTANT**: **DO NOT** check "Choose a license"

3. Click **"Create repository"**

---

## Step 2: Copy Repository URL

After creating, GitHub will show you a page with commands. **Copy the repository URL** from there.

It will look like: `https://github.com/Raju-09/lumos.git`

---

## Step 3: Run These Commands

**Replace `REPO_NAME` with your actual repository name** (e.g., `lumos`):

```bash
# Add remote repository
git remote add origin https://github.com/Raju-09/REPO_NAME.git

# Push to GitHub
git push -u origin main
```

---

## Step 4: Authentication

When you run `git push`, you'll be prompted for credentials:

- **Username**: `Raju-09`
- **Password**: Use a **Personal Access Token** (NOT your GitHub password)

### How to Create Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Give it a name: `Lumos Project`
4. Select expiration: `90 days` or `No expiration`
5. **Check these scopes**:
   - ✅ `repo` (Full control of private repositories)
6. Click **"Generate token"**
7. **COPY THE TOKEN** (you won't see it again!)
8. Use this token as your password when pushing

---

## Quick Command (After Creating Repo)

Once you have your repository URL, run:

```bash
git remote add origin https://github.com/Raju-09/YOUR_REPO_NAME.git
git push -u origin main
```

---

## ✅ Success!

After pushing, your code will be live at:
**https://github.com/Raju-09/YOUR_REPO_NAME**

---

## Next: Deploy to Vercel

After pushing to GitHub, follow `DEPLOYMENT_GUIDE.md` to host your website!

