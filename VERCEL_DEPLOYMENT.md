# Vercel Deployment Guide for Lumos

## Quick Deploy

### Option 1: Vercel Dashboard (Recommended)

1. **Visit Vercel**: Go to [vercel.com](https://vercel.com)
2. **Sign In**: Log in with your GitHub account
3. **Import Project**: 
   - Click "Add New" → "Project"
   - Select your GitHub repository: `Raju-09/lumos`
4. **Configure Project**:
   - Framework Preset: **Next.js** (should auto-detect)
   - Root Directory: `./` (leave as default)
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. **Environment Variables** (CRITICAL):
   Add these in the Environment Variables section:
   
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```
   
   > **Note**: Get these values from your `.env.local` file

6. **Deploy**: Click "Deploy" and wait for the build to complete

### Option 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

The CLI will:
- Link your project to Vercel
- Detect Next.js configuration
- Prompt you to set environment variables
- Deploy your application

## Environment Variables Setup

### Required Variables

All environment variables in your `.env.local` need to be added to Vercel:

1. Go to your project settings on Vercel
2. Navigate to "Settings" → "Environment Variables"
3. Add each variable with the correct value
4. Make sure to set them for **Production**, **Preview**, and **Development** environments

### Firebase Configuration

Ensure your Firebase project has:
- Web app configured
- Authentication enabled
- Firestore database set up
- Security rules properly configured

### API Keys

- **Gemini API Key**: Required for AI features (Resume Builder, ATS Checker, Chatbot)
- Make sure the API key has proper quotas enabled

## Post-Deployment Steps

1. **Test the Deployment**:
   - Visit your deployed URL (e.g., `lumos.vercel.app`)
   - Test authentication flow
   - Verify AI features are working
   - Check dark mode across all portals

2. **Custom Domain** (Optional):
   - Go to Settings → Domains
   - Add your custom domain
   - Configure DNS records as instructed

3. **Monitor Logs**:
   - Check deployment logs for any errors
   - Monitor function logs for runtime issues

## Troubleshooting

### Build Fails
- Check if all dependencies are in `package.json`
- Verify Node.js version compatibility
- Review build logs for specific errors

### Environment Variables Not Working
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/updating environment variables
- Check variable names match exactly (case-sensitive)

### Firebase Connection Issues
- Verify Firebase configuration in Vercel dashboard
- Check Firebase security rules allow web access
- Ensure Firebase project has billing enabled (if using advanced features)

## Performance Optimization

Vercel automatically handles:
- ✅ Edge caching
- ✅ Image optimization
- ✅ Automatic HTTPS
- ✅ Global CDN distribution
- ✅ Serverless functions

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- GitHub Repository: https://github.com/Raju-09/lumos
