name := $(shell basename $(shell pwd))
regions = us-central1 us-east1 us-east4 us-west1 us-west2 us-west3 us-west4 europe-central2 europe-west1 europe-west2 europe-west3 europe-west6 asia-east1 asia-east2 asia-northeast1 asia-northeast2 asia-northeast3 asia-south1 asia-southeast1 asia-southeast2 northamerica-northeast1 southamerica-east1 australia-southeast1

all: us-east1

deploy: $(regions)

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
