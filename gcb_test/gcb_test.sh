#Test dummy build
curl \
  -X POST \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -T request.json \
  https://cloudbuild.googleapis.com/v1/projects/gtt-project-prod/builds

# Test hello world to Teams webhook
#curl -H 'Content-Type: application/json' -d '{\"text\": \"Hello World\"}' https://outlook.office.com/webhook/16dc3053-ea38-41ed-99ea-59b8fae52c37@290a4fa3-3f81-4c6e-960a-f51dda982495/IncomingWebhook/bbf0dfaf2c0246f48985badfa4efe9b0/8bafecc0-777b-458e-91f7-4452bd516c11
