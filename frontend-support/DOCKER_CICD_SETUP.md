# 🚀 Configuration Docker & CI/CD - Frontend Support

**Date**: 31 janvier 2026, 13:10 CET  
**Module**: Frontend Support (Interface Technique)  
**Status**: ✅ Configuration Complète

---

## 📋 Résumé

Le module **Frontend Support** a été entièrement configuré pour le déploiement Docker et l'intégration CI/CD.

---

## 🎯 Fichiers Créés

### 1. **Dockerfile** ✅
**Chemin**: `frontend-support/Dockerfile`

**Caractéristiques**:
- Multi-stage build (optimisé)
- Stage 1: Build avec Node 20 Alpine
- Stage 2: Production avec Nginx Unprivileged
- Sécurité: Exécution non-root
- Taille optimisée

**Ports**:
- Interne: `8080` (Nginx unprivileged)
- Externe: `${SUPPORT_PORT}` (défaut: 3004)

---

### 2. **nginx.conf** ✅
**Chemin**: `frontend-support/nginx.conf`

**Configuration**:
- Proxy API Backend: `/api/support` → `http://smartschool-api:3010/api/support`
- Proxy Auth: `/api/auth` → `http://smartschool-api:3010/api/auth`
- SPA Routing: Support React Router
- Sécurité: Headers CSP, X-Frame-Options, etc.
- Cache: Assets statiques avec expiration 1 an

---

### 3. **.dockerignore** ✅
**Chemin**: `frontend-support/.dockerignore`

**Exclusions**:
- `node_modules` (rebuild dans le container)
- `dist` (généré lors du build)
- `.git`, `.env` (sécurité)
- Fichiers markdown (non nécessaires)

---

## 🔧 Fichiers Mis à Jour

### 1. **docker-compose.yml** ✅
**Chemin**: `docker-compose.yml` (racine)

**Service Ajouté**: `smartschool-support`

```yaml
smartschool-support:
  build:
    context: ./frontend-support
    dockerfile: Dockerfile
  container_name: smartschool-support-${APP_ENV}
  restart: always
  security_opt:
    - no-new-privileges:true
  read_only: true
  ports:
    - "${SUPPORT_PORT:-3004}:8080"
  depends_on:
    smartschool-api:
      condition: service_healthy
  healthcheck:
    test: [ "CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1" ]
    interval: 30s
  networks:
    - smartschool-network
```

**Ressources**:
- CPU: 0.5 (limit) / 0.1 (reservation)
- RAM: 256M (limit) / 64M (reservation)

---

### 2. **deploy/docker-compose.deploy.yml** ✅
**Chemin**: `deploy/docker-compose.deploy.yml`

**Service Ajouté**: `smartschool-support`

```yaml
smartschool-support:
  image: registrydocker.castole.dedyn.io/smartschool-support:${IMAGE_TAG}
  restart: always
  ports:
    - "${SUPPORT_PORT:-3004}:8080"
  healthcheck:
    test: [ "CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1" ]
  networks:
    - smartschool-network
```

**Image Registry**:
- Dev: `registrydocker.castole.dedyn.io/smartschool-support:dev`
- Prod: `registrydocker.castole.dedyn.io/smartschool-support:prod`

---

### 3. **.gitea/workflows/CI.yml** ✅
**Chemin**: `.gitea/workflows/CI.yml`

**Étape 4 Ajoutée**: Build Frontend Support

```yaml
- name: Install & Build Frontend Support
  shell: bash
  run: |
    set -e
    cd frontend-support
    rm -f package-lock.json
    npm install
    npm run build
    echo "✅ Build Frontend Support terminé"
```

**Étape 6 Modifiée**: Build & Push Docker Images

```yaml
docker build -t registrydocker.castole.dedyn.io/smartschool-support:$TAG ./frontend-support
docker push registrydocker.castole.dedyn.io/smartschool-support:$TAG
```

