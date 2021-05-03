#!/bin/bash

new_release=$1
echo "Executing $0 to upgrade helm releases with version $new_release"
helm list --all-namespaces | grep 'frontend' > rc.txt

i=0
while read line
do
  if [ $i != 0 ]
  then
    rc=($line)

		domain="$(sed 's/\(-frontend$\)//' <<< "$rc")"
    echo "Upgrading Helm Release $domain with version $new_release"

		./simpleaccounts-frontend/simpleaccounts-frontend.sh upgrade $domain $new_release
		echo "Helm Release $domain upgraded"

  fi
  i=$((i+1))
done < rc.txt

#rm rc.txt
echo "All Helm Release Successfully Upgraded to Version $new_release."
