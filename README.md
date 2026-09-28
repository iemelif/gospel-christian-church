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

## Deploy to Google Cloud Run (GitHub Actions)

`.github/workflows/deploy.yml` builds the Docker image, pushes it to Artifact Registry and deploys to Cloud Run on every push to `main`. `ci.yml` type-checks and builds every pull request / branch.

### One-time Google Cloud setup
Replace `PROJECT_ID`, `GITHUB_USER/REPO` and the bucket name.

    gcloud config set project PROJECT_ID
    gcloud services enable run.googleapis.com artifactregistry.googleapis.com iamcredentials.googleapis.com storage.googleapis.com

    # image repository + bucket that stores gifts.json
    gcloud artifacts repositories create gospel-church --repository-format=docker --location=asia-southeast1
    gcloud storage buckets create gs://PROJECT_ID-gospel-church-data --location=asia-southeast1

    # deploy service account (used by GitHub)
    gcloud iam service-accounts create gh-deployer
    SA=gh-deployer@PROJECT_ID.iam.gserviceaccount.com
    for R in roles/run.admin roles/artifactregistry.writer roles/iam.serviceAccountUser; do
      gcloud projects add-iam-policy-binding PROJECT_ID --member=serviceAccount:$SA --role=$R
    done

    # Cloud Run runtime identity (default compute SA) must read/write the bucket
    PN=$(gcloud projects describe PROJECT_ID --format='value(projectNumber)')
    gcloud storage buckets add-iam-policy-binding gs://PROJECT_ID-gospel-church-data \
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
| Variable | `GCP_PROJECT_ID` | your project id |
| Variable | `GCS_BUCKET` | `PROJECT_ID-gospel-church-data` |
| Variable | `NEXT_PUBLIC_CHURCH_EMAIL`, `NEXT_PUBLIC_GOAL`, `NEXT_PUBLIC_BASE_RAISED`, `NEXT_PUBLIC_GCASH_NUMBER`, `NEXT_PUBLIC_MAYA_NUMBER`, `NEXT_PUBLIC_BANK_DETAILS` | public settings (see `.env.example`); blank falls back to defaults |

`NEXT_PUBLIC_*` values are baked in at build time, so changing one means re-running the deploy. `ADMIN_PASSWORD` is read at runtime and never enters the image.
