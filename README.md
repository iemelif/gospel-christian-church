# Gospel Christian Church – Giving Site

Next.js (App Router) + TypeScript + React. Goal ₱12,000,000; ₱2,700,000 already collected.

## Run locally
    npm install
    cp .env.example .env.local     # set ADMIN_PASSWORD
    npm run dev                    # http://localhost:3000
    # production: npm run build && npm start

## How it works
- Donors submit a pledge on the home page and get a reference number + payment instructions.
- Pledges are saved to `data/gifts.json` as **pending**.
- Open `/admin`, sign in with ADMIN_PASSWORD, and click **Confirm** once you have received the money. Only confirmed gifts count toward the progress bar and giving wall.

## Edit content
Everything you'll change is in `lib/config.ts`: goal, amount already raised, service schedule, email, and GCash/Maya/bank details (currently placeholders).

## Hosting note
Pledges are stored in a file, so host on a server that keeps its disk (a VPS, or Docker with a volume). Serverless hosts such as Vercel have a read-only, temporary filesystem; swap `lib/store.ts` for a database (Vercel Postgres, Supabase, etc.) there.
