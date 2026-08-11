# Nails By Jade — Booking Website

A booking and portfolio website for Nails By Jade, built with Next.js. Clients can browse services, view the nail gallery, submit booking requests, and get in touch — while the admin can manage bookings, block out unavailable dates, and upload new gallery photos.

## Features

- **Booking form** — clients submit appointment requests with an optional inspo photo upload
- **Gallery** — showcase of nail work, manageable from the admin panel
- **Contact form** — general inquiries sent straight through
- **Blocked dates** — admin can mark dates as unavailable for booking
- **Admin login** — protected dashboard for managing bookings, gallery, and blocked dates
- **Responsive design** — mobile-friendly navigation and layout throughout

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** [Neon](https://neon.tech) (serverless Postgres)
- **File storage:** [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (gallery photos, booking inspo images)
- **Hosting:** [Vercel](https://vercel.com)

## Getting Started

### Prerequisites

- Node.js installed
- A [Vercel](https://vercel.com) account (for deployment, Blob storage, and env var management)
- A [Neon](https://neon.tech) Postgres database

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root with the following:

```bash
# Database
DATABASE_URL=your_neon_connection_string

# Admin auth
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD_HASH=your_hashed_password
SESSION_SECRET=a_long_random_string

# Vercel Blob (image uploads)
BLOB_READ_WRITE_TOKEN=your_blob_token
```

If your project is linked to Vercel, you can pull these automatically instead of setting them by hand:

```bash
vercel link
vercel env pull .env.local
```

> **Note:** Make sure `BLOB_READ_WRITE_TOKEN` is scoped to the **Development** environment in your Vercel project settings, or it won't come through in `vercel env pull`.

### 3. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
booking-website/
├── app/                  # App Router pages and API routes
│   ├── api/
│   │   ├── admin/        # Admin-only routes (blocked dates, etc.)
│   │   └── ...
│   ├── booking/          # Booking page
│   ├── gallery/          # Gallery page
│   ├── contact/          # Contact page
│   └── ...
├── lib/                  # Shared logic
│   ├── db.ts             # Database connection/queries
│   ├── format.ts         # Formatting helpers
│   ├── bookings-store.ts # Booking data logic
│   ├── gallery-store.ts  # Gallery data logic
│   ├── messages-store.ts # Contact message logic
│   └── schedule.ts       # Scheduling/availability logic
├── public/                # Static assets (logo, images)
└── schema.sql             # Database schema
```

## Deployment

This project is set up to deploy on **Vercel**, connected to this Git repository.

1. Push changes to the `main` branch:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
2. Vercel automatically builds and deploys on push.
3. Make sure all environment variables (`DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `BLOB_READ_WRITE_TOKEN`) are set under **Project Settings → Environment Variables** for the **Production** environment — local `.env.local` values are not used in production.

## Security Notes

- Never commit `.env.local` — it's already included in `.gitignore`.
- If any secrets (database URL, session secret, tokens) are ever shared or exposed accidentally, rotate them:
  - Reset the database password from the Neon dashboard and update `DATABASE_URL`.
  - Generate a new random `SESSION_SECRET`.
  - Regenerate the Blob read-write token from Vercel's Storage settings if needed.
- After rotating any secret, redeploy so the live site picks up the new value.

## License

Private project — not licensed for public use or redistribution.