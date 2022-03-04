name := $(shell basename $(shell pwd))
regions := $(shell gcloud functions regions list | cut -d '/' -f '4' | tail -n +2)

all: us-east1

list-regions:
	@echo $(regions) | tr ' ' '\n'

deploy-all: $(regions)

$(regions):
	@gcloud functions deploy \
		$(name) \
		--region $@ \
		--entry-point exercise \
		--runtime nodejs16 \
		--memory 1024 \
		--timeout 540 \
		--max-instances 5 \
		--min-instances 0 \
		--allow-unauthenticated \
		--trigger-http

.PHONY: deploy
