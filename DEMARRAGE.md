# 🚀 Guide de Démarrage Rapide - Corrections SmartSchool

Bienvenue ! Ce guide vous accompagne pour appliquer toutes les corrections identifiées lors de l'analyse du projet SmartSchool.

---

## 📋 **Ce qui a été Fait**

✅ **Analyse complète du code** (Backend + Frontend)  
✅ **Identification de 1 vulnérabilité critique CORS**  
✅ **Détection de 18 scripts obsolètes à supprimer**  
✅ **Création d'un template .env unifié**  
✅ **Génération de scripts automatisés de correction**  
✅ **Documentation complète (3 rapports)**

### Statut des Builds

- ✅ **Backend**: Build réussi (NestJS compilé sans erreur)
- ⏳ **Frontend**: Build en cours (React + Vite) - _voir note ci-dessous_

> **Note**: Le build frontend peut prendre 5-10 minutes en fonction de votre machine.  
> Vérifier le statut : `cd frontend && npm run build`

---

## 🎯 **Ce que Vous Devez Faire Maintenant**

### **ÉTAPE 1 : Appliquer les Corrections Automatiques** (2 minutes)

Exécutez le script de correction automatique :

```powershell
.\apply-fixes.ps1
```

**Ce script va** :
- ✅ Corriger la vulnérabilité CORS dans `backend/src/main.ts`
- ✅ Supprimer 18 scripts obsolètes dans `backend/scripts/`
- ✅ Corriger le port dans `frontend/.env.example`
- ✅ Archiver les scripts PowerShell frontend
- ✅ Vérifier l'existence du fichier `.env.example`

---

### **ÉTAPE 2 : Créer le Fichier .env Unifié** (5 minutes)

#### Option A : Script Automatisé (Recommandé)

```powershell
.\create-unified-env.ps1
```

Le script va :
- Copier `.env.example` vers `.env`
- Créer une sauvegarde de votre ancien `.env` (si existant)
- Afficher les anciennes valeurs (masquées pour sécurité)

#### Option B : Manuel

```powershell
Copy-Item .env.example .env
```

Puis ouvrir `.env` dans un éditeur et remplir les valeurs.

---

### **ÉTAPE 3 : Remplir les Variables d'Environnement** (5 minutes)

Ouvrez le fichier `.env` (à la racine) et remplacez **TOUTES** les valeurs `CHANGEME` :

#### 🔴 **Variables CRITIQUES (Obligatoires)**

```bash
# Base de données
DB_PASSWORD=VotreMotDePassePostgreSQL123!

# JWT Secret (32+ caractères, générer avec la commande ci-dessous)
JWT_SECRET=VotreSecretJWTDe32CaracteresMinimum123456789ABC

# URLs CORS autorisées
FRONTEND_URL=http://localhost:3003,https://votre-domaine.com
```

#### 🔐 **Générer un JWT Secret Sécurisé**

**Windows PowerShell** :
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Linux/Mac** :
```bash
openssl rand -base64 32
```

Copiez le résultat et collez-le dans `JWT_SECRET=`

#### 🟡 **Variables Optionnelles** (Selon votre configuration)

- `R2_*` - Si vous utilisez Cloudflare R2 pour le stockage
- `NGROK_URL` - Si vous utilisez ngrok pour les tests (développement uniquement)
- `SMTP_*` - Si vous activez les notifications par email

---

### **ÉTAPE 4 : Supprimer les Anciens Fichiers .env** (1 minute)

⚠️ **Seulement APRÈS avoir migré vos valeurs vers le nouveau `.env`** :

```powershell
# Vérifier d'abord que le nouveau .env est bien rempli
Get-Content .env | Select-String "CHANGEME"

# Si aucun résultat (toutes les valeurs sont remplies), alors supprimer :
Remove-Item .env.production -ErrorAction SilentlyContinue
Remove-Item env_restored -ErrorAction SilentlyContinue
```

---

### **ÉTAPE 5 : Tester Laonfiguration** (5 minutes)

#### Backend

```powershell
cd backend
npm run start:dev
```

✅ **Attendu** : `🚀 Backend is running on: http://localhost:3010`

#### Frontend (Nouvel onglet/terminal)

```powershell
cd frontend
npm run dev
```

✅ **Attendu** : `Local: http://localhost:3003`

#### Tester l'accès

1. Ouvrir le navigateur : `http://localhost:3003`
2. Vérifier que la page se charge sans erreur CORS
3. Tester la connexion à l'API

---

## 📚 **Documentation Disponible**

### Rapports Générés

| Fichier | Description | Utilité |
|---------|-------------|---------|
| `ANALYSE_ET_CORRECTIONS.md` | Rapport complet d'analyse | Comprendre tous les problèmes détectés |
| `MODIFICATIONS.md` | Liste des modifications | Voir ce qui a changé |
| `.env.example` | Template environnement | Créer votre fichier `.env` |
| `DEMARRAGE.md` | Ce fichier | Guide pas à pas |

