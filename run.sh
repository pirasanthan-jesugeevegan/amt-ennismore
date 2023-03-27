#!/usr/bin/env bash

# Run command while ignoring non-zero exit code
set +e

docker run \
    -v $PWD/:/ennismore \
    ${ECR_REGISTRY}/ennismore:latest \
    yarn cypress:run
cmd_code=$?  # Keep the return code for the actual test run

# Generate report
docker run \
    -v $PWD/:/ennismore \
    ${ECR_REGISTRY}/ennismore:latest \
    node cucumber-html-report.js
report_code=$?

# Upload to S3
aws s3 sync \
    --acl public-read \
    ./cypress/reports \
    s3://ennismore/report
upload_code=$?

# All 3 commands should have succeeded (code=0) for the script to be consider successful
exit $((cmd_code + report_code + upload_code))
