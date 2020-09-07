#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Instance name required"
else
  ansible-playbook -i ./instances/$1/hosts -e @./instances/$1/api-server/app.json --extra-vars="instance=$1" ansible/api-server.yml
fi
