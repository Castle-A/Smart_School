# 📖 CONTEXTE ET DIRECTIVES DU PROJET - SmartSchool v2.0

Ce document sert de **guide de contexte universel** pour tout développeur ou agent IA travaillant sur la solution **SmartSchool v2.0**. Il détaille l'architecture du projet, la structure des dossiers, les mécanismes de sécurité multi-tenant, et les conventions de développement.

---

## 🔍 1. Présentation Globale de SmartSchool

SmartSchool v2.0 est un système de gestion scolaire d'entreprise (SaaS) multi-tenant conçu pour gérer l'intégralité du cycle de vie d'un établissement d'enseignement (de la maternelle au lycée).

### Fonctionnalités Clés :
-   **Multi-tenant** : Isolation étanche des données de chaque école.
-   **Gestion des Années Académiques** : Passage automatisé (Rollover) d'une année à la suivante avec certification financière et académique par cycle.
-   **Finances Avancées** : Écolages structurés en tranches, gestion des dépenses, salaires des enseignants (Payroll) et intégration de passerelles de paiement (Stripe, Mobile Money).
-   **Support Technique Dédié** : Portail technique indépendant permettant l'octroi d'accès temporaires en lecture seule aux données d'une école pour débogage, avec traçabilité par audit log.

---

## 💻 2. Stack Technique et Prérequis

