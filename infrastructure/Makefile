.PHONY: clean database cache dev-up dev-down

clean:
	@rm -rf ./volume/redis/*
	@rm -rf ./volume/mariadb/*

database:
	@docker exec -it slidequiz-database mariadb -u slidequiz -p

cache:
	@docker exec -it slidequiz-cache redis-cli

dev-up:
	@docker compose -f docker-compose.dev.yml up -d

dev-down:
	@docker compose -f docker-compose.dev.yml down

