.PHONY: clean database dev-up dev-down

clean:
	@rm -rf ./volume/redis/*
	@rm -rf ./volume/mariadb/*

database:
	@docker exec -it slidequiz-database mariadb -u slidequiz -p

dev-up:
	@docker compose -f docker-compose.dev.yml up -d

dev-down:
	@docker compose -f docker-compose.dev.yml down

