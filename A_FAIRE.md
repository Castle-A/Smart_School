# Fonctionnalités en Attente

## Phase 3 : Distribution des Bulletins & Conformité
> **Statut** : EN ATTENTE (Spécifications Gouvernementales requises)

Cette phase est mise en pause jusqu'à réception des directives officielles pour le format et la distribution des bulletins.

### À Faire
- [ ] **Design du Bulletin** :
    - Création du modèle HTML (`bulletin.template.ts`) conforme aux normes.
    - Validation des mentions obligatoires.
- [ ] **Génération & Stockage** :
    - Intégration `PdfService` pour conversion HTML -> PDF.
    - Stockage sécurisé sur R2/S3 via `StorageService`.
- [ ] **Distribution** :
    - Envoi par Email aux parents.
    - Notification SMS de disponibilité.

## Phase 7a : Portail Parents (Mobile First)
> **Statut** : PLANIFIÉ (En attente de démarrage)

Interface dédiée aux parents pour suivre la scolarité de leurs enfants.

### Architecture Frontend
- [ ] Créer `ParentLayout` (Bottom Navigation, Header Minimaliste).
- [ ] Créer `SocketProvider` pour la réception des notifications temps réel.

### Pages & Fonctionnalités
- [ ] **Dashboard (`/mobile/overview`)** :
    - Résumé : Nombre d'enfants, Prochains paiements, Notifications non lues.
- [ ] **Détails Enfant (`/mobile/children/:id`)** :
    - Onglet **Journal** : Emploi du temps du jour.
    - Onglet **Scolarité** : Notes et Bulletins.
    - Onglet **Vie Scolaire** : Absences et incidents.
- [ ] **Login & Redirection** :
    - Redirection automatique vers `/parent/dashboard` si rôle `PARENT`.

## Phase 7b : Dashboard Enseignant (Offline-First)
> **Statut** : PLANIFIÉ (Détails techniques validés)

Espace de travail numérique optimisé pour tablettes et zones à faible connectivité.

### Architecture PWA
- [ ] **Configuration Vite PWA** : Manifest, Service Workers.
- [ ] **Stockage Local** : Utilitaire `OfflineStorage` (IndexedDB) pour persister les données sans réseau.
- [ ] **Sync Manager** : Système de synchronisation en background dès le retour du réseau.

### Modules "Focus"
- [ ] **Appel (Attendance)** : Interface type "Tinder" (Swipe) pour marquer rapidement les absences.
- [ ] **Notes (Grades)** : Grille de saisie type Excel, optimisée tactile (clavier numérique).
- [ ] **Cahier de Texte** : Éditeur simplifié pour les devoirs.
