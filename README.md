# A Random Walk Down The Web

Emulates a random user interactions starting from the target URL.

## Deploy Google Cloud Function

List all the available regions:
```
$ gcloud functions regions list

NAME
projects/single-loop-342704/locations/us-central1
projects/single-loop-342704/locations/us-east1
projects/single-loop-342704/locations/us-east4
projects/single-loop-342704/locations/us-west1
projects/single-loop-342704/locations/us-west2
projects/single-loop-342704/locations/us-west3
projects/single-loop-342704/locations/us-west4
projects/single-loop-342704/locations/europe-central2
projects/single-loop-342704/locations/europe-west1
projects/single-loop-342704/locations/europe-west2
projects/single-loop-342704/locations/europe-west3
projects/single-loop-342704/locations/europe-west6
projects/single-loop-342704/locations/asia-east1
projects/single-loop-342704/locations/asia-east2
projects/single-loop-342704/locations/asia-northeast1
projects/single-loop-342704/locations/asia-northeast2
projects/single-loop-342704/locations/asia-northeast3
projects/single-loop-342704/locations/asia-south1
projects/single-loop-342704/locations/asia-southeast1
projects/single-loop-342704/locations/asia-southeast2
projects/single-loop-342704/locations/northamerica-northeast1
projects/single-loop-342704/locations/southamerica-east1
projects/single-loop-342704/locations/australia-southeast1
```

In order to deploy to single/multiple regions just run `make us-east1 asia-east1`.
**Be careful!** One can also deploy to all the available regions by running `make deploy`.

Make provides an easy way to speed up deployment by enabling parallelism via `make -j 10 deploy`.

## Triggering Cloud Functions

After deployment you'll get a URL like `http://us-east1-single-loop-342704.cloudfunctions.net/random`.
One way to trigger the functions is to navigate to
```
http://us-east1-single-loop-342704.cloudfunctions.net/random?timeout=120&target=https://en.wikipedia.org
```

After the walk finishes (see `timeout`) you'll be greated with a screenshot from the last page visited.
Response headers contains a lot of useful information about the walk including number of hops, ingress traffic generated, last page URL, etc.

## Results

My quick tests showed that for a medium-sized web site a random walk of about 2 minutes (~20 hops) results in approximately 20MB of traffic.
Looking at the [pricing](https://cloud.google.com/functions/pricing) we can run function 50 times (~1GB of traffic) for just < $0.10.
Enjoy!