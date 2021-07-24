variable "ami_id" {
    type    = string
}

variable "name" {
    type    = string
}

variable "private_ip" {
    type    = string
}

# required for ssh
variable "key_pair_name" {
    type    = string
}

variable "type" {
    default = "t2.micro"
    type    = string
}

variable "subnet_id" {
    type    = string
}

variable "vpc_security_group_ids" {
    type    = list(string)
}