**Workflow Complet**:
1. Clone repository
2. Build Backend (NestJS + Prisma)
3. Build Frontend (React + Vite)
4. **Build Frontend Support** ← NOUVEAU
5. Login Docker Registry
6. Build & Push 3 images (API, UI, Support)
7. Deploy via Webhook Portainer

---

### 4. **.env.example** ✅
**Chemin**: `.env.example` (racine)

**Variable Ajoutée**:

```bash
# Port sur lequel le frontend support (interface technique) écoute
SUPPORT_PORT=3004
```

---

## 🏗️ Architecture Docker

### Services SmartSchool

```
┌─────────────────────────────────────────────────────────────┐
│                    SMARTSCHOOL NETWORK                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │
│  │   DATABASE   │   │    REDIS     │   │     API      │   │
│  │  PostgreSQL  │   │    Cache     │   │   NestJS     │   │
│  │   :5432      │   │    :6379     │   │   :3010      │   │
│  └──────────────┘   └──────────────┘   └──────────────┘   │
│         │                  │                    │          │
│         └──────────────────┴────────────────────┘          │
│                             │                              │
│         ┌───────────────────┴───────────────────┐          │
│         │                                       │          │
│  ┌──────────────┐                    ┌──────────────┐     │
│  │   FRONTEND   │                    │   SUPPORT    │     │
│  │    React     │                    │    React     │     │
│  │   :3003      │                    │   :3004      │     │
│  └──────────────┘                    └──────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Flux de Requêtes

**Frontend Principal** (`smartschool-ui:3003`):
```
Browser → nginx:8080 → /api → smartschool-api:3010
```

**Frontend Support** (`smartschool-support:3004`):
```
Browser → nginx:8080 → /api/support → smartschool-api:3010/api/support
                    → /api/auth   → smartschool-api:3010/api/auth
```

---

## 🚀 Commandes de Déploiement

### Développement Local

```bash
# Build et démarrage de tous les services
docker-compose up -d --build

# Vérifier les logs du support
docker logs -f smartschool-support-development

# Accéder à l'interface
# Frontend principal: http://localhost:3003
# Frontend support:   http://localhost:3004
```

### Production (via CI/CD)

```bash
# 1. Push sur la branche main
git push origin main

# 2. Le CI/CD va automatiquement:
#    - Build backend, frontend, frontend-support
#    - Build 3 images Docker
#    - Push vers registrydocker.castole.dedyn.io
#    - Déclencher webhook Portainer (déploiement auto)

# 3. Vérifier le déploiement
docker ps | grep smartschool-support
```

### Manuel (Deploy)

```bash
# Dans le dossier deploy/
cd deploy

# Définir les variables
export IMAGE_TAG=prod
export SUPPORT_PORT=3004

# Démarrer le service support
docker-compose -f docker-compose.deploy.yml up -d smartschool-support

