#!/bin/bash
# My first script

sudo docker ps -aq | xargs -n 1 docker stop
sudo docker ps -aq | xargs -n 1 docker rm -v
sudo docker volume prune
sudo docker network prune
sudo rm -rf channel-artifacts/*.block channel-artifacts/*.tx crypto-config
sudo rm -rf channel-artifacts/*.block channel-artifacts/*.tx crypto-config