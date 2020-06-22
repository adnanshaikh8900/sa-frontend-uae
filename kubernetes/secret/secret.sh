kubectl create namespace simplevat-dev

kubectl create secret generic cloudsql-db-credentials --from-file=username=username.txt --from-file=password=password.txt --from-file=database=database.txt --namespace=simplevat-dev

