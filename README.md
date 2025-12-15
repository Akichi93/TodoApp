# Projet Todo App

Une application de gestion de tâches complète comprenant un backend robuste avec NestJS et un frontend moderne avec React.

## 🏗 Architecture

Ce projet est composé de deux applications principales et de plusieurs services d'infrastructure :

### Backend (`/todo-app-backend`)

- **Framework** : NestJS
- **Base de données** : PostgreSQL (via Prisma ORM)
- **Cache** : Redis
- **Messagerie** : RabbitMQ (pour les notifications asynchrones)
- **Fonctionnalités** : Authentification, Gestion des tâches, Notifications (Email & In-App)

### Frontend (`/todo-app-frontend`)

- **Framework** : React 18+ (Vite)
- **Gestion d'état** : Redux Toolkit
- **Styles** : TailwindCSS
- **Routage** : React Router

### Infrastructure

- **Docker Compose** : Orchestre les conteneurs pour la BDD, Redis, RabbitMQ, le Backend et le Frontend.

### Schéma d'Architecture Global

```mermaid
graph TD
    User[Utilisateur / Navigateur] -->|HTTP/REST| Frontend[Frontend React]
    Frontend -->|API REST| Backend[Backend NestJS]

    subgraph Services Backend
        Backend -->|Lecture/Ecriture| DB[(PostgreSQL)]
        Backend -->|Cache| Redis[(Redis)]
        Backend -->|Messages| RabbitMQ((RabbitMQ))
    end

    RabbitMQ -->|Consomme| Backend
    Backend -.->|SMTP| Email[Service Email / Ethereal]

    style Frontend fill:#61dafb,stroke:#333,stroke-width:2px
    style Backend fill:#e0234e,stroke:#333,stroke-width:2px,color:#fff
    style DB fill:#336791,stroke:#333,stroke-width:2px,color:#fff
    style Redis fill:#d82c20,stroke:#333,stroke-width:2px,color:#fff
    style RabbitMQ fill:#ff6600,stroke:#333,stroke-width:2px,color:#fff
```

---

## 🚀 Démarrage Rapide (Recommandé : Docker)

Oui, `docker compose` gère **tout** pour vous (Base de données, Message Queue, Backend, Frontend). C'est la méthode la plus simple pour lancer l'application complète.

### Prérequis

- Docker
- Docker Compose

### Lancement

1. Clonez ce dépôt.
2. Créez le fichier de configuration `todo-app-backend/.env` (voir la section Variables d'Environnement ci-dessous).
3. Lancez la commande suivante à la racine du projet :

```bash
docker compose up -d --build
```

4. Accédez à l'application :

   - **Frontend** : [http://localhost:3000](http://localhost:3000)
   - **Backend API** : [http://localhost:4000](http://localhost:4000)
   - **Documentation Swagger** : [http://localhost:4000/api](http://localhost:4000/api) (si configuré)

5. Voir les logs :

```bash
docker compose logs -f
# Ou pour un service spécifique (ex: backend)
docker compose logs -f backend
```

> **Note** : Cette configuration lance l'application en mode "production" (les modifications de code ne sont pas visibles immédiatement, il faut reconstruire l'image).

---

## 🛠 Installation Manuelle (Pour le Développement)

Si vous souhaitez **développer** et modifier le code (avec rechargement automatique / hot-reload), il est préférable de lancer les services manuellement.

### 1. Services d'Infrastructure

Vous avez quand même besoin de la base de données et des files d'attente. Vous pouvez utiliser Docker juste pour ça :

```bash
docker compose up -d db redis rabbitmq
```

### 2. Installation Backend

```bash
cd todo-app-backend
npm install

# Configuration de l'environnement
cp .env.example .env # (ou créez-en un)

# Migration de la base de données
npx prisma generate
npx prisma migrate dev

# Lancer en mode développement (watch mode)
npm run start:dev
```

### 3. Installation Frontend

```bash
cd todo-app-frontend
npm install

# Lancer en mode développement
npm run dev
```

---

## ⚙️ Variables d'Environnement

### Backend (`todo-app-backend/.env`)

Créez un fichier `.env` dans le dossier `todo-app-backend`. Vous pouvez copier l'exemple ci-dessous :

```ini
# Base de données
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"

# Authentification JWT
JWT_SECRET="votre_cle_super_secrete"
JWT_EXPIRATION="15m"
JWT_REFRESH_SECRET="votre_cle_refresh_super_secrete"
JWT_REFRESH_EXPIRATION="7d"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_URL="amqp://guest:guest@localhost:5672"

# SMTP (Notifications Email)
# Optionnel : Utilise Ethereal (Faux SMTP) si non fourni
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=utilisateur
SMTP_PASS=mot_de_passe
EMAIL_FROM=noreply@todoapp.com

# Port de l'application
PORT=4000
```

_> **Important** : Si vous utilisez Docker Compose complet, les noms d'hôtes (`localhost`) sont souvent remplacés automatiquement par les noms des services (`db`, `redis`, `rabbitmq`) grâce aux variables d'environnement définies dans le `docker-compose.yml`._

---

## ✨ Fonctionnalités

- **Authentification** : Inscription, Connexion (JWT + Refresh Token).
- **Gestion des Tâches** : Créer, Lire, Mettre à jour, Supprimer (CRUD).
- **Filtres & Recherche** : Filtrer par statut, priorité ; recherche par titre/description.
- **Notifications** :
  - **In-App** : Alertes temps réel pour les tâches en retard.
  - **Email** : Envoi asynchrone via RabbitMQ (supporte un mode démo sans vrai SMTP).
- **Pagination** : Chargement efficace des listes de tâches.
