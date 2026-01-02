# 1. Image de base
FROM node:20-alpine

# 2. Dossier de travail dans le conteneur
WORKDIR /usr/src/app

# 3. Copie des fichiers de dépendances
COPY package*.json ./

# 4. Installation des dépendances
RUN npm install

# 5. Copie du reste du code source
COPY . .

# 6. Build de l'application NestJS
RUN npm run build

# 7. Port exposé
EXPOSE 3000

# 8. Commande de lancement
CMD ["npm", "run", "start:prod"]