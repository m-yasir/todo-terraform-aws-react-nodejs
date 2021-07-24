resource "aws_s3_bucket" "app" {
  bucket        = "tf-tut-bucket"
  acl           = var.acl
  force_destroy = true

  website {
    index_document = "index.html"
    error_document = "index.html" # Temporarily
  }
  
  versioning {
    enabled = true
  }
}

resource "aws_s3_bucket_policy" "app" {
  bucket = aws_s3_bucket.app.id

  # Terraform's "jsonencode" function converts a
  # Terraform expression's result to valid JSON syntax.
  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "PublicReadGetObject",
        "Effect": "Allow",
        "Principal": "*",
        "Action": ["s3:GetObject"],
        "Resource": ["arn:aws:s3:::tf-tut-bucket/*"]
      }
    ]
  })
}
