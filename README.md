# A Random Walk Down The Web

Emulates a random user interactions starting from the target URL.

## Deploy Google Cloud Function

List all the available regions:
```
$ gcloud functions regions list

NAME
projects/your-project-name/locations/us-central1
projects/your-project-name/locations/us-east1
projects/your-project-name/locations/us-east4
projects/your-project-name/locations/us-west1
projects/your-project-name/locations/us-west2
projects/your-project-name/locations/us-west3
projects/your-project-name/locations/us-west4
projects/your-project-name/locations/europe-central2
projects/your-project-name/locations/europe-west1
projects/your-project-name/locations/europe-west2
projects/your-project-name/locations/europe-west3
projects/your-project-name/locations/europe-west6
projects/your-project-name/locations/asia-east1
projects/your-project-name/locations/asia-east2
projects/your-project-name/locations/asia-northeast1
projects/your-project-name/locations/asia-northeast2
projects/your-project-name/locations/asia-northeast3
projects/your-project-name/locations/asia-south1
projects/your-project-name/locations/asia-southeast1
projects/your-project-name/locations/asia-southeast2
projects/your-project-name/locations/northamerica-northeast1
projects/your-project-name/locations/southamerica-east1
projects/your-project-name/locations/australia-southeast1
```

In order to deploy to single/multiple regions just run `make us-east1 asia-east1`.
One can also deploy to all(be careful) the available regions by running `make deploy`.

Make provides an easy way to speed up deployment by enabling parallelism via `make -j 10 deploy`.

## Triggering Cloud Functions

After deployment you'll get a URL like `http://us-east1-your-project-name.cloudfunctions.net/random`.
One way to trigger the functions is to navigate with your browser to
```
http://us-east1-your-project-name.cloudfunctions.net/random?target=https://en.wikipedia.org
```

After the walk finishes (see `timeout`) you'll be greated with a screenshot from the last page visited.
Response headers contains a lot of useful information about the walk including number of hops, ingress traffic generated, last page URL, external IP, etc.

Here's how to run via curl
```
$ curl -I 'http://us-east1-your-project-name.cloudfunctions.net/random?target=https://www.bestchange.ru'

HTTP/2 200 
bytes-received: 25101452
content-type: image/png
etag: W/"471ce-HRtYmoZt1R9ux1pdFughvKSrEP8"
external-ip: 107.178.237.46
function-execution-id: pnxne66hamug
hops: 26
status: OK
x-cloud-trace-context: aa27d2f376ee3e7bcbefb1e303a5b352;o=1
content-length: 291278
date: Fri, 04 Mar 2022 03:19:52 GMT
server: Google Frontend
alt-svc: h3=":443"; ma=2592000,h3-29=":443"; ma=2592000,h3-Q050=":443"; ma=2592000,h3-Q046=":443"; ma=2592000,h3-Q043=":443"; ma=2592000,quic=":443"; ma=2592000; v="46,43"

```

## Results

Quick tests showed that for a medium-sized web site a random walk of about 2 minutes (~20 hops) results in approximately 20MB of traffic.
Looking at the [pricing](https://cloud.google.com/functions/pricing) we can run function 50 times (~1GB of traffic) for just < $0.10.
Enjoy!
