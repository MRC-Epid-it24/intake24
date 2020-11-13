#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Instance name required"
else
  ansible-playbook -i ./instances/$1/hosts -e @./instances/$1/postgres/postgres-configuration.yml --extra-vars="instance=$1" ansible/database-init.yml
fi
