# Next.js with Supabase Website

This is a Next.js project integrated with Supabase for database operations.

## Project Structure

```
website/
├── public/              # Static files
├── src/
│   ├── app/             # App Router pages
│   │   ├── api/         # API routes
│   │   ├── entries/     # Entries pages
│   │   ├── globals.css  # Global styles
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── components/      # React components
│   │   ├── EntryForm.tsx
│   │   └── EntryList.tsx
│   ├── lib/             # Utility libraries
│   │   └── supabase.ts  # Supabase client
│   └── utils/           # Utility functions
├── .env.local           # Environment variables
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Supabase:
   - Create a Supabase project at https://supabase.com
   - Update the `.env.local` file with your Supabase URL and anon key
   - Create a table named `entries` with columns:
     - `id` (uuid, primary key)
     - `title` (text, not null)
     - `content` (text)
     - `created_at` (timestamp with time zone, default: now())

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Features

- View all entries
- Create new entries
- View entry details
- Edit existing entries
- Delete entries
- Real-time updates using Supabase subscriptions