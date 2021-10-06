SHELL=/bin/bash

NAME_DIR:=$(shell echo $$(basename $(CURDIR)))
GET_TIMESTAMP:=$(shell echo "$$(date +'%s')000")
TIMESTAMP=${GET_TIMESTAMP}
NETWORK:=$(shell docker network ls --format {{.Name}} | grep queima-back-tier)

export DOCKER_BUILDKIT=1

DB = qd_template_backend_db

.PHONY = help
help: ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##/\t\t- /'
.PHONY = test
new_db:
	@docker-compose up -d db

setup_microservice: ## Setup Create database timestamp for new microservices
	@mv src/migrations/create/16*.ts  src/migrations/create/${TIMESTAMP}-create_database.ts
	@sed -i -E "s/(createDatabase[0-9]{0,13})/createDatabase${TIMESTAMP}/g" src/migrations/create/*-create_database.ts || exit 1
	@echo "Create database migration done!"
	@echo "Remember to:"
	@echo "- Create new environment variable via config/environment.config.sh (you need aws permission to run this)"
	@echo "- Follow the code example in src/api/sample to create your modules and create your entities following the example in src/database/entities/sample.entity.ts"
	@echo "- Cover your code with unit and integration tests"

dev: ## Name folder
	@docker-compose -f .devcontainer/docker-compose.dev.yml up --build -d
	@docker-compose logs
	@docker-compose -f .devcontainer/docker-compose.dev.yml exec api sh
	@echo ${NAME_DIR}

migration: ##
	@sh config/environment.config.sh && docker-compose up --build -d
	@sleep 15 && curl -sf http://localhost:3000/health > /dev/null || (docker-compose logs api && exit 1)

teste: migration 
	@echo $(NETWORK); echo $$PWD;
	@[ -z "${NETWORK}" ] \
		&& docker run --rm --network ${NETWORK} -v $$PWD:/app -w /app api sh -c "npm i; npm run test" \
		|| docker run --rm --network ${NAME_DIR}_queima-back-tier -v $$PWD:/app -w /app api sh -c "npm i; npm run test"   


teste_migration: ## Test database migration
	@docker-compose up --build -d
	@docker-compose exec db sh \
		-c 'PGPASSWORD="123" psql \
		-v ON_ERROR_STOP=1 \
		--username=postgres \
		--host=localhost \
		--port=5432 \
		--dbname=${DATABASE_DB} \
		-c "SELECT * FROM sample"'

clear:
	@docker-compose -f .devcontainer/docker-compose.dev.yml down -v
	@docker-compose down -v


init: # Initialie repo
	@if test -f ".npmrc"; then echo ".npmrc is created"; else echo "create .npmrc"; exit 1; fi
	@npm i && nest build
	@sh config/environment.config.sh
	@config/entrypoint-docker.sh sh