variable "db_subnet_group_name" {
  type = string
}

variable "instance_class" {
  type    = string
  default = "db.t3.micro"
}

variable "vpc_security_group_ids" {
  type    = list(string)
  default = []
}

variable "username" {
  type = string
}

variable "password" {
  type = string
}