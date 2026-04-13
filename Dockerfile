# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build --prod

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos construidos
COPY --from=builder /app/dist/app-icathi /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]