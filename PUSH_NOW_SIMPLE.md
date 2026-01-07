# 🚀 Push to GitHub - Simple Steps

## ✅ Your code is ready! Just need authentication.

---

## Step 1: Get Personal Access Token (2 minutes)

1. **Open**: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Fill in:
   - **Note**: `Lumos Push`
   - **Expiration**: `90 days` or `No expiration`
   - **Scopes**: ✅ Check **`repo`** (Full control)
4. Click **"Generate token"**
5. **COPY THE TOKEN** (starts with `ghp_...`)

---

## Step 2: Push with Token

**Choose ONE method:**

### Method A: Use Token in Command (Fastest)

Run this command (replace `YOUR_TOKEN` with your actual token):

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/Raju-09/lumos.git
git push -u origin main
```

### Method B: Use PowerShell Script

```powershell
.\push-with-token.ps1
```

Enter your token when prompted.

### Method C: Clear Credentials & Push

```bash
# Clear old credentials
cmdkey /delete:LegacyGeneric:target=git:https://github.com

# Push (will prompt for username/password)
git push -u origin main
```

When prompted:
- **Username**: `Raju-09`
- **Password**: Paste your Personal Access Token

---

## ✅ Success!

After push, your code will be at: **https://github.com/Raju-09/lumos**

---

## 🎯 Quick Copy-Paste Commands

**If you have your token ready:**

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/Raju-09/lumos.git
git push -u origin main
```

**Replace `YOUR_TOKEN` with your actual token!**

