# Etapa 1: Compilar Angular con Node
FROM node:20-alpine AS build
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# 🔥 USAMOS SOLO EL COMANDO CON EL PARCHE
RUN npm install --legacy-peer-deps

# Copiamos el resto del código
COPY . .

# 🔥 PASO VITAL: Compilar la aplicación para producción
RUN npm run build --configuration=production

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiamos tu configuración de rutas (asegúrate de tener este archivo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos la app compilada desde la etapa anterior
# Nota: Revisa si tu carpeta es 'itam-frontend' o 'itam-frontend/browser'
COPY --from=build /app/dist/itam-frontend/browser /usr/share/nginx/html

EXPOSE 80
