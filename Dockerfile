# Stage 1: Install dependencies & generate prisma client
FROM node:20-alpine AS builder

WORKDIR /app/backend-1

COPY package*.json ./
RUN npm install

COPY . .

# Generate prisma client
RUN npx prisma generate

# Stage 2: Production runtime
FROM node:20-alpine AS runner

WORKDIR /app/backend-1

COPY --from=builder /app/backend-1/package*.json ./
COPY --from=builder /app/backend-1/node_modules ./node_modules
COPY --from=builder /app/backend-1/src ./src
COPY --from=builder /app/backend-1/prisma ./prisma

# Install runtime dependencies (kalo butuh openssl buat prisma)
RUN apk add --no-cache openssl libstdc++ ca-certificates

EXPOSE 3010

CMD ["npm", "start"]
