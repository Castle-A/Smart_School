# 🚀 À FAIRE - Configuration des Notifications

Ce fichier récapitule les étapes nécessaires pour activer pleinement le système de notifications multi-canaux (Dashboard, Email, SMS).

## 1. Configuration des Serveurs (.env)
Ces variables doivent être renseignées dans votre fichier `.env` à la racine du dossier `backend`.

### 📧 Email (SMTP)
```env
# Configuration SMTP
MAIL_HOST=votre_serveur_smtp
MAIL_PORT=587
MAIL_USER=votre_utilisateur
MAIL_PASS=votre_mot_de_passe
MAIL_FROM="SmartSchool <noreply@smartschool.com>"
```

### 📱 SMS (Twilio ou autre)
```env
# Configuration SMS
SMS_PROVIDER=TWILIO # ou MOCK pour les tests
TWILIO_ACCOUNT_SID=votre_sid
TWILIO_AUTH_TOKEN=votre_token
TWILIO_FROM=+123456789
```

---

## 2. Validation des Canevas de Notification
Veuillez valider ou modifier les modèles de messages suivants avec le client :

- [ ] **Finances** : Alerte sur la certification comptable globale.
- [ ] **Cycles** : Alerte spécifique aux directeurs de cycle (Maternelle/Primaire ou Collège/Lycée).
- [ ] **Pédagogie** : Alerte sur les décisions de conseil manquantes (pour le Censeur).

> [!NOTE]
> Les détails des modèles de messages sont consultables dans l'artéfact `notification_templates.md`.

---

## 3. Tâches de Test
- [ ] Faire un envoi d'email de test.
- [ ] Faire un envoi de SMS de test.
- [ ] Vérifier la réception des notifications sur le dashboard admin.

---

## 4. Implémentation Technique (À faire par le développeur)

Ces tâches nécessitent une intervention sur le code source (Backend).

### Dépendances
- [ ] Installer `nodemailer` et `@types/nodemailer`.

### Infrastructure Email
- [ ] Créer `SmtpEmailProvider` implémentant `IEmailProvider`.
- [ ] Configurer `nodemailer` pour utiliser les variables `SMTP_*` définies dans `.env`.

### Refactoring
- [ ] Modifier `ExternalCommunicationModule` pour utiliser un `useFactory`.
- [ ] Permettre le basculement dynamique entre 'CONSOLE' et 'SMTP' via la variable `EMAIL_PROVIDER`.
