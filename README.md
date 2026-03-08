# AOMVP-Front

Front-end Angular pour le projet AOMVP.

## Fonctionnalités livrées

- Pages d'authentification: connexion et inscription.
- Dashboard avec KPI et visualisation simple.
- Listing des appels d'offres avec filtres (texte, secteur, statut).
- Services Angular connectés par défaut au backend AOMVP via proxy (`/api` -> `http://localhost:8080`).

## Démarrage

```bash
npm install
npm run start
```

> Le front appelle déjà le backend par défaut (`useBackend: true`).
> Vérifiez que le backend AOMVP tourne sur `http://localhost:8080`.

## Connexion avec le repo backend AOMVP

1. Démarrer le backend AOMVP sur le port `8080`.
2. Démarrer ce front avec `npm run start`.
3. Le dev server Angular proxy automatiquement `/api/*` vers `http://localhost:8080/api/*` (fichier `proxy.conf.json`).
