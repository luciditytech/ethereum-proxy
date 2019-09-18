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
	@aws eks update-kubeconfig --name kubernetes-staging

use-production:
	@echo "## Using production ##"
	@aws eks update-kubeconfig --name kubernetes-production

deploy-staging: build push use-staging
	@echo "## Deployed to staging ##"
	@kubectl set image deployment/ethereum-proxy-api ethereum-proxy=$(IMAGE) -n ethereum-proxy

deploy-production: build push use-production
	@echo "## Deployed to production ##"
	@kubectl set image deployment/ethereum-proxy-api ethereum-proxy=$(IMAGE) -n ethereum-proxy

rollback-staging: deploy-staging
	@echo "## Rolling back - staging ##"

rollback-production: deploy-production
	@echo "## Rolling back - production ##"
