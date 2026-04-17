# Infrastructure

Docker is required to host the infrastructure. Bare-metal installs are not supported.

## Development

Create two folders inside of `infrastructure/volume` if they don't already exist.

```sh
mkdir -p infrastructure/volume/mariadb
mkdir -p infrastructure/volume/redis
```

Start the required services for development.

```sh
cd infrastructure

# If you have GNU Make
make dev-up

# If not
docker compose -f docker-compose.dev.yml up -d
```

## Development Commands Cheat Sheet

All commands can be found in the [Makefile](Makefile).

```sh
# Clean volumes (will wipe the database and cache, do not do this while running)
make clean

# Start the services
make dev-up

# Stop the services
make dev-down

# Use the SQL shell
make database

# Use the Redis CLI
make cache
```

