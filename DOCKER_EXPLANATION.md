# 🐳 Guide de Dockerisation Smartschool

Ce document explique l'architecture Docker mise en place pour déployer Smartschool (Frontend + Backend + Base de données) de manière professionnelle et stable.

## 🏗️ Architecture des Services

Nous avons configuré 3 services interconnectés via un réseau Docker privé (`smartschool-network`) :

### 1. **smartschool-ui** (Le Frontend)
- **Role** : Sert l'interface utilisateur React/Vite.
- **Port** : Accessible sur le port `3003` de votre machine (mappé vers le 3000 interne).
- **Technique** : Utilise `node:20-alpine` pour construire l'application (`npm run build`) puis le serveur ultra-léger `serve` pour distribuer les fichiers statiques.
- **Configuration** : Connecté à l'API via la variable `VITE_API_URL`.

### 2. **smartschool-api** (Le Backend)
- **Role** : API NestJS qui gère la logique métier.
- **Port** : Accessible sur le port `3002` (pour ne pas entrer en conflit avec d'autres services).
- **Technique** : Construit à partir du dossier `/backend`.
- **Dépendance** : Attend que la base de données soit prête avant de démarrer.

### 3. **smartschool-db** (La Base de données)
- **Role** : Base de données PostgreSQL 15.
- **Persistance** : Les données sont stockées dans un volume Docker nommé `postgres_data`, ce qui garantit qu'elles ne sont pas perdues si vous redémarrez les conteneurs.

## 🚀 Comment ça marche ?

Lorsque vous lancez ce stack via Portainer ou `docker-compose up` :

1.  **Construction** : Docker lit les `Dockerfile` du frontend et du backend pour créer des "Images" personnalisées contenant tout le code et les bibliothèques nécessaires (`node_modules`).
2.  **Réseau** : Il crée le réseau virtuel pour que l'API puisse parler à la DB (`smartschool-db`) sans exposer la DB à internet.
3.  **Lancement** : 
    *   La DB démarre en premier.
    *   L'API démarre, se connecte à la DB.
    *   Le Frontend démarre et est prêt à recevoir vos clics.

## 🛠️ Bibliothèques et Outils Clés Identifiés

Lors de l'analyse du projet, nous avons identifié et pris en compte les éléments suivants pour la dockerisation :

*   **Vite** (Frontend) : Outil de build moderne. Nécessite une étape de build pour produire le dossier `dist`.
*   **Serve** (Frontend) : Serveur statique ajouté dans le Dockerfile pour servir le dossier `dist` en production (bien plus performant que `vite preview`).
*   **NestJS** (Backend) : Framework Node.js robuste pour l'API.
*   **PostgreSQL** : Le moteur de base de données choisi.

## 📋 Instructions de Déploiement

1.  Surez-vous que tout le code est commité ("git push").
2.  Dans **Portainer**, allez dans votre Stack.
3.  Cliquez sur **"Update the stack"**.
4.  Activez l'option **"Re-pull image and redeploy"** pour forcer la reconstruction avec les nouveaux Dockerfiles.

Vos services seront alors accessibles :
- **Frontend** : `http://VOTRE-IP:3003`
- **Backend** : `http://VOTRE-IP:3002`
