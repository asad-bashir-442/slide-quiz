FROM node:lts AS builder

# Install
RUN npm install -g pnpm
WORKDIR /app

COPY package.json .
RUN pnpm i

# Build
ARG VITE_BASE_URL
ENV VITE_BASE_URL=${VITE_BASE_URL}

COPY . .
RUN pnpm run build

# Host
FROM nginx:alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
