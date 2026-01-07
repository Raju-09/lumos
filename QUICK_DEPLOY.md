# ⚡ Quick Deploy Guide

## 🎯 Fastest Way to Deploy

### Step 1: Push to GitHub (5 minutes)

```bash
# If first time, initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Lumos Campus Placement Portal"

# Create repository on GitHub.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/lumos.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Vercel (3 minutes)

1. Go to **[vercel.com](https://vercel.com)** → Sign up with GitHub
2. Click **"Add New Project"**
3. Import your `lumos` repository
4. **Add Environment Variables** (IMPORTANT!):
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC5APPZ7EOWMYTZ2UJaJUmek22glqirGT0
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lumos-team.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=lumos-team
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=lumos-team.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=387295451102
   NEXT_PUBLIC_FIREBASE_APP_ID=1:387295451102:web:8277b1f8c1db5cc4662f4f
   NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyAfd36J-LrQ4WP6AD2rLCQDsLaSQCAlNCc
   ```
5. Click **"Deploy"**
6. Wait 2-3 minutes → **Done!** 🎉

Your site will be live at: `https://lumos-xxxxx.vercel.app`

---

## 📋 Environment Variables Checklist

Make sure these are added in Vercel:

- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_GEMINI_API_KEY`

---

## 🔄 Update Your Site

After making changes:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

Vercel automatically deploys! No manual steps needed.

---

## 🆘 Troubleshooting

**Build fails?**
- Check environment variables are all set
- Check build logs in Vercel dashboard

**API not working?**
- Verify `NEXT_PUBLIC_GEMINI_API_KEY` is set correctly
- Check API key has quota remaining

**Firebase errors?**
- Deploy Firestore rules in Firebase Console
- Check Firebase config matches

---

For detailed instructions, see `DEPLOYMENT_GUIDE.md`

