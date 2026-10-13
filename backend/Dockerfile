FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY drizzle ./drizzle
ENV NODE_ENV=production
ENV UPLOAD_DIR=/data/uploads
EXPOSE 3001
CMD ["node", "dist/index.js"]
