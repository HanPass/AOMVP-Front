# AOMVP-Front

Front-end Angular pour le projet AOMVP.

## Fonctionnalités livrées

- Page d'accueil de présentation (landing page).
- Pages d'authentification: connexion et inscription.
- Dashboard avec KPI et visualisation simple.
- Listing des appels d'offres avec filtres (texte, secteur, statut).
- Préférences utilisateur après connexion (langue, thème, notifications, vue dashboard) avec sauvegarde.
- Services Angular prêts pour connexion au backend AOMVP (`environment.apiUrl`, `useBackend`).

## Démarrage

```bash
npm install
npm run start
```

> Si vous souhaitez activer les appels backend, mettre `useBackend: true` dans `src/environments/environment.ts`.


## API backend attendue pour les préférences

Pour activer les préférences avec `useBackend: true`, prévoir ces endpoints:

- `GET /users/me/preferences`
- `PUT /users/me/preferences`

Payload attendu:

```json
{
  "language": "fr",
  "theme": "light",
  "emailNotifications": true,
  "dashboardDefaultView": "funnel"
}
```
