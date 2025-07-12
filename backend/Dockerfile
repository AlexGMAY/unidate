# Stage 1: Build
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env ./

# Install production dependencies only
RUN npm prune --production

EXPOSE 3000
CMD ["node", "dist/app.js"]