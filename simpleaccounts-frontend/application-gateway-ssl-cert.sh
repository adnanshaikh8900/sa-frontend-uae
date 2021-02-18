nameserver="simpleaccounts-app"
maindomain="app.simpleaccounts.io"
subdomain="load-me"
helmDir="simpleaccounts-frontend"
SVrelease="0.0.3-alpha-394"

helm install $subdomain-frontend ./$helmDir --values ./$helmDir/values.yaml \
--set simpleVatBackendRelease=$SVrelease \
--set image.repository.frontend.tag=$SVrelease \
--set simpleVatHost=https://$subdomain-api.$maindomain \
--set fullnameOverride=$subdomain-frontend \
--set serviceAccount.name=$subdomain-deploy-robot-frontend \
--set ingress.hosts[0].host=$subdomain.$maindomain \
--set ingress.hosts[0].paths[0]="/*" \
--set ingress.tls[0].hosts[0]=$subdomain-api.$maindomain \
--set ingress.tls[0].hosts[1]=$subdomain.$maindomain \
-n $nameserver \
--dry-run --debug


helm list -n $nameserver

helm upgrade $subdomain-frontend ./$helmDir --values ./$helmDir/values.yaml \
--set simpleVatBackendRelease=$SVrelease \
--set image.repository.frontend.tag=$SVrelease \
--set simpleVatHost=https://$subdomain-api.$maindomain \
--set fullnameOverride=$subdomain-frontend \
--set serviceAccount.name=$subdomain-deploy-robot-frontend \
--set ingress.hosts[0].host=$subdomain.$maindomain \
--set ingress.hosts[0].paths[0]="/*" \
--set ingress.tls[0].hosts[0]=$subdomain-api.$maindomain \
--set ingress.tls[0].hosts[1]=$subdomain.$maindomain \
-n $nameserver \
--dry-run --debug

helm uninstall $subdomain-frontend -n $nameserver

helm rollback $subdomain-frontend 0  -n $nameserver


*************

nameserver="simpleaccounts-app"
maindomain="app.simpleaccounts.io"
subdomain="test1-app"
helmDir="simpleaccounts-frontend"
SVrelease="latest"

helm install $subdomain-frontend ./$helmDir --values ./$helmDir/values.yaml \
--set simpleVatBackendRelease=$SVrelease \
--set image.repository.frontend.tag=$SVrelease \
--set simpleVatHost=https://$subdomain-api.$maindomain \
--set fullnameOverride=$subdomain-frontend \
--set serviceAccount.name=$subdomain-deploy-robot-frontend \
--set ingress.hosts[0].host=$subdomain.$maindomain \
--set ingress.hosts[0].paths[0]="/*" \
--set ingress.tls[0].hosts={$subdomain.$maindomain} \
--set image.repository.frontend.imageName=prakhar1989/static-site \
-n $nameserver \
--dry-run --debug

***************
