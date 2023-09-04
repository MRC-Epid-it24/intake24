#!/bin/bash

if [ "$#" -ne 1 ]; then
  echo "Instance name required"
else
  ansible-playbook -i ./instances/$1/hosts --extra-vars="instance=$1" ansible/app-all-in-one.yml
fi
