#!/bin/bash

# Call script to remove all containers
#. fabric/resetchannel.sh

# Remove all docker images
sudo docker images | xargs -n 1 docker rmi -f
