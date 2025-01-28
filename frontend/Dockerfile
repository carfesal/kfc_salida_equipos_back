# Etapa 1: Construir la aplicación
FROM node:12.22.1-alpine3.11 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

#RUN npm run build

# Etapa 2: Servir la aplicación con nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