# Vérifier health
docker inspect smartschool-support-production | grep -i health
```

---

## ✅ Checklist de Validation

### Build Local ✅
- [x] `npm install` sans erreurs
- [x] `npm run build` réussi (444 KB gzippé: 144 KB)
- [x] TypeScript: 0 erreurs
- [x] Vite build: 33.27s

### Docker ⏳
- [ ] `docker build -t smartschool-support:test ./frontend-support`
- [ ] Image créée avec succès
- [ ] Taille de l'image < 50 MB
- [ ] Container démarre sans erreur
- [ ] Health check: OK après 10s

### Déploiement ⏳
- [ ] Service accessible sur port 3004
- [ ] Nginx proxy API fonctionne
- [ ] Authentification fonctionne
- [ ] React Router fonctionne (SPA)
- [ ] Assets statiques chargés

### CI/CD ⏳
- [ ] Workflow CI trigger sur push
- [ ] Build frontend-support réussi
- [ ] Image pushée vers registry
- [ ] Deployment webhook déclenché
- [ ] Service mis à jour en production

---

## 📝 Variables d'Environnement

### Développement (.env)

```bash
# Frontend Support
SUPPORT_PORT=3004
VITE_API_URL=http://localhost:3010
```

### Production (.env)

```bash
# Frontend Support
SUPPORT_PORT=3004
VITE_API_URL=https://api.smartschool.votre-domaine.com
```

---

## 🔒 Sécurité

### Dockerfile
- ✅ Multi-stage build (pas de code source en prod)
- ✅ Image Nginx unprivileged (non-root)
- ✅ Système de fichiers read-only
- ✅ Tmpfs pour /tmp et /var/cache

### Nginx
- ✅ Headers de sécurité (CSP, X-Frame-Options, etc.)
- ✅ Server tokens masqués
- ✅ HSTS activé
- ✅ Proxy config sécurisée

### Docker Compose
- ✅ `security_opt: no-new-privileges`
- ✅ `read_only: true`
- ✅ Health checks configurés
- ✅ Ressources limitées

---

## 📊 Ressources Allouées

| Service | CPU Limit | CPU Reservation | RAM Limit | RAM Reservation |
|---------|-----------|-----------------|-----------|-----------------|
| Database | 1.0 | 0.2 | 1G | 256M |
| Redis | 0.5 | 0.1 | 256M | 64M |
| API | 1.0 | 0.2 | 1G | 256M |
| UI | 0.5 | 0.1 | 256M | 64M |
| **Support** | **0.5** | **0.1** | **256M** | **64M** |

**Total Minimum**: 0.7 CPU / 704M RAM  
**Total Maximum**: 3.5 CPU / 2.75G RAM

---

## 🎯 Prochaines Étapes

### Immédiat
1. ✅ **FAIT** - Créer Dockerfile frontend-support
2. ✅ **FAIT** - Créer nginx.conf
3. ✅ **FAIT** - Mettre à jour docker-compose.yml
4. ✅ **FAIT** - Mettre à jour CI.yml
5. ✅ **FAIT** - Mettre à jour .env.example

### Court Terme
6. ⏳ **TODO** - Tester build Docker local
7. ⏳ **TODO** - Tester déploiement local (docker-compose up)
8. ⏳ **TODO** - Vérifier health checks
9. ⏳ **TODO** - Tester CI/CD sur branche dev

### Moyen Terme
10. ⏳ **TODO** - Configurer reverse proxy (Traefik/Nginx)
11. ⏳ **TODO** - Ajouter certificats SSL
12. ⏳ **TODO** - Configurer monitoring (logs, métriques)

---

## 📞 Support

### Fichiers de Configuration

- **Dockerfile**: `frontend-support/Dockerfile`
- **Nginx**: `frontend-support/nginx.conf`
- **Docker Compose Dev**: `docker-compose.yml`
- **Docker Compose Prod**: `deploy/docker-compose.deploy.yml`
- **CI/CD**: `.gitea/workflows/CI.yml`
- **Env Template**: `.env.example`

### Logs

```bash
# Logs du service support
docker logs -f smartschool-support-${APP_ENV}

# Logs du build CI
# Voir dans l'interface Gitea Actions
```

### Troubleshooting

**Service ne démarre pas**:
```bash
docker logs smartschool-support-${APP_ENV}
docker inspect smartschool-support-${APP_ENV}
```

**Health check échoue**:
```bash
docker exec smartschool-support-${APP_ENV} wget -O- http://localhost:8080/
```

**Nginx erreur**:
```bash
docker exec smartschool-support-${APP_ENV} cat /etc/nginx/conf.d/default.conf
docker exec smartschool-support-${APP_ENV} nginx -t
```

---

**📅 Date de Création**: 31 janvier 2026, 13:10 CET  
**👤 Auteur**: Antigravity AI  
**📦 Version**: 1.0  
**✅ Status**: Configuration Complète

---

**FIN DU DOCUMENT**
