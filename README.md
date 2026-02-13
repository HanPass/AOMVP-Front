# AOMVP-Front

Front-end Angular pour le projet AOMVP.

## Fonctionnalités livrées

- Page d'accueil de présentation (landing page).
- Pages d'authentification: connexion et inscription.
- Dashboard avec KPI et visualisation simple.
- Listing des appels d'offres avec filtres (texte, secteur, statut).
- Services Angular prêts pour connexion au backend AOMVP (`environment.apiUrl`, `useBackend`).

## Démarrage

```bash
npm install
npm run start
```

> Si vous souhaitez activer les appels backend, mettre `useBackend: true` dans `src/environments/environment.ts`.
