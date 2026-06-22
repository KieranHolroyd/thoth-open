FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages/webhook/package.json packages/webhook/
COPY apps/demo-custom-tools-server/package.json apps/demo-custom-tools-server/

RUN pnpm install --frozen-lockfile

COPY packages/webhook/tsconfig.json packages/webhook/
COPY packages/webhook/src packages/webhook/src
COPY apps/demo-custom-tools-server/tsconfig.json apps/demo-custom-tools-server/
COPY apps/demo-custom-tools-server/src apps/demo-custom-tools-server/src

RUN pnpm demo:build

FROM node:22-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

ENV NODE_ENV=production

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/webhook/package.json packages/webhook/
COPY apps/demo-custom-tools-server/package.json apps/demo-custom-tools-server/

RUN pnpm install --frozen-lockfile --prod --filter @thothsupport/demo-custom-tools-server...

COPY --from=builder /app/packages/webhook/dist packages/webhook/dist
COPY --from=builder /app/apps/demo-custom-tools-server/dist apps/demo-custom-tools-server/dist

WORKDIR /app/apps/demo-custom-tools-server

EXPOSE 3001

CMD ["node", "dist/index.js"]
