# Backend — Smart_School

Dossier `backend/` : projet NestJS (TypeScript).

Commandes principales (depuis `backend`)

```bash
# installer les dépendances
npm ci

# lancer en dev (avec watch)
npm run start:dev

# build pour production
npm run build

# tests
npm run test
```

Remarques

- Le code source TypeScript se trouve dans `backend/src`.
- Les artefacts compilés (`dist/`) sont générés lors du build et doivent être ignorés dans Git.
- Prisma est configuré dans `backend/prisma` (migrations + schema).

Si tu veux que je configure des scripts supplémentaires (ex. `migrate`, `seed`, `docker`), je peux les ajouter.
