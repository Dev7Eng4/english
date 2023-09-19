FROM node:18-alpine AS base

FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install global pnpm && pnpm i --frozen-lockfile;

COPY . .

RUN pnpm build

EXPOSE 3000

CMD [ "pnpm", "start" ]