-   **Moteurs Requis** : Node.js `>= 20.0.0`, npm `>= 10.0.0`
-   **Backend** : NestJS (v11), Prisma ORM (v6), TypeScript.
-   **Base de Données** : PostgreSQL (Persistance principale), Redis 7 (Cache, sessions, et files d'attente BullMQ).
-   **Frontend Principal (UI)** : React 19, Vite, TypeScript, TailwindCSS, React Router 7.
-   **Portail Support** : React 19, Vite, TypeScript, TailwindCSS.
-   **Orchestration** : Docker / Docker Compose (images Unprivileged basées sur Alpine/Slim).

---

## 📂 3. Structure des Répertoires (Dossier Unique)

```
shining-universe/
├── .env                             # Configuration globale unifiée (DATABASE_URL, JWT_SECRET, etc.)
├── docker-compose.yml               # Configuration de production multi-conteneurs
│
├── backend/                         # API NestJS
│   ├── prisma/                      # Fichiers de configuration de base de données
│   │   ├── schema.prisma            # Schéma de données Prisma central (1200+ lignes)
│   │   └── seed.ts                  # Script de population des données initiales et permissions
│   ├── scripts/                     # Scripts d'administration (Superadmin, test DB)
│   ├── src/                         # Code NestJS (Clean Architecture)
│   │   ├── domain/                  # Entités et logique métier pure
│   │   ├── application/             # Cas d'utilisation (Service Layer)
│   │   ├── infrastructure/          # Drivers (PrismaService, R2 Storage, SMS, Redis)
│   │   ├── interface/               # Controllers REST et WebSockets (Controllers)
│   │   └── shared/                  # Décorateurs, Guards, Interceptors et Filtres globaux
│   └── Dockerfile                   # Image NestJS multi-stage de production avec dumb-init
│
├── frontend/                        # Application web principale (Client)
│   ├── src/
│   │   ├── app/                     # Pages et composants du tableau de bord
│   │   │   └── pages/dashboard/     # Dashboards pour les 9 rôles
│   │   ├── shared/                  # Contextes (Auth), hooks et services API partagés
│   │   └── main.tsx
│   └── Dockerfile                   # Serveur Nginx Unprivileged servant le build React
│
├── frontend-support/               # Portail pour les techniciens support
│   ├── src/
│   │   ├── pages/                   # Audit logs, gestion d'équipe et tickets
│   │   └── services/api.ts          # Requêtes API dédiées au support
│   └── Dockerfile                   # Serveur Nginx Unprivileged servant le portail support
```

---

## 🔒 4. Concepts Architecturaux Structurants

### A. Isolation Multi-Tenant (Transparent Query Isolation)
Pour des raisons de sécurité, aucune école ne doit pouvoir accéder aux données d'une autre école.

1.  **Extraction du Contexte** : Le `TenantInterceptor` lit le JWT, extrait le `schoolId`, et initialise le `TenantContextService`.
2.  **AsyncLocalStorage** : Le `TenantContextService` conserve le `schoolId` dans le stockage local de la requête Node.js (pas de pollution globale).
3.  **Filtrage Automatique ORM** : Le [prisma.service.ts](file:///c:/Users/Leroi/.gemini/antigravity/playground/shining-universe/backend/src/infrastructure/prisma/prisma.service.ts) utilise des extensions Prisma. Si le modèle requêté possède le champ `schoolId`, Prisma injecte dynamiquement ce filtre dans la clause `where` sur toutes les opérations de lecture/écriture.

### B. Transparence du Soft-Delete (Suppression Logique)
Les modèles contenant le champ `deletedAt` ne sont jamais physiquement effacés de la DB.
-   L'extension Prisma intercepte automatiquement les requêtes `findMany`, `findFirst`, `count`, etc., et y applique `{ deletedAt: null }`.

### C. Masquage RGPD (Privacy Interceptor)
Les techniciens ayant le rôle `SUPPORT_TECH` manipulant la console de support ne doivent pas voir les informations personnelles en clair.
-   Le [privacy.interceptor.ts](file:///c:/Users/Leroi/.gemini/antigravity/playground/shining-universe/backend/src/shared/interceptors/privacy.interceptor.ts) intercepte les réponses HTTP et remplace les numéros de téléphone et adresses e-mail par des masques (ex: `••••@••••`).

### D. Garde d'Idempotence (Idempotency Guard)
Pour éliminer les risques de double débit lors des paiements :
-   Le [idempotency.guard.ts](file:///c:/Users/Leroi/.gemini/antigravity/playground/shining-universe/backend/src/shared/guards/idempotency.guard.ts) exige l'en-tête HTTP `x-idempotency-key` sur les routes de transaction financière et bloque le traitement si une transaction portant la même clé existe déjà.

---

## 🛠️ 5. Commandes de Développement & DevOps

### Installation des Dépendances
```bash
# À la racine (installe les dépendances frontend-support)
npm install

# Dans le backend
cd backend && npm install

# Dans le frontend
cd frontend && npm install --force
```

### Exécution Locale (Mode Développement)
-   **Backend** : `cd backend && npm run start:dev` (API lancée sur le port `3010`)
-   **Frontend Client** : `cd frontend && npm run dev` (Interface lancée sur le port `3003`)
-   **Portail Support** : `cd frontend-support && npm run dev` (Interface lancée sur le port `3004`)

### Builds de Production
-   **Backend** : `cd backend && npm run build` (génère `backend/dist`)
-   **Frontend** : `cd frontend && npm run build` (génère `frontend/dist`)
-   **Support** : `cd frontend-support && npm run build` (génère `frontend-support/dist`)

### Déploiement Docker (Production)
```bash
# Build et exécution en arrière-plan
docker-compose up -d --build

# Arrêt des conteneurs
docker-compose down
```

---

## 📝 6. Directives de Développement (Conventions Strictes)

Tout développeur ou agent IA travaillant sur ce dépôt **doit** se conformer aux règles suivantes :

1.  **Directives de typage TypeScript strict** :
    -   Toutes les configurations utilisent `noUnusedLocals: true`. **Aucun import inutilisé ne doit être laissé dans le code**, sous peine de faire échouer le build de production.
    -   Éviter l'utilisation du type `any` sauf cas de force majeure extrême.
2.  **Configuration Environnement Unique** :
    -   Ne **JAMAIS** rajouter ou modifier de fichiers `.env` dans les sous-répertoires (ex: `backend/.env`). Toute configuration globale et locale doit être gérée dans le fichier `.env` de la racine.
    -   Le fichier `.env.example` de la racine doit être maintenu à jour si de nouvelles variables sont ajoutées.
3.  **Conventions NestJS (Clean Architecture)** :
    -   **Domain** : Doit rester pur, sans dépendances vers Prisma ou NestJS.
    -   **Application** : Contient les cas d'utilisation, utilise les interfaces définies pour communiquer avec l'infrastructure.
    -   **Infrastructure** : Implémente les interfaces, accès DB avec PrismaService.
    -   **Interface** : Uniquement DTOs, Controllers et mapping.
4.  **Base de Données et Prisma** :
    -   Après chaque modification du schéma `prisma/schema.prisma`, lancer `npx prisma generate` et créer une migration propre via `npx prisma migrate dev`.
    -   Toujours s'appuyer sur l'isolation automatique de `PrismaService` : ne pas passer manuellement le `schoolId` dans les clauses `where` si le modèle le gère automatiquement.

---

## 🚨 7. Problèmes Connus du Projet (À corriger en priorité)

*   **Signature HMAC manquante** : L'endpoint `POST /api/finance/webhook/:provider` ne valide pas les signatures HTTP, constituant une faille critique de contournement de facturation.
*   **Double route** : La route `accountant` est présente en double dans le routeur de [App.tsx](file:///c:/Users/Leroi/.gemini/antigravity/playground/shining-universe/frontend/src/App.tsx#L61-L62).
*   **Taille de bundle** : Le bundle React client pèse 1.7 Mo. Une configuration de code-splitting dans `vite.config.ts` est requise.
