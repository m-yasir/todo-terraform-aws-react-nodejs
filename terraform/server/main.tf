resource "aws_instance" "app_server" {
  ami                         = var.ami_id
#   iam_instance_profile   = var.iam_instance_profile
  instance_type               = var.type
  private_ip                  = var.private_ip
  subnet_id                   = var.subnet_id
  key_name                    = var.key_pair_name
  vpc_security_group_ids      = var.vpc_security_group_ids
  tags                        = {
      Name = var.name
    }
  user_data = <<EOF
#!/bin/bash
cd /tmp
echo '#!/bin/bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
source ~/.bashrc
nvm i 12.13.0
curl -o- -L https://yarnpkg.com/install.sh | bash
sudo yum install -y ruby wget
cd /home/ec2-user
sudo ln -s /home/ec2-user/.nvm/versions/node/v12.13.0/bin/node /usr/bin
sudo ln -s /home/ec2-user/.nvm/versions/node/v12.13.0/bin/npm /usr/bin
sudo ln -s /home/ec2-user/.yarn/bin/yarn /usr/bin
sudo yarn global add pm2
sudo ln -s /usr/local/bin/pm2 /usr/bin' >> init.sh
chmod +x init.sh
/bin/su -c "/tmp/init.sh" - ec2-user
rm init.sh
# sudo apt-get install git
# git clone https://github.com/m-yasir/terraform-aws-react-nodejs.git terraform-aws
# cd terraform-aws/server
# yarn
# export PORT=8000
# export BASE_URL=/api/v1
# export DB_URI=postgres://root:password@tasks-db:5432/todo
# pm2 start .
EOF

}