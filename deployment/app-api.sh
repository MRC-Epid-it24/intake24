#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Instance name required"
else
  ansible-playbook -i ./instances/$1/hosts -e @./instances/$1/app-api/app.json --extra-vars="instance=$1" ansible/app-api.yml
fi
