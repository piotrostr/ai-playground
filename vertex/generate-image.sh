#!/bin/bash

PROJECT_ID=$(gcloud config get-value project)

curl -X POST \
    -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    -H "Content-Type: application/json; charset=utf-8" \
    -d @request.json \
    "https://us-central1-aiplatform.googleapis.com/v1/projects/$PROJECT_ID/locations/us-central1/publishers/google/models/imagegeneration:predict" | jq -c '.predictions[]' | while read -r i; do
    uuid=$(uuidgen)
    echo $i | jq -r '.bytesBase64Encoded' | base64 -d > "image-${uuid}.png"
done
