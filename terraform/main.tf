provider "aws" {
  profile    = "default"
  region     = var.region
  access_key = var.access_key
  secret_key = var.secret_key
}

# Networking

locals {
  vpc_id            = aws_vpc.terraform-vpc.id
  private_subnet_1  = aws_subnet.terraform-tutorial-private-subnet.id
  private_subnet_2  = aws_subnet.terraform-tutorial-private-subnet-2.id
}

resource "aws_vpc" "terraform-vpc" {
  cidr_block            = "10.0.0.0/16"
  enable_dns_hostnames  = true

  tags = {
    Name = "Terraform_Tutorial"
  }
}

resource "aws_db_subnet_group" "private" {
  name       = "terraform-tutorial-db-subnet-group-private"
  subnet_ids = [local.private_subnet_1, local.private_subnet_2]

  tags = {
    Name = "Private DB Subnet Group"
  }
}

# Note: Two subnets as per requirement of AWS RDS subnet requirements

resource "aws_subnet" "terraform-tutorial-private-subnet" {
  availability_zone_id = "euc1-az1"
  cidr_block           = "10.0.1.0/24"
  vpc_id               = local.vpc_id

  tags = {
    Name = "Terraform Tutorial Private Subnet"
  }
}

resource "aws_subnet" "terraform-tutorial-private-subnet-2" {
  availability_zone_id = "euc1-az2"
  cidr_block           = "10.0.2.0/24"
  vpc_id               = local.vpc_id

  tags = {
    Name = "Terraform Tutorial Private Subnet 2"
  }
}

# Networking for postgres
resource "aws_security_group" "allow-internal-postgres" {
  name        = "allow-internal-postgres"
  description = "Allow internal Postgres requests"
  vpc_id      = local.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.terraform-vpc.cidr_block]
  }
}

# Network Config for server
resource "aws_security_group" "allow-internal-http" {
  name        = "allow-internal-http"
  description = "Allow internal HTTP requests"
  vpc_id      = aws_vpc.terraform-vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.terraform-vpc.cidr_block]
  }
}

resource "aws_security_group" "allow-ssh" {
  name        = "allow-ssh"
  description = "Allow SSH inbound traffic"
  vpc_id      = aws_vpc.terraform-vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# resource "aws_route_table_association" "terraform-tutorial-private-subnet" {
#   subnet_id      = aws_subnet.terraform-tutorial-private-subnet.id
#   route_table_id = aws_route_table.allow-outgoing-access.id
# }

# Modules

module "tasks_db" {
  source = "./postgres"
  
  username                = var.dbUsername
  password                = var.dbPassword
  db_subnet_group_name    = aws_db_subnet_group.private.id
  vpc_security_group_ids  = [aws_security_group.allow-internal-postgres.id]
}

module "server" {
    source                  = "./server"
    ami_id                  = var.ami_id
    name                    = "tf-tut-server"
    private_ip              = "10.0.2.5"
    subnet_id               = local.private_subnet_2
    key_pair_name           = aws_key_pair.tf-tut-key.key_name
    vpc_security_group_ids  = [
      aws_security_group.allow-ssh.id,
      aws_security_group.allow-internal-http.id
    ]
    depends_on = [
      module.tasks_db
    ]
}

resource "aws_internet_gateway" "tf-tut-gateway" {
  vpc_id = local.vpc_id
}

resource "aws_eip" "app_server-eip" {
  instance = module.server.instance_id

  depends_on = [aws_internet_gateway.tf-tut-gateway]
}

module "client_app_s3" {
  source = "./app"
  acl     = "public-read"
}
