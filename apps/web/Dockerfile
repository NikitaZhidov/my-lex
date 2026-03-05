# BUILD
FROM node:22 AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

COPY package*.json ./
COPY nx.json tsconfig.base.json tsconfig.json ./

COPY packages/locales/package.json ./packages/locales/package.json
COPY packages/shared-models/package.json ./packages/shared-models/package.json
COPY packages/ui/package.json ./packages/ui/package.json

RUN npm ci

COPY . .

RUN npm run build:web


FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/web/.next/standalone/ ./
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

CMD [ "node", "/app/apps/web/server.js" ]
