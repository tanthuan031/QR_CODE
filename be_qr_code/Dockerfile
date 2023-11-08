FROM php:8.2-fpm
# Set working directory
WORKDIR /var/www/be_qr_code
# Copy composer.lock and composer.json
# COPY ./composer.lock ./composer.json /var/www/be_qr_code/
RUN apt-get update && apt-get install -y \
    build-essential \
    libzip-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle \
    vim \
    unzip \
    git \
    curl
# Install extensions
# RUN docker-php-ext-install pdo_mysql mbstring zip exif pcntl
RUN apt-get update
RUN apt-get install -y libpq-dev \
    && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
# Copy existing application directory contents
COPY ./be_qr_code/ /var/www/be_qr_code

# Copy existing application directory permissions
# RUN chown -R www-data: /var/www/be_qr_code
# Change ownership of storage directory
# RUN chown -R www-data:www-data /var/www/be_qr_code/storage/

# Set permissions for storage directory
# RUN chmod -R 777 /var/www/be_qr_code/storage/

# Expose port 9000 and start php-fpm server
EXPOSE 9000
CMD ["php-fpm"]
