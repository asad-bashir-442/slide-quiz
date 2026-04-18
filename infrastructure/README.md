# SlideQuiz/Infrastructure <img src="../infrastructure/assets/logo-small.png" align="right" width="150" />

![last-commit](https://img.shields.io/github/last-commit/asad-bashir-442/slide-quiz)
![repo-size](https://img.shields.io/github/repo-size/asad-bashir-442/slide-quiz)

The infrastructure for SlideQuiz. Docker is required to host the infrastructure. Bare-metal installs are not supported.

## Development

Create two folders inside of `infrastructure/volume` if they don't already exist.

```sh
mkdir -p infrastructure/volume/mariadb
mkdir -p infrastructure/volume/redis
```

Start the required services for development.

```sh
cd infrastructure

# If GNU Make is installed:
make dev-up

# If not:
docker compose -f docker-compose.dev.yml up -d
```

### Development Commands Cheat Sheet

All commands can be found in the [Makefile](Makefile).

```sh
make dev-up # Start the services
make dev-down # Stop the services
make database # Use the SQL shell
make cache # Use the Redis CLI

# Clean volumes (will wipe the database and cache, do not do this while running)
make clean
```

## Production

Add `--build` if the client has had any changes since the last build.

```sh
docker compose up -d # Start the services
docker compose down # Stop the services
```

## License

[MIT](LICENSE)
