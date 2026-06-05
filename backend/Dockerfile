# ==========================================
# STAGE 1: Builder
# ==========================================
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Installation des dépendances système nécessaires pour le build (si besoin)
# Pour l'instant, node:20-bullseye-slim suffit pour build NestJS + Prisma

# 1. Copie des fichiers de définition de dépendances (Cache Layering)
COPY package*.json ./
COPY prisma ./prisma/

# 2. Installation des dépendances (CI pour une installation propre et déterministe)
RUN npm ci

# 3. Génération du client Prisma
RUN npx prisma generate

# 4. Copie du code source
COPY . .

# 5. Build de l'application
RUN npm run build

# 6. Nettoyage des dépendances de développement pour l'image finale
# On réinstalle uniquement les dépendances de production
RUN npm ci --only=production && npm cache clean --force

# ==========================================
# STAGE 2: Production
# ==========================================
FROM node:20-bullseye-slim AS production

# Installation de dumb-init pour gérer correctement les signaux (PID 1)
# Installation des dépendances pour Puppeteer (Chromium)
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    chromium \
    fonts-freefont-ttf \
    libnss3 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Configuration des variables d'environnement
ENV NODE_ENV=production
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

WORKDIR /app

# Création de l'utilisateur non-root (déjà présent dans l'image node, on s'assure juste des permissions)
# On transfère la propriété des dossiers nécessaires
RUN chown -R node:node /app

# Passage à l'utilisateur non-root
USER node

# Copie des fichiers depuis le builder (avec changement de propriétaire à la volée)
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/package*.json ./

# Création du dossier uploads avec les bonnes permissions
RUN mkdir -p uploads && chown node:node uploads

# Exposition du port
EXPOSE 3010

# Utilisation de dumb-init comme point d'entrée
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Commande de démarrage
CMD ["node", "dist/main"]