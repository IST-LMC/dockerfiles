# Dockerfile for php-fpm, php and associated php libraries required for moodle
FROM ubuntu:18.04

LABEL maintainer="lactin@ualberta.ca"

ARG PHP_VERSION='7.2'

ENV PHP_VERSION ${PHP_VERSION}

ENV LC_ALL=C.UTF-8

RUN apt update
RUN apt install -y software-properties-common && apt install -y language-pack-en
RUN echo "\r" | add-apt-repository ppa:ondrej/php

# PHP and PHP-FPM Install
RUN apt update
RUN apt install -y php${PHP_VERSION}-fpm && apt install -y php${PHP_VERSION}  && apt install -y git

# PHP Modules
RUN apt install -y php${PHP_VERSION}-apc php${PHP_VERSION}-curl php${PHP_VERSION}-gd php${PHP_VERSION}-intl php${PHP_VERSION}-ldap
RUN apt install -y php${PHP_VERSION}-pgsql php${PHP_VERSION}-pspell php${PHP_VERSION}-xmlrpc php${PHP_VERSION}-xsl php${PHP_VERSION}-memcache php${PHP_VERSION}-memcached
RUN apt install -y php${PHP_VERSION}-zip php${PHP_VERSION}-soap php${PHP_VERSION}-bcmath php${PHP_VERSION}-bz2 php${PHP_VERSION}-mbstring

RUN mkdir -p /var/log/php-fpm
COPY ./www.conf /etc/php/${PHP_VERSION}/fpm/pool.d/www.conf

RUN mkdir -p /var/www/moodle
RUN mkdir -p /run/php

RUN git clone --depth 1 https://github.com/moodle/moodle.git /var/www/moodle

RUN apt-get clean 

# Moodle application files
WORKDIR /var/www/moodle

CMD [ "/usr/sbin/php-fpm7.2", "-F", "-c", "/etc/php/7.2/fpm/php-fpm.conf" ]

EXPOSE 9000
