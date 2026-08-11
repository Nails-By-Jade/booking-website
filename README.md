This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Storage setup (required before deploying)

This app stores data in **Neon Postgres** and uploaded images in **Vercel Blob** — both have generous free tiers. Local file storage was removed because Vercel's serverless filesystem is read-only in production.

### 1. Add the databases in Vercel

In your Vercel project dashboard:
- **Storage → Create Database → Neon (Postgres)**. This automatically sets the `DATABASE_URL` env var for you.
- **Storage → Create Database → Blob**. This automatically sets the `BLOB_READ_WRITE_TOKEN` env var for you.

### 2. Create the tables

Run `lib/schema.sql` once against your new Neon database. Easiest way: open the database in the Vercel Storage tab, go to its "Query" / SQL editor, paste the contents of `lib/schema.sql`, and run it. (Or `psql "$DATABASE_URL" -f lib/schema.sql` if you have `psql` installed locally.)

### 3. Redeploy

Once the env vars exist and the tables are created, redeploy (or just push — Vercel will use the new env vars automatically).

### Local development

Copy the `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` values from your Vercel project (Settings → Environment Variables) into `.env.local` so `npm run dev` can reach the same database.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
