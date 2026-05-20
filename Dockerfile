# ─── Stage 0: PHP dependencies (Composer) ────────────────────────────────────
FROM composer:2 AS composer-builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-interaction --optimize-autoloader

# ─── Stage 1: Build frontend assets ──────────────────────────────────────────
FROM node:22-alpine AS node-builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
COPY --from=composer-builder /app/vendor ./vendor
RUN npm run build

# ─── Stage 2: Production image (PHP-FPM + Nginx + Supervisor) ────────────────
FROM php:8.3-fpm-alpine

RUN apk add --no-cache \
        nginx \
        supervisor \
        curl \
        libpng-dev \
        libzip-dev \
        zip \
        unzip \
        git \
        sqlite-dev \
        oniguruma-dev \
    && docker-php-ext-install \
        pdo \
        pdo_sqlite \
        pdo_mysql \
        opcache \
        pcntl \
        zip \
        mbstring \
    && rm -rf /tmp/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY --from=composer-builder /app/vendor ./vendor
COPY composer.json composer.lock ./
COPY . .
COPY --from=node-builder /app/public/build ./public/build

RUN mkdir -p /var/www/html/bootstrap/cache /var/www/html/storage/logs \
    && composer dump-autoload --optimize \
    && chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx/site.conf /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/php/php.ini /usr/local/etc/php/conf.d/99-app.ini
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
