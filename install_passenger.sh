#!/bin/bash
apt-get update &&
apt-get install -y dirmngr gnupg curl
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 561F9B9CAC40B2F7
apt-get install -y apt-transport-https ca-certificates
sh -c 'echo deb https://oss-binaries.phusionpassenger.com/apt/passenger stretch main > /etc/apt/sources.list.d/passenger.list'
apt-get update
yes y | apt-get install -y nginx libnginx-mod-http-passenger

if [ ! -f /etc/nginx/modules-enabled/50-mod-http-passenger.conf ]; then sudo ln -s /usr/share/nginx/modules-available/mod-http-passenger.load /etc/nginx/modules-enabled/50-mod-http-passenger.conf ; fi
ls /etc/nginx/conf.d/mod-http-passenger.conf &&

echo "###### INSTALLING NODEJS #######"
apt-get install -y curl software-properties-common
curl -sL https://deb.nodesource.com/setup_12.x | bash -   && apt-get install -y nodejs
