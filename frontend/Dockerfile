# Utilisation de l'image officielle Node.js (version 20 légère sur Alpine Linux)
# C'est la base de notre environnement, comme installer Node sur un nouveau PC.
FROM node:20-alpine

# Définition du dossier de travail à l'intérieur du conteneur
# Toutes les commandes suivantes s'exécuteront dans ce dossier "/app"
WORKDIR /app

# Copie des fichiers de configuration des dépendances (package.json et lockfile)
# On le fait avant de tout copier pour profiter du cache Docker (build plus rapide)
COPY package*.json ./

# Installation des dépendances du projet
# npm ci (Clean Install) est plus fiable que npm install pour les builds de production
RUN npm ci

# Copie de tout le reste du code source du frontend dans le conteneur
COPY . .

# Construction de l'application pour la production
# Cela crée le dossier "dist" avec les fichiers optimisés (HTML, CSS, JS minifiés)
RUN npm run build

# Installation d'un serveur HTTP léger et performant pour servir les fichiers statiques
# "serve" est parfait pour distribuer le dossier "dist" généré par Vite
RUN npm install -g serve

# Documentation du port que le conteneur va utiliser
# Ce n'est pas une ouverture de port stricte, mais une indication pour Docker
EXPOSE 3000

# Commande de démarrage du conteneur
# serve : le serveur web
# -s : single-page application (redirige tout vers index.html pour le routing React)
# dist : le dossier à servir
# -l 3000 : le port d'écoute interne
CMD ["serve", "-s", "dist", "-l", "3000"]
