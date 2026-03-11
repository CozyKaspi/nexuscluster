# NexusCluster Quick Start Checklist

## 📋 Pre-Setup
- [ ] Have Node.js 18+ installed
- [ ] Have git configured
- [ ] Have a Vercel account
- [ ] Have accounts ready for: Clerk, Supabase

## 🔐 Step 1: Clerk Setup (5 minutes)
1. [ ] Go to https://clerk.com and create account
2. [ ] Create new Next.js application
3. [ ] Select "Email & Google" authentication
4. [ ] Copy Publishable Key
5. [ ] Copy Secret Key
6. [ ] Paste into `.env.local`:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

## 🗄️ Step 2: Supabase Setup (5 minutes)
1. [ ] Go to https://supabase.com and create account
2. [ ] Create new project
3. [ ] Go to Settings → API
4. [ ] Copy Project URL → `NEXT_PUBLIC_SUPABASE_URL`
5. [ ] Copy Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. [ ] Copy Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`
7. [ ] Paste all three into `.env.local`
8. [ ] Database tables created automatically (migration runs on first dev start)

## 📦 Step 3: Vercel Blob Setup (5 minutes)
1. [ ] Go to your Vercel project dashboard
2. [ ] Go to Storage → Create Database → Blob
3. [ ] Copy the BLOB_READ_WRITE_TOKEN
4. [ ] Paste into `.env.local`

## ⚙️ Step 4: Install & Run (5 minutes)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:3000 → redirects to /auth/login
```

## ✅ Step 5: Test the App
1. [ ] Click "Sign Up"
2. [ ] Create account with email
3. [ ] See dashboard with greeting
4. [ ] Click Settings (gear icon)
5. [ ] Upload wallpaper image
6. [ ] Add a service (e.g., "GitHub" → https://github.com)
7. [ ] See service card appear on dashboard
8. [ ] See wallpaper in background
9. [ ] Click delete button to remove service
10. [ ] Log out and log back in

## 🚀 Step 6: Deploy to Vercel (10 minutes)
1. [ ] Push code to GitHub
2. [ ] Go to https://vercel.com/new
3. [ ] Import your repository
4. [ ] Add all 6 environment variables:
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   - CLERK_SECRET_KEY
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - BLOB_READ_WRITE_TOKEN
5. [ ] Click Deploy
6. [ ] Visit your live NexusCluster app!

## 📝 Environment Variables Summary

All 6 required variables:

| Variable | Source | Example |
|----------|--------|---------|
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | Clerk Dashboard | pk_test_abc123... |
| CLERK_SECRET_KEY | Clerk Dashboard | sk_test_xyz789... |
| NEXT_PUBLIC_SUPABASE_URL | Supabase Settings | https://abc.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase Settings | eyJ... |
| SUPABASE_SERVICE_ROLE_KEY | Supabase Settings | eyJ... |
| BLOB_READ_WRITE_TOKEN | Vercel Storage | vercel_blob_rw_... |

## 🐛 Troubleshooting

**Issue**: "Clerk is not configured"
- Solution: Check `.env.local` has both CLERK keys, restart dev server

**Issue**: "Database connection failed"
- Solution: Verify Supabase URL and keys, check internet connection

**Issue**: "Wallpaper upload fails"
- Solution: Check BLOB_READ_WRITE_TOKEN is correct, verify Blob storage exists

**Issue**: "Can't see services after adding"
- Solution: Check browser console for errors, verify Supabase tables exist

## 📚 Documentation Files

- **README.md** - Project overview and features
- **SETUP.md** - Detailed setup instructions
- **IMPLEMENTATION_SUMMARY.md** - Technical architecture details
- **QUICK_START.md** - This file!

## 🎉 You're Done!

Your NexusCluster app is now ready. Start monitoring your services!

### Next Steps:
- Customize the logo and colors
- Add more services to monitor
- Invite team members (requires subscription feature)
- Set up service health checks
- Configure notifications
