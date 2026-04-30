#!/bin/sh
set -e

# Install PHP dependencies if vendor is not present
if [ ! -f vendor/autoload.php ]; then
    echo "Installing PHP dependencies..."
    composer install --no-interaction
fi

# Generate application key if .env exists but key is empty
if [ -f .env ] && grep -q "^APP_KEY=$" .env; then
    echo "Generating application key..."
    php artisan key:generate
fi

# Run database migrations
echo "Running migrations..."
php artisan migrate --no-interaction

# Start the Laravel development server
exec php artisan serve --host=0.0.0.0 --port=8000
