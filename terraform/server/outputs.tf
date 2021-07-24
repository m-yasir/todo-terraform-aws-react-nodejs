output "server-private-ip" {
    value       = aws_instance.app_server.private_ip
    description = "Private IP of the nodejs server application ec2"
}

output "server-public-ip" {
    value       = aws_instance.app_server.public_ip
    description = "Public IP of the nodejs server application ec2"
}

output "instance_id" {
  value = aws_instance.app_server.id
}

output "name" {
  value = var.name
}
