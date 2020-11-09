docker build -f Dockerfile-maven -t gcr.io/gtt-k8s/simplevat-maven-builder .

docker push gcr.io/gtt-k8s/simplevat-maven-builder:latest
