# 1. Utilisation d'une image Node stable et légère
FROM node:20-alpine

# 2. Création du dossier de travail
WORKDIR /app

# 3. Copie des fichiers de configuration pour installer les dépendances
# Ces fichiers sont dans ton dossier /backend
COPY package*.json ./

# 4. Installation des dépendances (y compris le CLI NestJS pour le build)
RUN npm install

# 5. Copie de tout le reste du code source du backend
COPY . .

# 6. Compilation du code TypeScript en JavaScript (génère le dossier /dist)
RUN npm run build

# 7. Port utilisé par NestJS en interne
EXPOSE 3000

# 8. Commande pour lancer l'application en mode production
CMD ["npm", "run", "start:prod"]