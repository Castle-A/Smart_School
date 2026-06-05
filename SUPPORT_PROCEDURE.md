# 🛡️ Guide de Mise en Route : Système de Support Professionnel

Félicitations ! Le système de support technique de classe enterprise est maintenant installé. Voici comment l'activer et tester ses fonctionnalités.

---

## 🔑 1. Créer votre premier SuperAdmin

Pour des raisons de sécurité, les comptes administrateurs de la plateforme ne peuvent pas être créés via une interface publique. Vous devez utiliser le script sécurisé en ligne de commande.

1. Allez dans le dossier `backend` :
   ```bash
   cd backend
   ```
2. Exécutez la commande de création :
   ```bash
   npm run create:superadmin VOTRE_EMAIL@test.com "MotDePasseFort123!" "Prénom" "Nom"
   ```
   *Note : Si vous ne précisez pas de mot de passe, le défaut est `SmartSupport2026!`.*

---

## 🧪 2. Tester le Flux de Support

Suivez ces étapes pour vérifier l'automatisation et la sécurité du système :

### Étape A : Soumission d'une demande (Côté École)
1. Connectez-vous à l'application principale en tant que **Directeur** ou **Fondateur**.
2. Cliquez sur le bouton **"Support"** situé en bas de la barre latérale.
3. Remplissez le formulaire de ticket (Sujet, Type, Priorité).
4. Cliquez sur **"Envoyer ma demande"**.

### Étape B : Assignation Automatique (Moteur d'Automation)
1. Le système calculera instantanément quel agent de support est le plus disponible.
2. Le ticket passera du statut `OPEN` à `ASSIGNED`.
3. L'agent recevra une **notification interne** en temps réel.

### Étape C : Prise en charge (Cockpit Support)
1. Accédez au cockpit de support (interface dédiée aux agents).
2. Sélectionnez le ticket nouvellement créé.
3. **Sécurité Drastique** : Notez que les informations sensibles (Emails, Téléphones) sont **masquées** par défaut.
4. Pour accéder aux données de l'école (si nécessaire), cliquez sur **"Demander l'accès"** dans la barre latérale droite.
5. Vous aurez alors un accès éphémère de **2 heures** pour résoudre l'incident.

### Étape D : Audit
1. En tant que SuperAdmin, allez dans la section **"Journaux d'Audit"**.
2. Vérifiez que chaque action (création de ticket, consultation, demande d'accès) a été enregistrée de manière immuable.

---

## 🛠️ Maintenance & Sécurité
- **Rotation des accès** : Les accès temporaires sont révoqués automatiquement par le système.
- **Ajout de techniciens** : Pour ajouter d'autres techniciens, vous pouvez utiliser le même script `create:superadmin` ou passer par l'interface SuperAdmin de gestion des comptes.

---
*Système propulsé par Antigravity - Sécurité et Automation SaaS.*

## npm run create:superadmin test@test.com Password123! Leroi Admin
## npm run create:superadmin admin@smartschool.io SmartSupport2026! Admin Leroi
## npm run create:superadmin admin@smartschool.io SmartSupport2026! Admin Leroi

## Email : admin@smartschool.io
## Mot de passe : SmartSupport2026!