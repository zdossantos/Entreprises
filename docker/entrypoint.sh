#!/bin/sh
set -e

# Ensure writable directories exist with correct permissions
mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Create SQLite database file if using SQLite
if [ "$DB_CONNECTION" = "sqlite" ]; then
    DB_FILE="${DB_DATABASE:-/var/www/html/database/database.sqlite}"
    if [ ! -f "$DB_FILE" ]; then
        echo "Creating SQLite database at $DB_FILE..."
        touch "$DB_FILE"
        chown www-data:www-data "$DB_FILE"
    fi
fi

# Run database migrations
echo "Running migrations..."
php artisan migrate --force --no-interaction

# Cache configuration, views, and events for performance
php artisan config:cache
php artisan view:cache
php artisan event:cache

# Start Supervisor (manages Nginx + PHP-FPM + queue worker)
exec /usr/bin/supervisord -c /etc/supervisord.conf
