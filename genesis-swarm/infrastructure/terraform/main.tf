# Genesis-Core: AWS Infrastructure (Terraform)
# Classification: OMEGA-CORE
# Author: Oumar Sow
#
# Usage:
#   terraform init
#   terraform apply -var="ami_id=ami-xxxxxxxxxxxxxxxxx" -var="subnet_id=subnet-xxxxxxxx"

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.5.0"
}

variable "region" {
  description = "AWS Region de déploiement"
  type        = string
  default     = "eu-west-3"
}

variable "ami_id" {
  description = "ID de l'AMI AWS (Debian/Ubuntu optimisé Rust)"
  type        = string
  # Fournir via: terraform apply -var='ami_id=ami-xxxxxx'
}

variable "subnet_id" {
  description = "ID du sous-réseau VPC de déploiement"
  type        = string
  # Fournir via: terraform apply -var='subnet_id=subnet-xxxxxx'
}

variable "instance_type" {
  description = "Type d'instance AWS (Graviton recommandé pour Rust)"
  type        = string
  default     = "c6g.2xlarge"
}

variable "min_nodes" {
  description = "Nombre minimum de nœuds dans le cluster"
  type        = number
  default     = 10
}

variable "max_nodes" {
  description = "Nombre maximum de nœuds dans le cluster"
  type        = number
  default     = 500
}

provider "aws" {
  region = var.region
}

resource "aws_launch_template" "genesis_node" {
  name_prefix   = "genesis-core-node-"
  image_id      = var.ami_id
  instance_type = var.instance_type

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name    = "genesis-core-node"
      Project = "Genesis-Core"
      Author  = "Oumar Sow"
    }
  }
}

resource "aws_autoscaling_group" "genesis_core_cluster" {
  name                = "genesis-core-cluster"
  max_size            = var.max_nodes
  min_size            = var.min_nodes
  desired_capacity    = var.min_nodes
  vpc_zone_identifier = [var.subnet_id]

  launch_template {
    id      = aws_launch_template.genesis_node.id
    version = "$Latest"
  }

  tag {
    key                 = "Project"
    value               = "Genesis-Core"
    propagate_at_launch = true
  }
}

output "asg_name" {
  description = "Nom du groupe Auto Scaling"
  value       = aws_autoscaling_group.genesis_core_cluster.name
}
