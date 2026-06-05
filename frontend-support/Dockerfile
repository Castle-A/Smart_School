# ==========================================
# STAGE 1: Builder
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Copie des fichiers de dépendances (Cache Layering)
COPY package*.json ./

# 2. Installation des dépendances
RUN npm ci --only=production

# 3. Copie du code source
COPY . .

# 4. Build de l'application
RUN npm run build

# ==========================================
# STAGE 2: Production
# ==========================================
# Utilisation de l'image officielle Nginx Unprivileged (non-root par défaut)
# Basée sur Alpine pour la légèreté
FROM nginxinc/nginx-unprivileged:alpine-slim

# Metadonnées
LABEL maintainer="SmartSchool Team - Support Interface"
LABEL description="Frontend Support - Interface de support technique SmartSchool"

# Le port par défaut de l'image unprivileged est 8080
EXPOSE 8080

# Copie des fichiers statiques depuis l'étape de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie de la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# La commande CMD est déjà définie dans l'image de base (nginx -g 'daemon off;')
