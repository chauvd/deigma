FROM node:24-alpine AS builder
WORKDIR /app
COPY ./apps/identity-service/dist/production .
RUN npm install -g pnpm@10
RUN pnpm install --frozen-lockfile || true

FROM gcr.io/distroless/nodejs24-debian12:nonroot
WORKDIR /app
COPY --from=builder /app ./
USER 1000
ENV PORT=3001
CMD ["main.js"]
