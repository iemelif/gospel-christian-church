# Deployment

## 1. Pipeline overview (verified)

```
branch push / PR ──► ci.yml: npm ci → lint → test → build            (no deploy)
push to develop  ──► deploy-staging.yml: GCP auth (WIF) → docker build → push → Cloud Run gospel-christian-church      (gcciemelif.website)
push to main     ──► deploy-prod.yml:    GCP auth (WIF) → docker build → push → Cloud Run gospel-christian-church-prod (gcciemelif.com)
                     (skipped when only **.md files changed; also runnable manually)
```

## 2. Docker image (verified, `Dockerfile`)

- Three stages on `node:24-alpine`: `deps` (`npm ci`), `build` (copies source, receives the six
  `NEXT_PUBLIC_*` values as build args — including `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` —,
  `NEXT_TELEMETRY_DISABLED=1`, `npm run build`), `run`.
- Runtime stage copies `public/`, `.next/standalone` and `.next/static`; sets `NODE_ENV=production`,
  `PORT=3000`, `HOSTNAME=0.0.0.0`, `DATA_DIR=/data`; creates `/data`; runs `node server.js`.
- `.dockerignore` excludes `node_modules`, `.next`, `.git`, `.github`, `.env*`, `data`, `README.md`.
- Runs as root (no `USER`); no `HEALTHCHECK`.
- **Not verified:** a local `docker build` with the Node 24 base image has not been run; the first real check
  is the next deploy from `main`.

## 3. GitHub Actions (verified)

- `ci.yml`: on `pull_request` and pushes to branches other than `main`; Node 24 with npm cache; `npm ci`,
  `npm run lint`, `npm test`, `npm run build` (dummy `ADMIN_PASSWORD`).
- `deploy-prod.yml` (push to `main`, GitHub Environment `production`) and `deploy-staging.yml` (push to `develop`,
  Environment `staging`) are identical except for service, image, bucket and `NEXT_PUBLIC_SITE_ENV`
  (`production` / `staging`). Both: paths-ignore `**.md`, `workflow_dispatch`, one concurrency group each, no cancel.
  Permissions `contents: read`, `id-token: write`. Environment-level vars/secrets override repository-level ones.
  - Auth: Workload Identity Federation (`GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT` secrets).
  - Image: `us-central1-docker.pkg.dev/<GCP_PROJECT_ID>/gospel-christian-church/<service>`,
    tagged with the commit SHA and `latest`.
  - Build args from repository variables `NEXT_PUBLIC_*` (now seven, including `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`).
  - **Does not run lint or tests.**

## 4. Cloud Run services (`deploy-prod.yml` / `deploy-staging.yml`)

| Setting | Value |
| --- | --- |
| Service / region | prod `gospel-christian-church-prod`, staging `gospel-christian-church` / `us-central1` |
| Execution environment | gen2 (required for the volume mount) |
| Volume | Cloud Storage bucket `<GCP_PROJECT_ID>-gospel-christian-church-prod-data` (prod) / `…-gospel-christian-church-data` (staging) mounted at `/data` |
| Env | `NODE_ENV=production`, `DATA_DIR=/data`, `ADMIN_PASSWORD` and `RECAPTCHA_SECRET_KEY` (from GitHub secrets, plain env vars) |
| Access | `--allow-unauthenticated` (public site) |
| Scaling | **min 1, max 1** instance (always on), concurrency 80 |
| Resources | 512Mi memory, 1 CPU, port 3000, 60s timeout |

- Always on (min 1): no cold starts, so search-engine crawlers get a fast answer (a cold start once made Google's
  test report "Crawl failed"). The idle instance has a small monthly cost. A redeploy still resets in-memory state
  (login rate limiter).
- One-time GCP setup (Artifact Registry repo, bucket, IAM, WIF) is documented in `README.md`.

## 5. Domains (verified / unknown)

- **Verified (owner-confirmed):** `www.gcciemelif.website` and `support.gcciemelif.website` point to `gospel-christian-church`
  (now staging; robots.txt disallows all).
- **Owner action:** map `www.gcciemelif.com` to `gospel-christian-church-prod`.
- **Unknown:** how the domains are mapped (Cloud Run domain mapping, load balancer, or other), TLS setup and DNS.

## 6. Constraints (verified)

- Every merge/push to `main` (production) or `develop` (staging) goes live without a manual approval step
  (add required reviewers on the `production` GitHub Environment to change that).
- Production correctness depends on `max-instances=1` and the bucket mount ([data-storage.md](data-storage.md)).
- `NEXT_PUBLIC_*` changes require re-running the deploy.
- **Required before deploying the reCAPTCHA code:** repository variable `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and
  repository secret `RECAPTCHA_SECRET_KEY` (and the production domains registered for the key in the
  reCAPTCHA console). Without them every gift is rejected **and nobody can sign in to `/admin`** in production (the
  server fails closed).
- The service now makes an outbound HTTPS call at runtime (Google `siteverify`, 8s timeout) for each gift.
- **Unknown:** whether branch protection requires CI to pass before merging to `main`.

## 7. Security notes

- **Verified:** keyless GCP auth (WIF); runtime secret not baked into the image.
- **Verified:** `ADMIN_PASSWORD` and `RECAPTCHA_SECRET_KEY` are visible as plain environment variables in the
  Cloud Run configuration (not Secret Manager).
- **Owner action:** a reCAPTCHA secret was previously exposed; it must be rotated/revoked before the new one
  is configured. No key value is recorded in the repository or docs.
- **Local environment finding (2026-09-29, not a repository file):** the developer machine's git remote URL
  contained an embedded GitHub access token. The owner was advised to revoke it and use a credential
  helper or `gh auth`. No value is recorded here.

## 8. AI-relevant notes

**Verified limits** any AI feature would run under: 60s request timeout, 512Mi memory, 1 CPU, one instance
with concurrency 80, always on (min 1). **Proposed:** streaming responses or a higher timeout; secrets via
Secret Manager; budget-aware rate limiting.

## 9. Proposed (not decided)

Run lint/tests in the deploy workflows or require CI via branch protection; non-root container user; Secret Manager
for secrets; health check; bucket versioning.

## 10. Owner input required

1. Should deploys require CI to pass / a manual approval?
2. Secret Manager for `ADMIN_PASSWORD`?
3. Domain mapping details and who manages DNS.

## 11. References

`Dockerfile`, `.dockerignore`, `.github/workflows/ci.yml`, `.github/workflows/deploy-prod.yml`, `.github/workflows/deploy-staging.yml`, `next.config.ts`,
`README.md` (GCP setup).
