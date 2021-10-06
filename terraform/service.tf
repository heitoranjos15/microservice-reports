provider "vault" {
  address = var.vault_addr
  auth_login {
    path = "auth/queimadiaria/login"
    parameters = {
      token = var.vault_token
    }
  }
}

data "vault_aws_access_credentials" "creds" {
  type    = "sts"
  backend = "queimadiaria"
  role    = "queima-adm"
}

provider "aws" {
  access_key = data.vault_aws_access_credentials.creds.access_key
  secret_key = data.vault_aws_access_credentials.creds.secret_key
  token      = data.vault_aws_access_credentials.creds.security_token
  region     = var.region
  default_tags {
    tags = {
      CreationDate = timestamp()
      Builder      = "Terraform"
      Department   = "Queima Labs"
      Application  = var.service.name
      Project      = "Microservice"
      Environment  = "Development"
      CostCenter   = "0001 - TI - CORE"
    }
  }
}

terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
    vault = {
      source  = "hashicorp/vault"
      version = ">=2.20.0"
    }
  }
  backend "remote" {
    # The name of your Terraform Cloud organization.
    organization = "queimadiaria"
    workspaces {
      prefix = "microservice-x-"
    }
  }
}

variable "service" {}
variable "endpoint_path" {}
variable "environment" {}
variable "header_host" {}
variable "prefix_cluster_name" {}
variable "prefix_lb_name" {}
variable "region" {}
variable "repository" {}
variable "vpc_id" {}
variable "vault_token" {}
variable "vault_addr" {}


module "service" {
  source              = "git@github.com:queimadiaria/ecs-service-module-terraform.git"
  service             = var.service
  endpoint_path       = var.endpoint_path
  environment         = var.environment
  header_host         = var.header_host
  prefix_cluster_name = var.prefix_cluster_name
  prefix_lb_name      = var.prefix_lb_name
  region              = var.region
  repository          = var.repository
  vpc_id              = var.vpc_id
}