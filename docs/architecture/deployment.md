# Deployment

## 1. Pipeline overview (verified)

```
branch push / PR ──► ci.yml: npm ci → lint → test → build            (no deploy)
push to main     ──► deploy.yml: GCP auth (WIF) → docker build → push to Artifact Registry → Cloud Run deploy
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
- `deploy.yml`: on push to `main` (paths-ignore `**.md`) and `workflow_dispatch`; concurrency group per ref,
  no cancel. Permissions `contents: read`, `id-token: write`.
  - Auth: Workload Identity Federation (`GCP_WORKLOAD_IDENTITY_PROVIDER`, `GCP_SERVICE_ACCOUNT` secrets).
  - Image: `us-central1-docker.pkg.dev/<GCP_PROJECT_ID>/gospel-christian-church/gospel-christian-church`,
    tagged with the commit SHA and `latest`.
  - Build args from repository variables `NEXT_PUBLIC_*` (now seven, including `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`).
  - **Does not run lint or tests.**

## 4. Cloud Run service (verified, `deploy.yml`)

| Setting | Value |
| --- | --- |
| Service / region | `gospel-christian-church` / `us-central1` |
| Execution environment | gen2 (required for the volume mount) |
| Volume | Cloud Storage bucket `<GCP_PROJECT_ID>-gospel-christian-church-data` mounted at `/data` |
| Env | `NODE_ENV=production`, `DATA_DIR=/data`, `ADMIN_PASSWORD` and `RECAPTCHA_SECRET_KEY` (from GitHub secrets, plain env vars) |
| Access | `--allow-unauthenticated` (public site) |
| Scaling | min 0, **max 1** instance, concurrency 80 |
| Resources | 512Mi memory, 1 CPU, port 3000, 60s timeout |

- Scale-to-zero means cold starts and reset in-memory state (login rate limiter).
- One-time GCP setup (Artifact Registry repo, bucket, IAM, WIF) is documented in `README.md`.

## 5. Domains (verified / unknown)

- **Verified (owner-confirmed):** `www.gcciemelif.website` and `support.gcciemelif.website` point to this service.
- **Unknown:** how the domains are mapped (Cloud Run domain mapping, load balancer, or other), TLS setup and DNS.

## 6. Constraints (verified)

- Every merge/push to `main` goes live without a manual approval step.
- Production correctness depends on `max-instances=1` and the bucket mount ([data-storage.md](data-storage.md)).
- `NEXT_PUBLIC_*` changes require re-running the deploy.
- **Required before deploying the reCAPTCHA code:** repository variable `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and
  repository secret `RECAPTCHA_SECRET_KEY` (and the production domains registered for the key in the
  reCAPTCHA console). Without them every gift is rejected in production (the server fails closed).
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
with concurrency 80, scale to zero. **Proposed:** streaming responses or a higher timeout; secrets via
Secret Manager; budget-aware rate limiting.

## 9. Proposed (not decided)

Run lint/tests in `deploy.yml` or require CI via branch protection; non-root container user; Secret Manager
for secrets; health check; bucket versioning.

## 10. Owner input required

1. Should deploys require CI to pass / a manual approval?
2. Secret Manager for `ADMIN_PASSWORD`?
3. Domain mapping details and who manages DNS.

## 11. References

`Dockerfile`, `.dockerignore`, `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `next.config.ts`,
`README.md` (GCP setup).
