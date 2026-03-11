# NexusCluster Setup Guide

This guide will help you set up NexusCluster with Clerk authentication, Supabase database, and Vercel Blob storage.

## Step 1: Clerk Setup (Authentication)

1. Go to [https://clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Select Next.js as your framework
4. Choose "Email & Google" as your authentication methods
5. Copy your **Publishable Key** and **Secret Key**
6. Add them to `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

## Step 2: Supabase Setup (Database)

1. Go to [https://supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to **Settings > API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE_KEY`
4. Add them to `.env.local`
5. Run the database migration (the v0 interface will handle this automatically)

### Database Tables

The migration creates:
- **user_settings**: Stores wallpaper paths and user preferences
- **services**: Stores monitored services for each user

All tables have Row Level Security (RLS) enabled to protect user data.

## Step 3: Vercel Blob Setup (File Storage)

1. Connect your Vercel account if you haven't already
2. Create a Blob storage instance in your Vercel project
3. Copy the **BLOB_READ_WRITE_TOKEN**
4. Add it to `.env.local`:
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
   ```

## Step 4: Environment Variables

Make sure your `.env.local` file contains all required variables:

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_token
```

## Step 5: Install Dependencies

```bash
npm install
# or
pnpm install
```

## Step 6: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) - you should be redirected to the login page.

## Step 7: Test the App

1. Click "Sign Up" to create a new account
2. Sign up with email or Google
3. You'll be redirected to the dashboard
4. Click the Settings button (gear icon) to upload a wallpaper and add services
5. Add a service and watch the status card appear on the dashboard

## Troubleshooting

### "Missing environment variables" error
Make sure all variables in `.env.local` are filled in correctly. Check that you haven't accidentally used template values.

### "Unauthorized" when uploading wallpaper
Ensure Clerk authentication is working. Check the browser console for auth errors.

### Services not appearing
Verify that Supabase tables were created successfully. The migration should run automatically.

### Wallpaper not showing
Check that Vercel Blob token is correct and the file was uploaded (check browser DevTools Network tab).

## Next Steps

Once you have the app running:
- Customize the branding (change "NC" logo, colors, etc.)
- Add more monitoring services
- Implement actual service health checking
- Deploy to Vercel for production

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Import your repository
4. Add all environment variables in Vercel dashboard
5. Deploy!

Your NexusCluster app is now live!
