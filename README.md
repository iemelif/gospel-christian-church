# Gospel Christian Church – Giving Site

Next.js (App Router) + TypeScript + React. Goal ₱12,000,000; ₱2,700,000 already collected.

## Run locally
    npm install
    cp .env.example .env.local     # set ADMIN_PASSWORD
    npm run dev                    # http://localhost:3000
    # production: npm run build && npm start
    # checks (same as CI): npm run lint && npm test && npm run build

## How it works
- Donors submit a pledge on the **Donate** page for **Project Nehemiah** (`/donate`; `/` shows the same page until the new Home page is built) and get a reference number + payment instructions. Email is optional. The old `/support` address returns 404.
- Recording a pledge is protected by **Google reCAPTCHA v3** (invisible). It needs `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` (see `.env.example`); without them pledges are rejected.
- Pledges are saved to `data/gifts.json` as **pending**.
- Open `/admin`, sign in with ADMIN_PASSWORD, and click **Confirm** once you have received the money. Only confirmed gifts count toward the progress bar and giving wall.
- The admin login lasts **one day** (secure cookie) and there is a **Log out** button. **Delete** is only offered for pending pledges; confirmed ones are locked (use **Undo** first if a confirmation was a mistake).
- Payment methods (GCash, Maya, Bank Transfer, Cash at Church) are always listed — prominently in a "Ways to send your gift" section and in the form. The first three show the value from `NEXT_PUBLIC_GCASH_NUMBER` / `NEXT_PUBLIC_MAYA_NUMBER` / `NEXT_PUBLIC_BANK_DETAILS`; if a value is empty or still has `XXX` placeholders, donors are told to email the church. These are build-time values, so after changing a GitHub variable, re-run the deploy.

## Edit content
Giving settings are in `lib/config.ts`: goal, amount already raised, service schedule, preset amounts and payment method notes. The email, goal, amount already raised and GCash/Maya/bank details can be overridden with the `NEXT_PUBLIC_*` variables in `.env.local` / GitHub variables (see `.env.example`). Links, menu, address and officers are in `content/` (below).

## Site header, footer, leaders & officers
- `content/site.ts` – links, logos, church address, social media and the header menu.
  - **Development vs production links:** the `ENVIRONMENTS` block at the top holds both sets. `npm run dev` uses `localhost:3000` for Home, GCC (and the unused Support link); deployed builds use `gcciemelif.website` (staging, `NEXT_PUBLIC_SITE_ENV=staging`) or `gcciemelif.com` (production, the default for `npm run build` / `npm start`). On staging `robots.txt` blocks all crawlers. The IEMELIF and Facebook links are the same in both.
  - `SITE_URL` (canonical links, sitemap, Open Graph) follows the same switch.
- `content/officers.ts` – current term (`CURRENT_TERM`), past terms (`HISTORY_TERMS`) and the groups on the Church Leadership page. New term: copy the current block into `HISTORY_TERMS`, then replace `CURRENT_TERM`.
- **Pictures:** every line has `image: "<slug of the name>"` (e.g. `ocampo-juanito-jr-s`), which loads `/images/people/<slug>.svg`.
  - New person → add the line with their slug, then run `npm run avatars` to create the placeholder SVG (existing files are never overwritten; it also warns about lines missing `image`).
  - Real photo → put the file in `public/images/people/` and set the full path: `image: "/images/people/ocampo-juanito-jr-s.jpg"`.
- **Theme and styling:** the site uses Tailwind CSS v4. Colors are theme tokens in the `@theme` block at the top of `app/globals.css` (used as classes like `bg-brand`, `text-gold`), taken from the two logos (GCC crimson, IEMELIF gold and blue, dark brown of the cross). Repeated styles (buttons, cards, headings) are shared class strings in `lib/ui.ts`. The header is sticky.
- **Logos:** `public/images/*.png` now have transparent backgrounds; the untouched originals are in `design/original-logos/`.
- Pages: `/donate` (Project Nehemiah), `/leadership`, `/officers`, `/history/<term>`. `/about`, `/ministries`, `/contact` are empty placeholders (noindex until they have content).
- SEO: per-page titles/descriptions/canonical URLs, Open Graph, church structured data (JSON-LD), `/sitemap.xml`, `/robots.txt`, GCC logo as favicon (`icon` + `shortcut icon`). `/admin` is noindex.

## Hosting note
Pledges are stored in a file, so host on a server that keeps its disk (a VPS, or Docker with a volume). Serverless hosts such as Vercel have a read-only, temporary filesystem; swap `lib/store.ts` for a database (Vercel Postgres, Supabase, etc.) there.

## Deploy to Google Cloud Run (GitHub Actions)

Two workflows build the Docker image, push it to Artifact Registry and deploy to Cloud Run:

