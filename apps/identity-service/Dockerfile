FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN npm install -g pnpm@9
RUN pnpm install --frozen-lockfile || true
COPY . .
RUN pnpm -w -s --filter identity-service... run build

FROM gcr.io/distroless/nodejs24-debian12:nonroot
WORKDIR /app
COPY --from=builder /app/dist/apps/identity-service ./
USER 1000
ENV PORT=3001
CMD ["main.js"]
