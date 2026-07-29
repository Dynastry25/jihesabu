# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm ci
RUN cd client && npm ci
RUN cd server && npm ci

COPY . .

RUN cd client && npm run build
RUN cd server && npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/package.json ./
COPY --from=builder /app/server/node_modules ./node_modules
COPY --from=builder /app/client/dist ./public

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "dist/index.js"]
