# Microservice Template
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Composition and Requirements
1. [Docker](https://docs.docker.com/engine/install/)
2. [Docker Compose](https://docs.docker.com/compose/install/)
3. [Terraform](www.terraform.io)


```bash
# ORM and Database info
npm i -S @nestjs/typeorm typeorm
npm i -S pg
# AWS SQS service
npm i -S sqs-consumer
# Developer requirements
npm i -D @types/node
```

## Installation

- Replace all microservice-x with the new microservice name
- Replace all qd_template_backend_db string to new database name
- Configure Files in terraform

Create a new .npmrc file as follows:
```bash
cat>.npmrc<<EOF
@queimadiaria:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=$GITHUB_TOKEN
EOF
```

Replace the variable GITHUB_TOKEN with your [Personal Access Token](https://github.com/settings/tokens) with the following permissions: `read:org, read:packages, read:public_key, repo`

Run the following commands:
```bash
npm install
npx nest build
make setup_microservice
sh config/entrypoint-docker.sh
```

If docker containers for db and api is not running yet, just run the following command:

```bash
make dev
```

To stop running containers, just run the following command:
```bash
make clear
```

## Testing the app

To make test work it will be better to use the following command:
```bash]
make teste
```
- This command will run all migrations and also unit tests. It could also run integrations tests, but this is not the focus for this command.
## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## [Vault](https://vaultproject.io)

Every credential/password will be pulled from Vault where the secrets will be managed and stored accordingly with your role access.
The roles are given based on which team at Github you are part of, and that should reflect your job fucntion and the squad that you work on.

Initially this will be divided in major teams by theme or speciallity such backend, frontend, mobile, tv etc.
<!-- Further we should migrate this permissions based in your squad and projects that you are working with. -->

## Security: Accessing AWS
The script [awsqueima](.devcontainer/awsqueima) is a support script made for you to access your credential easily. With that you will no longer require a credential to access AWS console. Only terminal, where your code will get the credentials as well and therefore you will still be able to test it.

### Configuration
As told before, your entire access will relly on Github. With that in mind you should get your Github Token to use it. 

Go to [Github Settings](https://github.com/settings/tokens) and generate a new token with the following permission: `read:org`. Remember to give the least privileage to this credential once it give access to your account in your behalf.

**Our recomendation is to use a tool to manage your token and keep it safe. For example [bitwarden](https://bitwarden.com/).**

* AWS Credentials, to get your credentials you have to:
  1. Login into vault with your `personal access token` as mentioned before;

```bash
awsqueima -l $GITHUB_TOKEN # remember to set this token in your terminal with `export GITHUB_TOKEN=aklsfjasfjlasjfdlaf`
# Or 
export PAT=$GITHUB_TOKEN
awsqueima -l
```
  2. Select the role that you should have access;
```bash
# ENV should be prd, dev, hml or main, but for now just used main
awsqueima -b <ENV>  # For backends
awsqueima -a <ENV>  # For administrators
```
There is only this two for now
## License

Nest is [MIT licensed](LICENSE).
