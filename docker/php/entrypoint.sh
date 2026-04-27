#!/bin/bash
set -e

# Run Laravel optimizations on boot
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations (with safety flag for production)
php artisan migrate --force

# Start Nginx in background
nginx -g "daemon off;" &

# Start PHP-FPM in foreground
exec php-fpm
