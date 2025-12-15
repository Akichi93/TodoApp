# Todo App Backend

Backend API REST complet pour la gestion des tâches avec NestJS, Prisma, Redis et PostgreSQL.

## Fonctionnalités

- ✅ API REST complète avec CRUD pour les tâches
- ✅ Authentification JWT (access token + refresh token)
- ✅ Filtrage et pagination des tâches
- ✅ Validation des données avec class-validator
- ✅ Cache Redis pour les tâches fréquemment consultées
- ✅ Notifications automatiques pour les tâches avec échéances dépassées
- ✅ Tests unitaires et d'intégration
- ✅ Documentation Swagger

## Structure du Projet

```
src/
├── auth/                    # Module d'authentification
│   ├── dto/                # DTOs pour l'authentification
│   ├── strategies/         # Stratégies Passport (JWT, Local)
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── tasks/                   # Module des tâches
│   ├── dto/                # DTOs pour les tâches
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   └── tasks.module.ts
├── common/                  # Utilitaires communs
│   ├── constants/          # Constantes
│   ├── decorators/         # Décorateurs personnalisés
│   ├── filters/            # Filtres d'exception
│   ├── guards/             # Guards d'authentification
│   ├── interceptors/       # Intercepteurs
│   └── utils/              # Utilitaires
├── prisma/                  # Service Prisma
├── redis/                   # Service Redis
├── notifications/           # Service de notifications
└── scheduler/               # Service de planification (cron jobs)
```

## Prérequis

- Node.js 18+
- PostgreSQL (installé et en cours d'exécution)
- Redis (installé et en cours d'exécution)

## Installation

1. Cloner le projet

2. Installer les dépendances:
```bash
npm install
```

3. Configurer les variables d'environnement:
```bash
cp .env.example .env
```

Éditer le fichier `.env` avec vos configurations.

4. Générer le client Prisma:
```bash
npx prisma generate
```

5. Exécuter les migrations:
```bash
npx prisma migrate dev
```

## Démarrage

### 1. S'assurer que les services sont démarrés

Avant de démarrer l'application, assurez-vous que PostgreSQL et Redis sont en cours d'exécution sur votre machine.

**PostgreSQL:**
```bash
# Sur macOS avec Homebrew
brew services start postgresql@15

# Sur Linux
sudo systemctl start postgresql

# Ou démarrer manuellement
postgres -D /usr/local/var/postgres
```

**Redis:**
```bash
# Sur macOS avec Homebrew
brew services start redis

# Sur Linux
sudo systemctl start redis

# Ou démarrer manuellement
redis-server
```

### 2. Démarrer l'application

```bash
npm run start:dev
```

L'API sera disponible sur `http://localhost:3000`  
La documentation Swagger sera disponible sur `http://localhost:3000/api`

## Docker 🐳

Construire et démarrer les services (Postgres + backend) avec Docker Compose :

```bash
cd todo-app-backend
docker compose build
docker compose up
```

Le backend sera accessible sur http://localhost:4000/ et Swagger sur http://localhost:4000/api

### Single-container frontend + backend

Ce dépôt peut construire **une seule image** contenant à la fois le **backend** (Nest) et le **frontend** (Vite). Le Dockerfile du backend prend en charge la compilation du frontend (`todo-app-frontend`) et copie le build statique dans `public/` pour être servi par Nest.

Pour démarrer tout en une seule commande:

```bash
cd todo-app-backend
docker compose build
docker compose up -d
```

Le frontend sera servi par défaut à la racine `http://localhost:4000/` et l'API disponible sur les mêmes hôtes (ex: `http://localhost:4000/auth`, `http://localhost:4000/api`).



## Variables d'environnement

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/todoapp"

# JWT
JWT_ACCESS_SECRET=your-access-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Application
PORT=3000
NODE_ENV=development
```

## Endpoints API

### Authentification

- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `POST /auth/refresh` - Rafraîchir le token
- `POST /auth/logout` - Déconnexion

### Tâches

- `GET /tasks` - Liste des tâches (avec pagination et filtres)
- `GET /tasks/:id` - Détails d'une tâche
- `POST /tasks` - Créer une tâche
- `PATCH /tasks/:id` - Modifier une tâche
- `DELETE /tasks/:id` - Supprimer une tâche

### Filtres disponibles pour GET /tasks

- `page` - Numéro de page (défaut: 1)
- `limit` - Nombre d'éléments par page (défaut: 10, max: 100)
- `completed` - Filtrer par statut (true/false)
- `priority` - Filtrer par priorité (low/medium/high)
- `dueDateFrom` - Date de début pour l'échéance
- `dueDateTo` - Date de fin pour l'échéance
- `search` - Recherche dans le titre et la description

## Tests

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:cov

# Tests d'intégration
npm run test:e2e
```

## Scripts disponibles

- `npm run build` - Compiler le projet
- `npm run start` - Démarrer en mode production
- `npm run start:dev` - Démarrer en mode développement
- `npm run start:debug` - Démarrer en mode debug
- `npm run lint` - Linter le code
- `npm run format` - Formater le code avec Prettier

## Technologies utilisées

- **NestJS** - Framework Node.js
- **Prisma** - ORM
- **PostgreSQL** - Base de données
- **Redis** - Cache
- **JWT** - Authentification
- **class-validator** - Validation
- **Swagger** - Documentation API
- **Jest** - Tests

## Architecture

### Authentification

L'authentification utilise JWT avec deux types de tokens:
- **Access Token**: Durée de vie courte (15 minutes)
- **Refresh Token**: Durée de vie plus longue (7 jours)

### Cache Redis

Les tâches fréquemment consultées sont mises en cache avec invalidation intelligente:
- Cache des tâches individuelles (TTL: 1 heure)
- Cache des listes de tâches avec filtres (TTL: 5 minutes)
- Invalidation automatique lors des mises à jour

### Notifications

Un scheduler vérifie toutes les heures les tâches avec échéances dépassées et envoie directement les notifications.

## License

MIT