| Workflow | Branch | Site | Cloud Run service | Data bucket | GitHub Environment |
| --- | --- | --- | --- | --- | --- |
| `deploy-prod.yml` | `main` | gcciemelif.com | `gospel-christian-church-prod` | `PROJECT_ID-gospel-christian-church-prod-data` | `production` |
| `deploy-staging.yml` | `develop` | gcciemelif.website | `gospel-christian-church` | `PROJECT_ID-gospel-christian-church-data` | `staging` |

Variables and secrets set on a GitHub Environment override the repository-level ones, so staging and production can use different passwords or reCAPTCHA keys. `ci.yml` lints, tests and builds every pull request.

### One-time Google Cloud setup
Replace `PROJECT_ID` and `GITHUB_USER/REPO`. Keep the region (`us-central1`), repository name and bucket names (`PROJECT_ID-gospel-christian-church-data` for staging, `PROJECT_ID-gospel-christian-church-prod-data` for production) as shown: the deploy workflows expect exactly these. Grant the runtime service account access to **both** buckets.

    gcloud config set project PROJECT_ID
    gcloud services enable run.googleapis.com artifactregistry.googleapis.com iamcredentials.googleapis.com storage.googleapis.com

    # image repository + bucket that stores gifts.json
    gcloud artifacts repositories create gospel-christian-church --repository-format=docker --location=us-central1
    gcloud storage buckets create gs://PROJECT_ID-gospel-christian-church-data --location=us-central1       # staging
    gcloud storage buckets create gs://PROJECT_ID-gospel-christian-church-prod-data --location=us-central1  # production

    # deploy service account (used by GitHub)
    gcloud iam service-accounts create gh-deployer
    SA=gh-deployer@PROJECT_ID.iam.gserviceaccount.com
    for R in roles/run.admin roles/artifactregistry.writer roles/iam.serviceAccountUser; do
      gcloud projects add-iam-policy-binding PROJECT_ID --member=serviceAccount:$SA --role=$R
    done

    # Cloud Run runtime identity (default compute SA) must read/write the bucket
    PN=$(gcloud projects describe PROJECT_ID --format='value(projectNumber)')
    gcloud storage buckets add-iam-policy-binding gs://PROJECT_ID-gospel-christian-church-data \
      --member=serviceAccount:$PN-compute@developer.gserviceaccount.com --role=roles/storage.objectAdmin

    # keyless auth from GitHub (Workload Identity Federation)
    gcloud iam workload-identity-pools create github --location=global
    gcloud iam workload-identity-pools providers create-oidc github-provider --location=global \
      --workload-identity-pool=github --issuer-uri=https://token.actions.githubusercontent.com \
      --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
      --attribute-condition="assertion.repository=='GITHUB_USER/REPO'"
    gcloud iam service-accounts add-iam-policy-binding $SA --role=roles/iam.workloadIdentityUser \
      --member="principalSet://iam.googleapis.com/projects/$PN/locations/global/workloadIdentityPools/github/attribute.repository/GITHUB_USER/REPO"
    gcloud iam workload-identity-pools providers describe github-provider --location=global \
      --workload-identity-pool=github --format='value(name)'   # → GCP_WORKLOAD_IDENTITY_PROVIDER

### GitHub settings (Settings → Secrets and variables → Actions)
| Type | Name | Value |
| --- | --- | --- |
| Secret | `GCP_WORKLOAD_IDENTITY_PROVIDER` | output of the last command above |
| Secret | `GCP_SERVICE_ACCOUNT` | `gh-deployer@PROJECT_ID.iam.gserviceaccount.com` |
| Secret | `ADMIN_PASSWORD` | your /admin password (avoid commas) |
| Secret | `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v3 secret key (server-only; never commit it) |
| Variable | `GCP_PROJECT_ID` | your project id |
| Variable | `NEXT_PUBLIC_CHURCH_EMAIL`, `NEXT_PUBLIC_GOAL`, `NEXT_PUBLIC_BASE_RAISED`, `NEXT_PUBLIC_GCASH_NUMBER`, `NEXT_PUBLIC_MAYA_NUMBER`, `NEXT_PUBLIC_BANK_DETAILS`, `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | public settings (see `.env.example`); blank falls back to defaults |

`NEXT_PUBLIC_*` values are baked in at build time, so changing one means re-running the deploy. `ADMIN_PASSWORD` and `RECAPTCHA_SECRET_KEY` are read at runtime and never enter the image. Register the site's domains for the reCAPTCHA key in the Google reCAPTCHA console.

### Payment detail format
`NEXT_PUBLIC_GCASH_NUMBER`, `NEXT_PUBLIC_MAYA_NUMBER` and `NEXT_PUBLIC_BANK_DETAILS` all use the same format: `Label: value · Label: value`, for example
`GCash Number: GCASH_NUMBER · Account name: ACCOUNT_NAME` or
`Bank: BANK_NAME · Account name: ACCOUNT_NAME · Account no.: BANK_ACCOUNT_NUMBER` (placeholders — put the real values only in `.env.local` / GitHub variables, never in this file). Each part becomes a line on the site, so you can change the account name (or add lines). The Copy button copies the number / account number. In GitHub variables, paste the value without surrounding quotes.
