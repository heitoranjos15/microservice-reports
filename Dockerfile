##
# Base
##
FROM node:12-alpine as base
RUN apk add --no-cache --virtual .gyp\
    curl \
    git \
    python \
    make \
    g++
##
# Builder
##
FROM  base AS builder
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
COPY package*.json .npmrc ./
RUN npm i -g @nestjs/cli 
RUN npm install && npm cache clean --force 
COPY . .
RUN nest build

##
# Prod
##
FROM base AS prod
EXPOSE 3000
# create app directory
WORKDIR /app
RUN chown -R node:node /app
# Copy Files
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/config/entrypoint-docker.sh /
COPY --from=builder --chown=node:node /app/package*.json ./
COPY --from=builder --chown=node:node /app/.env ./
RUN chmod +x /entrypoint-docker.sh 
# Arguments
ARG NODE_ENV=development
ARG NEW_RELIC_LICENSE_KEY=''
ARG NEW_RELIC_APP_NAME=microservice-x
# Environments
ENV NODE_ENV ${NODE_ENV}
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_APP_NAME=${NEW_RELIC_APP_NAME}
ENV NEW_RELIC_LICENSE_KEY=${NEW_RELIC_LICENSE_KEY}
# Change root user
USER node
ENTRYPOINT [ "/entrypoint-docker.sh" ]
CMD ["/app/dist/main"]