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

CMD npm run db-deploy && npm run start:api
