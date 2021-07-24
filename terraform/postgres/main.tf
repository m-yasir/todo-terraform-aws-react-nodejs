resource "aws_db_parameter_group" "terraform-tutorial" {
  name   = "terraform-tutorial-postgres"
  family = "postgres13"

  parameter {
    name  = "log_connections"
    value = "1"
  }
}

resource "aws_db_instance" "postgres" {
  allocated_storage         = 10
  storage_type              = "gp2"
  engine                    = "postgres"
  engine_version            = "13.3"
  storage_encrypted         = false
  apply_immediately         = true
  db_subnet_group_name      = var.db_subnet_group_name
  parameter_group_name      = aws_db_parameter_group.terraform-tutorial.name
  identifier                = "tasks-db"
  name                      = "todo"
  instance_class            = var.instance_class
  username                  = var.username
  password                  = var.password
  publicly_accessible       = false
  skip_final_snapshot       = true
  vpc_security_group_ids    = var.vpc_security_group_ids
}
