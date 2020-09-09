#Test dummy build
curl \
  -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -T request.json \
  https://cloudbuild.googleapis.com/v1/projects/gtt-project-prod/builds

#Test hello world to Teams webhook
#curl -H 'Content-Type: application/json' -d '{\"text\": \"Hello World\"}' https://outlook.office.com/webhook/619cdcba-0909-451b-b094-9229da967e58@dc296c81-6e73-46a8-b2b9-f7854f41f3fd/IncomingWebhook/9735385ac3634cb49fc497d858ccfb41/56bd4d9c-54ec-4c85-9c4e-0e2bcad0c95d
