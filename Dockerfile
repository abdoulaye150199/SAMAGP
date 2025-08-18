FROM php:8.2-apache

# Installation des dépendances
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    git \
    unzip \
    libzip-dev \
    && docker-php-ext-install zip

# Configuration d'Apache
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf
RUN a2enmod rewrite

# Copier les fichiers du projet
WORKDIR /var/www/html
COPY . .

# Installation des dépendances Node.js et build
RUN npm install
RUN npm run build

# Configuration des permissions
RUN chown -R www-data:www-data /var/www/html
RUN chmod -R 755 /var/www/html/public

# Créer et configurer le dossier data
RUN mkdir -p /data
RUN cp -r data/* /data/
RUN chown -R www-data:www-data /data

EXPOSE 80
CMD ["apache2-foreground"]