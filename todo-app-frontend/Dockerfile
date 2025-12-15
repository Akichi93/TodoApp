# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
COPY package.json package-lock.json* ./
RUN npm ci --silent
COPY . .
RUN npm run build

# Production stage - nginx static server
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
# Optional: expose port 80 (mapped by compose)
EXPOSE 80
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
