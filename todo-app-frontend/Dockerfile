FROM node:22-alpine AS builder
WORKDIR /app
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
COPY package.json package-lock.json* ./
RUN npm ci --silent
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
# Install a small static server globally so we don't need nginx
RUN npm install -g serve@14.2.0 --silent
COPY --from=builder /app/dist ./dist

EXPOSE 80
# Serve the built files on port 80
CMD ["serve", "-s", "dist", "-l", "80"]
