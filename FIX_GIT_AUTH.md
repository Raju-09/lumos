# Fix Git Authentication Issue

## Problem
Git is trying to use account `ursraju` but repository is under `Raju-09`.

## Solution: Use Personal Access Token

### Step 1: Create Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Fill in:
   - **Note**: `Lumos Project Push`
   - **Expiration**: Choose `90 days` or `No expiration`
   - **Select scopes**: Check ✅ **`repo`** (Full control of private repositories)
4. Click **"Generate token"**
5. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Update Git Credentials

**Option A: Use Token in URL (Recommended)**

Run this command (replace YOUR_TOKEN with your actual token):

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/Raju-09/lumos.git
git push -u origin main
```

**Option B: Use Credential Manager**

When you run `git push`, it will prompt for credentials:
- **Username**: `Raju-09`
- **Password**: Paste your Personal Access Token (not your GitHub password)

### Step 3: Push Again

```bash
git push -u origin main
```

---

## Alternative: Use SSH (More Secure)

### Step 1: Generate SSH Key (if you don't have one)

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### Step 2: Add SSH Key to GitHub

1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. Go to: https://github.com/settings/keys
3. Click **"New SSH key"**
4. Paste your key and save

### Step 3: Change Remote to SSH

```bash
git remote set-url origin git@github.com:Raju-09/lumos.git
git push -u origin main
```

---

## Quick Fix (Using Token in Command)

If you have your token ready, run:

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/Raju-09/lumos.git
git push -u origin main
```

Replace `YOUR_TOKEN` with your actual Personal Access Token.

