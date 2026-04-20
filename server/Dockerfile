FROM node:lts

# Install
RUN npm install -g pnpm
WORKDIR /app

COPY package.json .
RUN pnpm i

# Host
COPY . .
CMD ["pnpm", "start"]
