REPOSITORY=500669969333.dkr.ecr.us-east-1.amazonaws.com/ethereum-proxy
TAG=$(shell git describe --abbrev=1 --tags --always)
IMAGE="$(REPOSITORY):v$(TAG)"

default: build

build:
	@echo "## Building the docker image ##"
	@docker build -t $(IMAGE) .

login:
	$(shell aws ecr get-login --no-include-email)

push: login
	@echo "## Pushing image to AWS ##"
	@docker push $(IMAGE)

use-staging:
	@echo "## Using staging ##"
	@aws eks update-kubeconfig --name kubernetes-staging --region us-east-1

use-production:
	@echo "## Using production ##"
	@aws eks update-kubeconfig --name kubernetes-production-1-15 --region us-east-1

deploy-staging: build push use-staging deploy-current-cluster-context
	@echo "## Deployed to staging ##"

deploy-production: build push use-production deploy-current-cluster-context
	@echo "## Deployed to production ##"

deploy-current-cluster-context:
	@kubectl set image deployment/ethereum-proxy-api ethereum-proxy=$(IMAGE) -n ethereum-proxy

rollback-staging: deploy-staging
	@echo "## Rolling back - staging ##"

rollback-production: deploy-production
	@echo "## Rolling back - production ##"
