<h1 align="center">ennismore-qa-task

## About this Repo:

This is an exercise to write some automated tests against Amazon.co.uk.

## [](https://github.com/ennismore/qa-task#scenario)Scenario

1.  Search for a product
2.  Add the first 3 results that qualify for Prime delivery
3.  Reach the basket page
4.  Modify the quantity of one item
5.  Check totals
6.  Click checkout
7.  Confirm you have reached the login screen

[END]

Repeat this for 3 different product searches.

## Install

1. Clone the repo

2. `yarn  install`

## Run locally

**CLI** - Run CLI

```

yarn cypress:run

```

**Docker** - Run on Docker

Build Image

```

make docker

```

Run Image

```

make run

```

## Technology used:

- Report is deployed to S3 - [Report](https://ennismore.s3.amazonaws.com/report/index.html)

## Technology used:

- Cypress

- Cucumber

- Docker

- AWS (ECR & S3)

- Github Action (CI)
