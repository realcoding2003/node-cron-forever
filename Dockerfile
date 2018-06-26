FROM node:latest
MAINTAINER Woong-Gi Jeon<jeon.wbbi@gmail.com>

RUN mkdir -p /var/node-cron/app
RUN mkdir -p /var/node-cron/config
RUN mkdir -p /var/node-cron/logs

ADD ./app/ /var/node-cron/app/

WORKDIR /var/node-cron/app

RUN npm install forever -g

VOLUME ["/var/node-cron/config"]
VOLUME ["/var/node-cron/logs"]

CMD forever /var/node-cron/app/node-cron.js