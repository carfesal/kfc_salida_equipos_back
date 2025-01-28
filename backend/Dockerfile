# Usa una imagen base oficial de Node.js
FROM node:20.18.1 as build

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código al contenedor
COPY . .

FROM node:20.18.1-slim as production

WORKDIR /app

COPY --from=build --chown=nonroot:nonroot /app ./

# Update and install cron and supervisor
RUN apt-get update && apt-get install -y \
    cron \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/index.sh /usr/local/bin/index.sh
COPY --from=build /app/supervisord.conf /etc/supervisord/conf.d/supervisord.conf

RUN chmod +x /usr/local/bin/index.sh
RUN mkdir -p /var/log/supervisor/app

COPY --from=build /app/cronjob.conf /etc/cron.d/scheduler
RUN chmod 0644 /etc/cron.d/scheduler \
    && crontab /etc/cron.d/scheduler

RUN npm ci --only=production

EXPOSE 3000

# Ejecuta la aplicación
CMD ["/usr/local/bin/index.sh"]
