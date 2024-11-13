# Usa una imagen base oficial de Node.js
FROM node:16

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia todo el código al contenedor, incluyendo la carpeta 'build'
COPY . .

# Expone los puertos utilizados
EXPOSE 3000 3002 3003 3004 3005 3006 3010 3015

# Ejecuta la aplicación
CMD ["node", "server.js"]
