# =========================================================
# Stage 1: Node – build frontend assets
# =========================================================
FROM node:20-alpine AS frontend-build

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# =========================================================
# Stage 2: Composer – install PHP dependencies
# =========================================================
FROM composer:2 AS composer-build

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-interaction \
    --no-dev \
    --prefer-dist \
    --optimize-autoloader

# =========================================================
# Stage 3: Production image
# =========================================================
FROM php:8.3-fpm-alpine AS production

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    bash \
    curl \
    libpng-dev \
    libzip-dev \
    oniguruma-dev \
    && docker-php-ext-install pdo_mysql mbstring bcmath gd zip opcache \
    && pecl install redis \
    && docker-php-ext-enable redis

# OPcache configuration for production
COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Nginx configuration
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf

WORKDIR /var/www/html

# Copy application source
COPY . .

# Copy compiled frontend assets
COPY --from=frontend-build /app/public/build ./public/build

# Copy PHP vendor dependencies
COPY --from=composer-build /app/vendor ./vendor

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Copy entrypoint script
COPY docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
