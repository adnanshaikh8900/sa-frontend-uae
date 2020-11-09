#!/bin/bash

# If there is no current context, get one.
if [[ $(kubectl config current-context 2> /dev/null) == "" ]]; then
    cluster=$(gcloud config get-value container/cluster 2> /dev/null)
    zone=$(gcloud config get-value compute/zone 2> /dev/null)
    project=$(gcloud config get-value core/project 2> /dev/null)

    function var_usage() {
        cat <<EOF
No cluster is set. To set the cluster (and the zone where it is found), set the environment variables
  CLOUDSDK_COMPUTE_ZONE=<cluster zone>
  CLOUDSDK_CONTAINER_CLUSTER=<cluster name>
EOF
        exit 1
    }

    [[ -z "$cluster" ]] && var_usage
    [[ -z "$zone" ]] && var_usage

    echo "gcloud beta container clusters get-credentials $project --region $zone --project $project"
    #gcloud container clusters get-credentials --project="$project" --zone="$zone" "$cluster" || exit
    gcloud beta container clusters get-credentials $project --region $zone --project $project || exit
fi

echo "Executing rolling-update-new-release.bash for release $@"

kubectl get replicationcontrollers --namespace="simplevat-$2"

echo " Executing kubectl get replicationcontrollers --namespace="simplevat-$2" > rc.txt"
kubectl get replicationcontrollers --namespace="simplevat-$2" > rc.txt

i=0
echo "Upgrading replication controllers"
while read line
do
  if [ $i != 0 ]
  then
    rc=($line)
    domain="$(sed 's/\(-rep-.*\|-rep$\)//' <<< "$rc")"
    previous_ver="$(sed 's/\(.*-rep-\|.*-rep$\)//' <<< "$rc")"
    echo "Upgrading Replication Controller for $domain"

    if [ "$previous_ver" != "$1" ]
    then

      echo "./deploy/simplevat-new-release-script.bash $rc $2 $1"

      ./deploy/simplevat-new-release-script-v1.bash "$rc" $2 "$1" X

      echo "Replication Controller for $domain upgraded"

    else

      echo "Previous version : $previous_ver is same as new version : $1. Nothing to do"

    fi

  fi
  i=$((i+1))
done < rc.txt

echo "All Replication Controller Successfully."
