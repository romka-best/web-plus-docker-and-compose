FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY ./ ./
RUN npm run build

FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install pm2 -g
RUN npm ci --omit=dev
COPY --from=builder /app/ecosystem.config.js ./
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]
