#!/bin/bash 
set -e

AWS_REGION=${AWS_DEFAULT_REGION}
SERVICE_NAME=${SERVICE_NAME}
VPC_NAME=${VPC_NAME}
# STAGE=$(if [ "${ENVIRONMENT}" = "prod" ]; then echo "prd"; else echo ${ENVIRONMENT};fi)
VPCID=$(aws ec2 describe-vpcs --query "Vpcs[].VpcId" --filters Name=tag:Name,Values=${VPC_NAME} --region ${AWS_REGION} --output text)
CLUSTERPREFIX=$(aws ecs list-clusters --region us-east-1 | jq ".clusterArns[]" -r | cut -d "/" -f2 | grep ${STAGE} | sed -e "s/-${STAGE}//g")
LBPREFIX=$(aws elbv2 describe-load-balancers --region us-east-1 | jq ".LoadBalancers[].LoadBalancerArn" -r | cut -d"/" -f3 | grep ${STAGE} | sed -e "s/-${STAGE}.*//g"
)
SERVICE=$(echo $SERVICE_NAME | cut -d"-" -f2)
PORT=${PORT}

[ -z "${AWS_REGION}" ]    &&  echo "variable  AWS_REGION is Empty" && exit 1 || echo "AWS_REGION is ok"
[ -z "${SERVICE_NAME}" ]  &&  echo "variable  SERVICE_NAME is Empty" && exit 1 || echo "SERVICE_NAME is ok"
[ -z "${STAGE}" ]         &&  echo "variable  STAGE is Empty" && exit 1 || echo "STAGE is ok"
[ -z "${VPCID}" ]         &&  echo "variable  VPCID is Empty" && exit 1 || echo "VPCID is ok"
[ -z "${CLUSTERPREFIX}" ] &&  echo "variable  CLUSTERPREFIX is Empty" && exit 1 || echo "CLUSTERPREFIX is ok"
[ -z "${LBPREFIX}" ]      &&  echo "variable  LBPREFIX is Empty" && exit 1 || echo "LBPREFIX is ok"
[ -z "${SERVICE}" ]       &&  echo "variable  SERVICE is Empty" && exit 1 || echo "SERVICE is ok"
[ -z "${PORT}" ]          &&  echo "variable  PORT is Empty" && exit 1 || echo "PORT is ok"


cat>terraform/variables.auto.tfvars<<EOF
# AWS Config
region      = "${AWS_REGION}"
environment = "${STAGE}"

# Listener Configuration
endpoint_path = "/${SERVICE}"
header_host   = "queimadiaria.com.br"

# Data Configuration
vpc_id              = "${VPCID}"
prefix_cluster_name = "${CLUSTERPREFIX}"
prefix_lb_name      = "${LBPREFIX}"

# Docker Repository Configuration
repository = "queima/microservice/${SERVICE}"

# Service Configuratin
service = {
    name = "${SERVICE_NAME}"
    type = "instance"
    memory       = 256
    cpu          = 128
    action_type  = "foward"
    
    container_definition = {
      hostPort      = 0
      containerPort = ${PORT}
      protocol      = "HTTP"
    }

    health = {
      retries     = 5
      timeout     = 10
      interval    = 30
      startPeriod = 30
    }
}
EOF