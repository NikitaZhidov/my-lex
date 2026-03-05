# BUILD
FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
COPY nx.json tsconfig.base.json tsconfig.json ./

COPY packages/locales/package.json ./packages/locales/package.json
COPY packages/shared-models/package.json ./packages/shared-models/package.json

RUN npm ci

COPY . .

RUN npm run db-generate

RUN npm run build:api

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/apps/api/dist/ ./
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/prisma.config.ts ./

RUN npm ci --omit=dev

CMD sh -c "npx prisma migrate deploy && node ./main.js"
