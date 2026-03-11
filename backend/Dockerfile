# Use the official PHP 8.2 CLI image
FROM php:8.2-cli

# Install system dependencies and PostgreSQL PHP extensions
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Set the working directory
WORKDIR /app

# Copy the backend code into the container
COPY . .

# Expose port 8000
EXPOSE 8000

# Run PHP's built-in server
CMD ["php", "-S", "0.0.0.0:8000"]