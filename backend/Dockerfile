# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# Run stage
FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

EXPOSE 5000

CMD ["node", "src/server.js"]
