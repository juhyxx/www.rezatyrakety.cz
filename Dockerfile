FROM php:8.5-apache

RUN apt-get update
RUN apt-get install --yes cron g++ gettext libicu-dev openssl libkrb5-dev libxml2-dev libfreetype6-dev libgd-dev bzip2 libbz2-dev libtidy-dev libcurl4-openssl-dev libz-dev libmemcached-dev libxslt-dev

RUN a2enmod rewrite

RUN docker-php-ext-install mysqli 
RUN docker-php-ext-enable mysqli

RUN docker-php-ext-configure gd --with-freetype=/usr --with-jpeg=/usr
RUN docker-php-ext-install gd

COPY ./ /var/www/html/