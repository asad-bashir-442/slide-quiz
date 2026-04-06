FROM node:lts

# Install
RUN npm install -g pnpm serve
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm i

# Build
ARG VITE_BASE_URL
ENV VITE_BASE_URL=${VITE_BASE_URL}

COPY . .
RUN pnpm run build

# Host
CMD ["serve", "-s", "dist", "-l", "3000"]
