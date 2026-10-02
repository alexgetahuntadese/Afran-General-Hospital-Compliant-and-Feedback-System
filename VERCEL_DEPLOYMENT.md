# Vercel Deployment Guide for Login Fix

## Problem
Login functionality may fail after Vercel deployment due to missing environment variables or Supabase configuration issues.

## Solution Steps

### 1. Add Environment Variables in Vercel

Go to your Vercel project dashboard and add these environment variables:

**Project Settings > Environment Variables:**
- `VITE_SUPABASE_URL` = Your Supabase project URL (e.g., `https://your-project.supabase.co`)
- `VITE_SUPABASE_ANON_KEY` = Your Supabase anon/public key

### 2. Configure Supabase Redirect URLs

In your Supabase Dashboard:

1. Go to **Authentication** > **URL Configuration**
2. Add your Vercel domain to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: Add both:
     - `https://your-app.vercel.app/**`
     - `http://localhost:3000/**` (for local development)

### 3. Redeploy Your Application

After adding environment variables:
- Go to Vercel dashboard
- Click **Redeploy** or push a new commit to trigger deployment

### 4. Verify the Fix

After redeployment:
1. Open your Vercel-deployed app
2. Navigate to the Staff login page
3. Try signing in with your credentials

## Changes Made

### 1. Enhanced Supabase Client Configuration
Updated `src/lib/supabase.ts` to include auth configuration:
- `autoRefreshToken: true` - Automatically refreshes expired tokens
- `persistSession: true` - Stores session in localStorage
- `detectSessionInUrl: true` - Detects session from URL (important for OAuth)
- `storage: window.localStorage` - Explicitly uses localStorage

### 2. Added Vercel Configuration
Created `vercel.json` with:
- Build command and output directory
- Environment variable descriptions for Vercel UI

### 3. Updated .env.example
Added deployment instructions for reference

## Common Issues & Solutions

### Issue: "Supabase is not configured" error
**Cause**: Environment variables not set in Vercel
**Solution**: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel project settings

### Issue: Login fails with "Invalid login credentials"
**Cause**: Supabase redirect URLs not configured
**Solution**: Add your Vercel domain to Supabase Authentication > URL Configuration

### Issue: Session not persisting after page refresh
**Cause**: Auth configuration issues
**Solution**: The updated `supabase.ts` now includes explicit storage configuration

### Issue: CORS errors in browser console
**Cause**: Supabase doesn't recognize your Vercel domain
**Solution**: Add Vercel domain to Supabase Authentication > URL Configuration > Redirect URLs

## Testing Locally

To test before deploying:
1. Create a `.env.local` file with your Supabase credentials
2. Run `npm run dev`
3. Test login functionality
4. Ensure environment variables are committed to Vercel, not to Git

## Need Help?

- Check browser console for error messages
- Verify environment variables in Vercel deployment logs
- Confirm Supabase project URL and anon key are correct
