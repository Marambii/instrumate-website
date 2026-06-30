# 1. Use official Node.js base image
FROM node:20-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 4. Copy source code
COPY . .

# 5. Build the Vite project
RUN npm run build

# 6. Use a lightweight web server to serve the app (e.g., nginx)
FROM nginx:alpine

# 7. Copy the build output to nginx's public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# 8. Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 9. Expose the port and start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
