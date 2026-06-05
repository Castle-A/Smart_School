# 🏛️ Architecture Avancée & Fonctionnalités Clés

**Auteur** : Expert Architecte Cloud & DevOps  
**Date** : 24 Janvier 2026  
**Objet** : Spécifications techniques pour les modules Paiement, Support, Thèmes et i18n.

---

## 1. 💳 Module Paiement Résilient (Resilient Payment System)

Le système actuel enregistre simplement les paiements en base. Pour gérer les coupures internet et les erreurs, il faut une architecture **"Idempotente"** (qui peut être répétée sans doublons) et **Asynchrone**.

### Architecture Proposée
1.  **Machine à États (State Machine)** :
    *   Un paiement n'est pas juste "créé", il a un cycle de vie : `INITIATED` -> `PENDING_GATEWAY` -> `PROCESSING` -> `SUCCESS` (ou `FAILED`).
2.  **Clés d'Idempotence (Idempotency Keys)** :
    *   Le frontend génère un UUID unique pour chaque tentative de paiement (ex: `transaction_uuid`).
    *   Si la connexion coupe et que l'utilisateur relance, le backend reconnaît cet UUID et ne débite pas deux fois, ou reprend là où ça s'est arrêté.
3.  **Webhooks & Background Jobs** :
    *   Ne jamais faire confiance au frontend pour valider un paiement.
    *   Le Gateway (Stripe, Mobile Money) notifie le backend via un **Webhook**.
    *   Si le Webhook échoue (serveur down), le Gateway réessaie automatiquement.

### Implémentation (Schéma Logique)
```typescript
model Transaction {
  id              String   @id @default(uuid())
  idempotencyKey  String   @unique // Clé unique générée par le frontend
  status          String   // PENDING, SUCCESS, FAILED
  gatewayRef      String?  // ID chez Stripe/Orange Money
  provider        String   // STRIPE, OM, MOMO
  amount          Float
  metadata        Json?    // Context (studentId, schoolId)
  retryCount      Int      @default(0)
  createdAt       DateTime @default(now())
}
```

---

## 2. 🆘 Support Technique & Ticketing

Pour aider les écoles efficacement, il faut passer d'un simple email à un système de **Ticketing Intégré**.

### Architecture Proposée
1.  **Contexte Automatique** :
    *   Quand un directeur ouvre un ticket, le système capture auto : URL actuelle, ID École, Navigateur, Logs d'erreurs récents.
    *   Plus besoin de demander "C'était sur quelle page ?".
2.  **Système de Discussion** :
    *   Type "Chat" asynchrone (comme WhatsApp) plutôt que Email.
    *   Possibilité d'envoyer des captures d'écran.
3.  **Base de Connaissance (FAQ)** :
    *   Suggérer des articles d'aide *avant* la soumission du ticket (IA Search).

### Implémentation (Schéma Logique)
```typescript
model Ticket {
  id        String   @id @default(uuid())
  schoolId  String
  userId    String   // Qui a ouvert
  subject   String
  status    String   // OPEN, CLIENT_REPLY, AGENT_REPLY, RESOLVED
  priority  String   // LOW, MEDIUM, HIGH, CRITICAL
  messages  TicketMessage[]
}

model TicketMessage {
  id        String   @id @default(uuid())
  ticketId  String
  senderId  String   // Peut être le User ou un Agent Support
  content   String
  visiblity String   @default("PUBLIC") // INTERNAL (notes privées support) ou PUBLIC
}
```

---

## 3. 🎨 Thèmes Dynamiques & White-Labeling

Permettre aux écoles de changer les couleurs ou de passer en mode sombre.

### Architecture Proposée
1.  **Variables CSS (CSS Custom Properties)** :
    *   Ne pas hardcoder les couleurs Tailwind (ex: `bg-blue-600`).
    *   Utiliser des variables : `bg-[var(--primary-color)]`.
2.  **Context React `ThemeProvider`** :
    *   Au chargement de l'app, récupérer la config de l'école.
    *   Injecter les variables dans le `:root` du DOM.
3.  **Mode Sombre (Dark Mode)** :
    *   Utiliser la classe `dark` de Tailwind couplée aux variables CSS.

### Implémentation (Exemple CSS)
```css
/* global.css */
:root {
  --primary: 37 99 235; /* RGB pour Tailwind */
  --secondary: 147 51 234;
  --bg-app: 255 255 255;
}

[data-theme="dark"] {
  --bg-app: 15 23 42;
  /* Ajustement des couleurs pour le contraste */
}
```

---

## 4. 🌍 Internationalisation (i18n) Avancée

Gérer les traductions efficacement sans alourdir l'application.

### Architecture Proposée
1.  **Lazy Loading (Chargement à la demande)** :
    *   Ne pas charger TOUTES les langues au démarrage.
    *   Charger `fr.json` par défaut. Si l'utilisateur change en `en`, télécharger `en.json` à ce moment-là (Code verification).
2.  **Contenu Dynamique** :
    *   Les données de la base (ex: Noms de matières, Appréciations) peuvent être traduites via une table `Translation` ou des colonnes JSONB (`name: { fr: "Maths", en: "Math" }`).
3.  **Détection Intelligente** :
    *   Utiliser `Accept-Language` header côté backend pour envoyer les emails/PDFs dans la bonne langue.

### Recommandation Spéciale
*   Utiliser **i18next-http-backend** pour charger les fichiers JSON depuis le dossier `/public` ou un CDN, plutôt que de les compiler dans le JS bundle.

---

## 📋 Résumé des Actions Prioritaires

1.  **Paiement** : Créer l'entité `Transaction` et un endpoint `/webhook/payment`.
2.  **Support** : Créer l'entité `Ticket` et une vue "Centre d'Aide" dans le frontend.
3.  **Design** : Refactoriser `tailwind.config.js` pour utiliser des variables CSS.
4.  **i18n** : Configurer le chargement asynchrone des langues.
