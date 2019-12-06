FROM node:dubnium-alpine as build

# Set arguments & environment variables
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
ARG PORT=8080
ENV PORT $PORT

# Expose port
EXPOSE $PORT
COPY ./  ./   
## Compiling CSS with grunt and node DEPRECATED change me please 
#install grunt 
##### TODO use native node grunt to avoid ruby #### 
RUN apk --update add --virtual build_deps \
   build-base ruby-dev libc-dev linux-headers &&\
   gem install --no-ri --no-rdoc sass && \
   npm i --global --silent npm@latest && \
   npm install && npm run prestart &&\
   apk del build_deps

WORKDIR /app
## Use a modified nginx container with passenger and nodejs
FROM debian:9 AS run
ENV NODE_ENV $NODE_ENV
ENV CI false
USER root
# create nginx user/group first, The container must not run as root ! to ease deployment on openshift
RUN  addgroup --system --gid 101 nginx \
    && adduser --system --disabled-login --ingroup nginx --no-create-home --home /nonexistent --gecos "nginx user" --shell /bin/false --uid 101 nginx \
    && apt-get update 
#INSTALL passenger
COPY install_passenger.sh /tmp/install_passenger.sh
RUN sh /tmp/install_passenger.sh
#Configure nginx
COPY default.conf /etc/nginx/sites-available/default
COPY --from=build /app /usr/share/nginx/html/app
COPY --from=build /app.js /usr/share/nginx/html/app.js
# set work dir app root
WORKDIR /usr/share/nginx/html
COPY entrypoint.sh /docker-entrypoint.sh
COPY nginx.conf /etc/nginx/nginx.conf
RUN chmod +x /docker-entrypoint.sh && chown 101:101 /docker-entrypoint.sh
RUN chgrp -R 101 /usr/share/nginx/html && chmod -R g+rwx /usr/share/nginx/html

#install the nodejs shizzels
COPY package.json /usr/share/nginx/html/package.json
COPY server /usr/share/nginx/html/server
## install app and envsub
RUN npm install && npm install -g envsub
# add configuration
COPY config-dist.yaml /usr/share/nginx/html/config-dist.yaml


# nginx user must own the cache directory to write cache
RUN chown -R 101:0 /var/cache/ /var/lib/nginx \
    && chmod -R g+w /var/cache/ /var/lib/nginx
# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log
ENV idp_fqdn ${idp_fqdn}
ENV fqdn ${fqdn}
ENV sessionSecret ${sessionSecret}
ENV muleHost ${muleHost}
ENV idp_pub_crt ${idp_pub_crt}
ENV issuer ${issuer}
USER nginx

EXPOSE 8080

STOPSIGNAL SIGTERM
#The entry point will use ennvsub to fill in the env in config
###  (this is startup only not changes at run time, redeploy needed if changed)
ENTRYPOINT ["/docker-entrypoint.sh"]


#RUN chgrp -R 0 /app/ && chmod -R g+rwX /app && chown node:node -R /app

# add user for openshift
#USER node

# Start application
#CMD npm run start
