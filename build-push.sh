#!/usr/bin/env bash
set -ex

ECR_PATH=325398057325.dkr.ecr.us-east-1.amazonaws.com
UI_RUNNER_DOCKER_IMAGE=${ECR_PATH}/ennismore
UI_RUNNER_DOCKER_IMAGE_CACHE=${UI_RUNNER_DOCKER_IMAGE}:latest
UI_RUNNER_DOCKER_IMAGE_REV=${UI_RUNNER_DOCKER_IMAGE}:${GITHUB_SHA}

# Build image with current revision, caching from latest
docker pull -q ${UI_RUNNER_DOCKER_IMAGE_CACHE}
docker build \
  --cache-from ${UI_RUNNER_DOCKER_IMAGE_CACHE} \
  -t ${UI_RUNNER_DOCKER_IMAGE_REV} \
  .

docker push -q ${UI_RUNNER_DOCKER_IMAGE_REV}

if [ $GITHUB_REF == "refs/heads/master" ]
then
    docker tag ${UI_RUNNER_DOCKER_IMAGE_REV} ${UI_RUNNER_DOCKER_IMAGE_CACHE}
    docker push -q ${UI_RUNNER_DOCKER_IMAGE_CACHE}
fi
