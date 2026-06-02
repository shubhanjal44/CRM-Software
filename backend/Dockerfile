FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    postgresql-dev \
    oniguruma-dev

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files first for better layer caching
COPY composer.json ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction 2>/dev/null || true

# Copy the rest of the application
COPY . .

# Re-run composer with scripts now that all files are present
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Create storage directories
RUN mkdir -p storage/framework/{cache,sessions,views} \
    storage/logs \
    storage/app/public \
    bootstrap/cache

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Run Laravel optimizations (skip if APP_KEY not set)
RUN php artisan config:cache 2>/dev/null || true
RUN php artisan route:cache 2>/dev/null || true
RUN php artisan view:cache 2>/dev/null || true

EXPOSE 10000

CMD ["sh", "-c", "php artisan serve --host=0.0.0.0 --port=${PORT:-10000}"]
RUN php artisan optimize:clear