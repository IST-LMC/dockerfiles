# Dockerfile for php-fpm, php and associated php libraries required for moodle
FROM ubuntu:16.04

LABEL maintainer="lactin@ualberta.ca"

ARG php_version='7.1'

ENV LC_ALL=C.UTF-8

RUN apt update
RUN apt install -y software-properties-common && apt install -y language-pack-en
RUN echo "\r" | add-apt-repository ppa:ondrej/php

# PHP and PHP-FPM Install
RUN apt update
RUN apt install -y php${php_version}-fpm && apt install -y php${php_version}  && apt install -y git

# PHP Modules
RUN apt install -y php${php_version}-apc php${php_version}-curl php${php_version}-gd php${php_version}-intl php${php_version}-ldap php${php_version}-mcrypt
RUN apt install -y php${php_version}-pgsql php${php_version}-pspell php${php_version}-xmlrpc php${php_version}-xsl php${php_version}-memcache php${php_version}-memcached
RUN apt install -y php${php_version}-zip php${php_version}-soap php${php_version}-bcmath php${php_version}-bz2 php${php_version}-mbstring 

RUN mkdir -p /var/log/php-fpm
COPY ./www-conf /etc/php/${php_version}/fpm/pool.d/www-conf

RUN mkdir -p /var/www/moodle

RUN git clone --depth 1 https://github.com/moodle/moodle.git /var/www/moodle

RUN apt-get clean 

# Moodle application files
WORKDIR /var/www/moodle

CMD [ "php-fpm", "-F", "--pid", "/var/run/php-fpm.pid", "-c", "/etc/php/${php_version}/fpm/php-fpm.conf" ]

EXPOSE 9000
