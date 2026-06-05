# 🚨 Rapport des Erreurs et Problèmes Détectés - SmartSchool v2.0

Ce rapport répertorie l'ensemble des erreurs de compilation, failles de sécurité, stubs (fonctionnalités non implémentées), et anomalies de configuration identifiés lors de l'audit approfondi du projet.

---

## 🛑 1. Erreur de Compilation Bloquante (Build Failure)

### 🔴 Portail Support (`frontend-support`) - Échec du Build de Production
Le build de production du portail support (`npm run build`) **échoue systématiquement** avec le code de sortie `1` en raison de la configuration stricte de TypeScript (`noUnusedLocals`).

*   **Fichier concerné** : [ManageTeamPage.tsx](file:///c:/Users/Leroi/.gemini/antigravity/playground/shining-universe/frontend-support/src/pages/ManageTeamPage.tsx#L3)
*   **Erreur TS** :
    ```text
    src/pages/ManageTeamPage.tsx(3,26): error TS6133: 'Phone' is declared but its value is never read.
    src/pages/ManageTeamPage.tsx(3,54): error TS6133: 'User' is declared but its value is never read.
    ```
*   **Impact** : Impossible de générer les assets statiques de production pour le portail support. Le conteneur Docker correspondant ne peut pas être déployé dans cet état.
*   **Correction recommandée** : Retirer `Phone` et `User` de l'import destructuré de `lucide-react` à la ligne 3 du fichier.

---

## 🔒 2. Failles de Sécurité Majeures

### 🔴 Absence de Vérification de Signature HMAC (Webhooks)
L'endpoint public recevant les webhooks des fournisseurs de paiement (Stripe, Orange Money, etc.) ne valide pas l'authenticité de la requête.

*   **Fichier concerné** : [webhook.controller.ts](file:///c:/Users/Leroi/.gemini/antigravity/playground/shining-universe/backend/src/interface/finance/webhook.controller.ts#L26)
*   **Code critique** :
    ```typescript
    //TODO: Vérification de la signature (HMAC) ici pour sécuriser l'endpoint
    // if (!verifySignature(payload, signature)) throw new UnauthorizedException();
    ```
*   **Impact** : **CRITIQUE**. N'importe quel attaquant peut forger une fausse requête HTTP POST simulant un paiement réussi (ex: Stripe `payment_intent.succeeded`) et l'envoyer au serveur. L'événement sera poussé dans Redis et traité par le backend, validant ainsi des transactions financières sans transaction bancaire réelle.
*   **Correction recommandée** : Implémenter une fonction de vérification cryptographique (SHA256 HMAC) utilisant la clé `PAYMENT_SECRET` pour s'assurer que la signature reçue dans l'en-tête correspond bien au corps de la requête.

---

## 🧩 3. Anomalies de Code & Doublons

### 🟡 Double Définition de Route Frontend
Dans l'application React principale, la route pour le tableau de bord des comptables (`accountant`) est déclarée deux fois de suite.

*   **Fichier concerné** : [App.tsx](file:///c:/Users/Leroi/.gemini/antigravity/playground/shining-universe/frontend/src/App.tsx#L61-L62)
*   **Code critique** :
    ```typescript
    61:               <Route path="accountant" element={<AccountantDashboard />} />
    62:               <Route path="accountant" element={<AccountantDashboard />} />
    ```
*   **Impact** : Léger overhead d'analyse des routes par React Router, code redondant nuisant à la lisibilité.
*   **Correction recommandée** : Supprimer la ligne 62.

---

## ⚙️ 4. Fonctionnalités non implémentées (Stubs / TODOs)

Plusieurs briques logiques essentielles ont été documentées comme "à faire" et sont inopérantes :

1.  **Envoi Réel de SMS (Twilio SMS Stub)** :
    *   **Fichier** : [twilio-sms.provider.ts](file:///c:/Users/Leroi/.gemini/antigravity/playground/shining-universe/backend/src/infrastructure/sms/providers/twilio-sms.provider.ts#L17)
    *   Le module Twilio est un simple stub qui enregistre les requêtes de SMS dans la console (`logger.log`). Aucun SMS n'est réellement envoyé.
2.  **Logique d'Escalade des Tickets Support** :
    *   **Fichier** : [ticket-assignment.service.ts](file:///c:/Users/Leroi/.gemini/antigravity/playground/shining-universe/backend/src/application/support/ticket-assignment.service.ts#L93)
    *   La méthode `escalateTicket()` est vide (`// TODO: Implement escalation levels logic`). Les techniciens de niveau N1 ne peuvent pas escalader les requêtes vers le niveau supérieur ou les administrateurs de la plateforme.
3.  **Envoi de Mots de Passe Temporaires aux Parents** :
    *   **Fichier** : [parents.service.ts](file:///c:/Users/Leroi/.gemini/antigravity/playground/shining-universe/backend/src/application/parents/parents.service.ts#L43)
    *   Lors de la création d'un compte parent, l'email d'envoi du mot de passe temporaire n'est pas programmé (`// TODO: Envoyer email avec tempPassword`).
4.  **Vérifications Métier de Fin d'Année Académique** :
    *   **Fichier** : [academic-years.service.ts](file:///c:/Users/Leroi/.gemini/antigravity/playground/shining-universe/backend/src/application/academic-years/academic-years.service.ts#L311-L312)
    *   Pendant le rollover (transition d'année), la vérification des notes manquantes et de la génération des bulletins est court-circuitée (`const noOutstandingGrades = true;`, `const yearEndReportsGenerated = true;`).

---

## 📦 5. Problèmes de Performance et Configuration

### 🟡 Volume Excessive du Bundle Frontend (Vite)
Le build du frontend principal a réussi mais remonte une alerte critique sur les performances de chargement initial.

*   **Rapport de build** :
    ```text
    dist/assets/index-CUt4c9hg.js   1,744.53 kB │ gzip: 471.56 kB
    (!) Some chunks are larger than 500 kB after minification.
    ```
*   **Impact** : Chargement lent de l'application sur les réseaux mobiles ou à faible bande passante (courant en contexte d'utilisation scolaire).
*   **Correction recommandée** : Configurer `manualChunks` dans `vite.config.ts` pour extraire les bibliothèques lourdes (`@fullcalendar`, `chart.js`, `framer-motion`) dans des chunks séparés.

### 🟡 Fichiers d'Environnement Non Unifiés
Bien qu'un fichier `.env` global existe à la racine, il subsiste un doublon dans le backend.

*   **Fichiers** : `.env` (racine) et `backend/.env`.
*   **Impact** : Risque de désynchronisation de variables de configuration. Par exemple, la variable `FRONTEND_URL` contient `http://localhost:3004` (port du portail support) à la racine mais ne la contient pas dans `backend/.env`.
*   **Correction recommandée** : Supprimer le fichier `backend/.env` et configurer Docker / NestJS pour lire uniquement le fichier `.env` de la racine.

---

## 📊 Plan d'Action Recommandé

| Priorité | Problème | Fichier | Type d'Action |
| :---: | :--- | :--- | :--- |
| **CRITIQUE** | Faille Webhook (Pas de HMAC) | `webhook.controller.ts` | Sécurité Backend |
| **HAUTE** | Échec build portail support | `ManageTeamPage.tsx` | Correction TS (Retrait d'imports) |
| **HAUTE** | Double `.env` désynchronisé | `backend/.env` | DevOps / Configuration |
| **MOYENNE** | Double Route comptable | `App.tsx` | Correction React |
| **MOYENNE** | Alertes Bundle Size | `vite.config.ts` | Performance Frontend |
| **MOYENNE** | Stubs Twilio et Escalades | Divers modules | Implémentation fonctionnelle |
