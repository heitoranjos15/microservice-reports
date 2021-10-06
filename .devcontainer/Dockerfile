##
# Base
##
FROM node:12-alpine as base
RUN \
    apk update && apk upgrade && apk add --update alpine-sdk \
    && apk add --no-cache \
        bash \
        git \
        openssh \
        g++ \
        make \
        cmake  \
        curl \
        wget \
        python3 \
        py3-pip \
    && mkdir /app \
    && chown -R node:node /app \
    && npm i -g typescript @nestjs/cli @nestjs/core \
    && wget https://releases.hashicorp.com/terraform/1.0.0/terraform_1.0.0_linux_amd64.zip -O /tmp/terraform.zip \
    && sudo unzip /tmp/terraform.zip -d /usr/local/bin \
    && wget https://releases.hashicorp.com/vault/1.7.3/vault_1.7.3_linux_amd64.zip -O /tmp/vault.zip \
    && unzip /tmp/vault.zip -d /usr/local/bin \
    && pip3 install -U pip awscli \
    && wget https://queima-artifacts.s3.amazonaws.com/awsqueima.zip -O /tmp/awsqueima.zip \
    && unzip /tmp/awsqueima.zip -d /usr/local/bin \
    && chmod +x /usr/local/bin/awsqueima
 
EXPOSE 3000
EXPOSE 9229

# create app directory
WORKDIR /app

# Arguments
ARG NODE_ENV=development
ARG NEW_RELIC_LICENSE_KEY=''
ARG NEW_RELIC_APP_NAME=microservice-x

# Environments
ENV NODE_ENV ${NODE_ENV}
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_APP_NAME=${NEW_RELIC_APP_NAME}
ENV NEW_RELIC_LICENSE_KEY=${NEW_RELIC_LICENSE_KEY}
ENV VAULT_ADDR "https://vault.prd.queima.me"

# Change root user
USER node
