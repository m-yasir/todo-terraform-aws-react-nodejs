resource "aws_key_pair" "tf-tut-key" {
  key_name   = "tf-tut-key"
  public_key = file("key-pair.pub")
}
