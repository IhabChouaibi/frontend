# ===== Build Angular =====
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production


# ===== Run with Nginx =====
FROM nginx:alpine

# Copier Angular build depuis le sous-dossier browser
COPY --from=build /app/dist/hrmsapp/browser /usr/share/nginx/html

# Copier config nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
