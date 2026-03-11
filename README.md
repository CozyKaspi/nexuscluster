# NexusCluster

A modern service status monitoring dashboard with personalized wallpapers and real-time service health tracking.

## Features

- **Authentication**: Secure login with email/password or Google OAuth via Clerk
- **Service Monitoring**: Add and monitor status of multiple services
- **Custom Wallpapers**: Upload custom wallpapers for your dashboard
- **Real-time Status**: See at-a-glance status of all your monitored services
- **Responsive Design**: Beautiful frosted glass UI that works on all devices

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React, TypeScript
- **Authentication**: Clerk (email/password + Google OAuth)
- **Database**: Supabase PostgreSQL with Row Level Security
- **File Storage**: Vercel Blob
- **Styling**: Tailwind CSS with backdrop blur effects
- **UI Components**: Custom React components with Lucide icons

## Getting Started

### Prerequisites

- Node.js 18+
- Vercel account (for deployment)
- Supabase account (for database)
- Clerk account (for authentication)
- Vercel Blob storage (for wallpaper uploads)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nexuscluster
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your integrations in the `.env.local` file:
   - Clerk API keys
   - Supabase credentials
   - Vercel Blob token

5. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

The database schema is automatically created when you run the migration:

```bash
npm run db:migrate
```

This creates the following tables:
- `user_settings`: Stores user preferences and wallpaper paths
- `services`: Stores monitored services for each user

All tables use Row Level Security (RLS) to ensure users can only access their own data.

## Project Structure

```
nexuscluster/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Dashboard
│   └── globals.css       # Global styles
├── components/           # React components
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── types.ts          # TypeScript types
│   └── cn.ts             # Utility functions
├── scripts/              # Database migrations
└── public/               # Static assets
```

## Licenses

This project uses the following open-source licenses:

- **MIT License**: NexusCluster (main project)
- **MIT License**: Next.js, React, TypeScript, Tailwind CSS
- **MIT License**: Lucide React icons
- **MIT License**: Vercel SDKs
- **ISC License**: Supabase JS client

See LICENSE file for details.

## API Routes

### `/api/upload` (POST)
Upload a wallpaper image. Returns the pathname for the stored image.

### `/api/wallpaper` (GET)
Serve a private wallpaper image. Requires `pathname` query parameter.

### `/api/services` (GET)
Fetch all services for the authenticated user.

### `/api/services` (POST)
Add a new service. Body: `{ name, url, category? }`

### `/api/services` (DELETE)
Delete a service. Body: `{ id }`

## Security

- All API routes require Clerk authentication
- Database uses Row Level Security (RLS) to isolate user data
- Private wallpapers are stored in Vercel Blob with access control
- Sensitive credentials stored in environment variables only

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions, please open an issue on GitHub.
