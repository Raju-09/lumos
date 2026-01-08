# 🚀 Quick Vercel Deployment for Hackathon

## Method 1: Vercel CLI (FASTEST - Recommended for Hackathon)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
This will open your browser to authenticate with GitHub/GitLab/Email.

### Step 3: Deploy to Production
```bash
vercel --prod
```

The CLI will ask you a few questions:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (first time) or Yes (if updating)
- **What's your project's name?** → `lumos` (or your preferred name)
- **In which directory is your code located?** → `./` (press Enter)

### Step 4: Set Environment Variables
After deployment, you need to add your environment variables:

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production
vercel env add NEXT_PUBLIC_GEMINI_API_KEY production
```

Then redeploy:
```bash
vercel --prod
```

## Method 2: Vercel Dashboard (Alternative)

1. Go to https://vercel.com/new
2. Click "Continue with GitHub"
3. Import your repository: `Raju-09/lumos`
4. Configure environment variables in the dashboard
5. Click "Deploy"

## Your Deployment Link

After deployment, you'll get a URL like:
- Production: `https://lumos.vercel.app`
- Or: `https://lumos-username.vercel.app`

**Share this link with your hackathon team!**

## Required Environment Variables

Make sure to add these from your `.env.local` file:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_GEMINI_API_KEY`

## Troubleshooting

### Build fails?
Check the build logs on Vercel dashboard and verify all dependencies are installed.

### Environment variables not working?
Make sure to redeploy after adding environment variables.

### Need help?
Run: `vercel --help`
