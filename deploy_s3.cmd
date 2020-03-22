aws s3 sync . s3://www.charon.org/sql/ --delete --acl public-read --exclude "git"
aws s3 rm s3://www.charon.org/sql/.git
aws s3 rm s3://www.charon.org/sql/deploy_s3.cmd

aws cloudfront create-invalidation --distribution-id E2LH0VP7P26H2B --paths "/sql"