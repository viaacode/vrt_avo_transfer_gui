#!/bin/bash
WD=/usr/share/nginx/html
cd $WD
#cat /etc/nginx/nginx.conf
echo "set envsin config with envsub"
envsub --env fqdn=${fqdn} --env idp_fqdn=${idp_fqdn} --env sessionSecret=${sessionSecret} --env muleHost=${muleHost} --env idp_pub_crt=${idp_pub_crt} --env issuer=${issuer} config-dist.yaml config.yaml
echo "Using config:"
cat config.yaml
nginx -g 'daemon off;'
