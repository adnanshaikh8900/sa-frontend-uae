curl \
  -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -T request.json \
  https://cloudbuild.googleapis.com/v1/projects/simplevat-dev/builds
