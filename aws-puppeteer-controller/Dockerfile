# Dockerfile for aws-puppeteer-controller and required nodejs libraries
FROM alpine:3.10


LABEL maintainer="lactin@ualberta.ca"


RUN apk add --update nodejs npm

RUN mkdir -p /opt/aws-puppeteer-controller
COPY ./config.json /opt/aws-puppeteer-controller/
COPY ./server.js /opt/aws-puppeteer-controller/


WORKDIR /opt/aws-puppeteer-controller

RUN npm install connect express mathjs

CMD [ "/usr/bin/node", "server.js" ]

EXPOSE 8880