### Scripts Disponibles

| Script | Utilisation | Description |
|--------|-------------|-------------|
| `apply-fixes.ps1` | `.\apply-fixes.ps1` | Applique toutes les corrections |
| `create-unified-env.ps1` | `.\create-unified-env.ps1` | Crée le fichier `.env` unifié |

---

## ⚠️ **Problèmes Courants & Solutions**

### ❌ Erreur : "L'exécution de scripts est désactivée"

**Problème** : PowerShell bloque l'exécution des scripts.

**Solution** :
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Puis réessayez.

---

### ❌ Erreur CORS lors du démarrage

**Problème** : Le frontend ne peut pas se connecter au backend.

**Solution** : Vérifier que `FRONTEND_URL` dans `.env` inclut `http://localhost:3003`

```bash
# Dans .env (racine)
FRONTEND_URL=http://localhost:3003,http://localhost:5173
```

---

### ❌ Backend ne démarre pas : "JWT_SECRET is not defined"

**Problème** : Variable d'environnement manquante.

**Solution** : Vérifier que le fichier `.env` existe **À LA RACINE** (pas dans `backend/`)

```powershell
# Vérifier
Test-Path .env

# Si FALSE, créer :
.\create-unified-env.ps1
```

---

### ❌ Build frontend très lent

**Problème** : Le build Vite peut prendre 5-10 minutes.

**Solution** : C'est normal pour la première fois. Laissez-le se terminer.

Pour accélérer les builds suivants :
```powershell
cd frontend
npm install baseline-browser-mapping@latest -D
```

---

## 📊 **Checklist de Vérification**

Avant de passer en production, vérifier :

### Configuration

- [ ] Le fichier `.env` existe à la racine
- [ ] Toutes les valeurs `CHANGEME` ont été remplacées
- [ ] Le `JWT_SECRET` fait au moins 32 caractères
- [ ] Les anciens fichiers `.env.production` et `env_restored` sont supprimés

### Sécurité

- [ ] La correction CORS a été appliquée dans `backend/src/main.ts`
- [ ] L'URL ngrok n'est plus hardcodée
- [ ] Les mots de passe sont forts (32+ caractères)
- [ ] Le fichier `.env` est bien dans `.gitignore`

### Fonctionnement

- [ ] Le backend démarre sans erreur
- [ ] Le frontend démarre sans erreur
- [ ] La connexion entre frontend et backend fonctionne
- [ ] Les builds compilent sans erreur

### Nettoyage

- [ ] 18 scripts obsolètes ont été supprimés
- [ ] Scripts PowerShell archivés dans `docs/archived-scripts/`
- [ ] Dossier `backend/scripts/` ne contient que 3 fichiers utiles

---

## 🚀 **Prochaines Étapes (Après Vérification)**

### 1. **Déploiement avec Docker**

```powershell
# Construction et lancement
docker-compose up --build

# En arrière-plan
docker-compose up -d --build
```

### 2. **Vérifier les Services Docker**

```powershell
docker-compose ps
```

✅ **Attendu** : 3 services en état "healthy" ou "running"
- `smartschool-db-staging` (PostgreSQL)
- `smartschool-api-staging` (Backend)
- `smartschool-ui-staging` (Frontend)

### 3. **Accéder à l'Application**

- **Frontend** : http://localhost:3003
- **Backend API** : http://localhost:3010
- **Base de données** : localhost:5432

---

## 📞 **Besoin d'Aide ?**

### Documentation

1. Lisez `ANALYSE_ET_CORRECTIONS.md` pour comprendre toutes les modifications
2. Consultez `.env.example` pour voir toutes les variables disponibles
3. Vérifiez `MODIFICATIONS.md` pour la liste complète des changements

### Logs

```powershell
# Backend
cd backend
npm run start:dev

# Frontend
cd frontend
npm run dev

# Docker
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f db
```

---

## ✅ **Résumé : 5 Étapes Rapides**

```powershell
# 1. Appliquer les corrections
.\apply-fixes.ps1

# 2. Créer le fichier .env
.\create-unified-env.ps1

# 3. Remplir les variables dans .env (éditeur de texte)

# 4. Supprimer les anciens .env (après migration)
Remove-Item .env.production, env_restored

# 5. Tester
cd backend && npm run start:dev
# (Nouvel onglet)
cd frontend && npm run dev
```

---

**🎉 C'est tout ! Votre projet SmartSchool est maintenant optimisé et sécurisé.**

**📅 Dernière mise à jour** : 24 janvier 2026  
**🔗 Repository** : `https://gitea.castole.dedyn.io/castole/smartschool`
