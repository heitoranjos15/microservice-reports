#!/bin/bash
set -e

if [ "$ENVIRONMENT" = "dev" -o "$ENVIRONMENT" = "prod" ];
then 
    ACCOUNT_ID=$(aws sts get-caller-identity  | jq ".Account" -r)
    # Configurações do banco de dados 
    RDS_ENDPOINT=$(aws rds describe-db-instances --region us-east-1 | jq '.DBInstances[].Endpoint.Address' -r | grep "${ENVIRONMENT}\.")
    MICROSERVICE_ENDPOINT=$(aws elbv2 describe-load-balancers --region us-east-1 | jq ".LoadBalancers[].DNSName" -r | grep $ENVIRONMENT)
    # BUS_QUEUE=$(aws sqs get-queue-url --queue-name micro-websockets-bus-$ENVIRONMENT | jq ".QueueUrl" -r)
    if [ "$ENVIRONMENT" = "dev" ]; 
    then  
        REDIS_ENDPOINT=dev.redis.queima.tv
    else RDS_DATABASE
        REDIS_ENDPOINT=$(aws elasticache describe-cache-clusters \
            --cache-cluster-id websocket-redis-$ENVIRONMENT \
            --show-cache-node-info \
        | jq -r '.CacheClusters[0].CacheNodes[0].Endpoint.Address')
    fi
else
    RDS_PASSWORD=123
    RDS_ENDPOINT=db
    REDIS_ENDPOINT=dev.redis.queima.tv
    ACCOUNT_ID=teste
    MICROSERVICE_ENDPOINT=bla
fi

[ -z "$ACCOUNT_ID" ] && echo "ACCOUNT_ID is Empty" && exit 1 || echo "Variable is OK"
[ -z "$MICROSERVICE_ENDPOINT" ] && echo "MICROSERVICE_ENDPOINT is Empty" && exit 1 || echo "Variable is OK"
# [ -z "$BUS_QUEUE" ] &&MICROSERVICE_ENDPOINT
cat>.env<<EOF
NODE_ENV=${ENVIRONMENT}
REDIS_ENDPOINT=${REDIS_ENDPOINT}
DATABASE_USER=postgres
DATABASE_DB=qd_template_backend_db
DATABASE_HOST=${RDS_ENDPOINT}
DATABASE_PASSWORD=${RDS_PASSWORD}
EOF