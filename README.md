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

## Contrat API à vérifier côté backend

Le front envoie toutes ses requêtes vers la base `/api`.

### 1) Authentification

#### Login
- **Route attendue**: `POST /api/auth/login`
- **Payload envoyé**:

```json
{
  "email": "contact@entreprise.ma",
  "password": "secret123"
}
```

- **Réponse attendue**:

```json
{
  "token": "jwt-ou-token"
}
```

#### Inscription (fallback automatique)
Le front essaie plusieurs routes dans cet ordre:
1. `POST /api/auth/register`
2. `POST /api/auth/signup`
3. `POST /api/users/register`
4. `POST /api/users/signup`

Et il essaie plusieurs variantes de payload si la précédente échoue:

**Variante A**
```json
{
  "companyName": "Ma Société",
  "email": "contact@entreprise.ma",
  "password": "secret123",
  "passwordConfirmation": "secret123",
  "confirmPassword": "secret123"
}
```

**Variante B**
```json
{
  "company": "Ma Société",
  "email": "contact@entreprise.ma",
  "password": "secret123",
  "passwordConfirmation": "secret123",
  "confirmPassword": "secret123"
}
```

**Variante C**
```json
{
  "name": "Ma Société",
  "email": "contact@entreprise.ma",
  "password": "secret123",
  "passwordConfirmation": "secret123",
  "confirmPassword": "secret123"
}
```

**Variante D**
```json
{
  "username": "contact@entreprise.ma",
  "fullName": "Ma Société",
  "email": "contact@entreprise.ma",
  "password": "secret123",
  "passwordConfirmation": "secret123",
  "confirmPassword": "secret123"
}
```

> Timeout front sur chaque tentative d'inscription: 10 secondes.

### 2) Appels d'offres

- **Route attendue**: `GET /api/ao`
- **Query params optionnels**: `query`, `sector`, `status`
- **Exemple**: `GET /api/ao?query=it&sector=IT&status=open`

### 3) Préférences utilisateur

- **Lire les préférences**: `GET /api/users/me/preferences`
- **Sauvegarder les préférences**: `PUT /api/users/me/preferences`

Payload de sauvegarde = objet `UserPreferences` envoyé tel quel par le front.

### 4) Header d'auth

Si connecté, le front envoie automatiquement:

```http
Authorization: Bearer <token>
```
