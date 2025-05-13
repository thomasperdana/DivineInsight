# Deploying Divine Insight to Vercel

This guide provides step-by-step instructions for deploying the Divine Insight application to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- Git repository with your Divine Insight code
- Google AI API key for Genkit
- Firebase project (if using Firebase features)

## Deployment Steps

### 1. Push Your Code to a Git Repository

If your code is not already in a Git repository (GitHub, GitLab, or Bitbucket), you'll need to create one and push your code there.

### 2. Import Your Project in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Select your Git repository
4. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
   - Install Command: `npm install`

### 3. Configure Environment Variables

Add the following environment variables in the Vercel project settings:

```
GOOGLE_API_KEY=your_google_api_key_here
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here
```

> Note: The `NEXT_PUBLIC_` prefix is required for environment variables that need to be accessible in the browser.

To add environment variables:
1. Go to your project in the Vercel dashboard
2. Click on "Settings" tab
3. Select "Environment Variables" from the left sidebar
4. Add each variable with its corresponding value

### 4. Deploy

1. Click "Deploy" to start the deployment process
2. Vercel will build and deploy your application
3. Once completed, you'll receive a URL for your deployed application

### 5. Custom Domain (Optional)

To add a custom domain to your Vercel deployment:
1. Go to your project in the Vercel dashboard
2. Click on "Settings" tab
3. Select "Domains" from the left sidebar
4. Add your domain and follow the instructions to configure DNS settings

## Troubleshooting

### Build Errors

If you encounter build errors:
1. Check the build logs in the Vercel dashboard
2. Ensure all dependencies are correctly installed
3. Verify that environment variables are properly set
4. Make sure your Next.js configuration is compatible with Vercel

### API Issues

If API calls are failing:
1. Verify that environment variables are correctly set in Vercel
2. Check API key permissions and quotas
3. Ensure CORS settings allow requests from your Vercel domain

## Continuous Deployment

Vercel automatically deploys when you push changes to your Git repository. To disable this:
1. Go to your project in the Vercel dashboard
2. Click on "Settings" tab
3. Select "Git" from the left sidebar
4. Disable "Auto Deploy"

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
