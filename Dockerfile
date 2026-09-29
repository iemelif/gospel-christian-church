# ---- deps ----
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- build ----
FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* are inlined by Next.js at build time, so they must be build args.
ARG NEXT_PUBLIC_CHURCH_EMAIL
ARG NEXT_PUBLIC_GOAL
ARG NEXT_PUBLIC_BASE_RAISED
ARG NEXT_PUBLIC_GCASH_NUMBER
ARG NEXT_PUBLIC_MAYA_NUMBER
ARG NEXT_PUBLIC_BANK_DETAILS
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_CHURCH_EMAIL=$NEXT_PUBLIC_CHURCH_EMAIL \
    NEXT_PUBLIC_GOAL=$NEXT_PUBLIC_GOAL \
    NEXT_PUBLIC_BASE_RAISED=$NEXT_PUBLIC_BASE_RAISED \
    NEXT_PUBLIC_GCASH_NUMBER=$NEXT_PUBLIC_GCASH_NUMBER \
    NEXT_PUBLIC_MAYA_NUMBER=$NEXT_PUBLIC_MAYA_NUMBER \
    NEXT_PUBLIC_BANK_DETAILS=$NEXT_PUBLIC_BANK_DETAILS \
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- run ----
FROM node:24-alpine AS run
WORKDIR /app
# ADMIN_PASSWORD and RECAPTCHA_SECRET_KEY are injected at runtime by Cloud Run (never baked into the image).
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 DATA_DIR=/data
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
RUN mkdir -p /data
EXPOSE 3000
CMD ["node", "server.js"]
