#!/bin/bash
set -e

# Run Laravel optimizations on boot
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations (with safety flag for production)
php artisan migrate --force

# Start PHP-FPM in daemon mode
php-fpm -D

# Start Nginx in foreground as PID 1 so Docker can manage signals correctly
exec nginx -g "daemon off;"
