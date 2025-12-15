# Todo App Frontend

Une application moderne de gestion de tâches (Todo List) construite avec React, TypeScript, Redux Toolkit, et Tailwind CSS.

## 🚀 Fonctionnalités

### Interface utilisateur moderne
- ✅ Liste des tâches avec pagination
- ✅ Formulaire de création/édition de tâches
- ✅ Filtres (toutes, actives, complétées) et recherche
- ✅ Design responsive et moderne

### Gestion des tâches
- ✅ CRUD complet (Créer, Lire, Modifier, Supprimer)
- ✅ Priorités (Basse, Moyenne, Haute)
- ✅ Dates d'échéance
- ✅ Statut (Active/Complétée)
- ✅ Pagination

### Authentification et utilisateurs
- ✅ Système d'authentification (Login/Register)
- ✅ Gestion des utilisateurs
- ✅ Affectation des tâches aux utilisateurs
- ✅ Profils utilisateurs

### Notifications
- ✅ Notifications in-app
- ✅ Notifications par email (simulées)
- ✅ Compteur de notifications non lues

### Tests
- ✅ Tests unitaires des composants
- ✅ Tests d'intégration
- ✅ Tests E2E avec Playwright

## 📁 Architecture

```
src/
├── components/      # Composants réutilisables (Button, Input, Modal, etc.)
├── db/             # Simulation de données (mockData)
├── Layout/         # Header, Navbar, Breadcrumbs, Footer
├── Pages/          # Pages de l'application (Login, Register, Dashboard, TodoList, Profile)
├── Routers/        # Configuration des routes
├── store/          # Redux store et slices
├── services/       # Services API (authService, todoService, etc.)
└── utils/          # Constants, helpers et hooks
```

## 🛠️ Technologies utilisées

- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Redux Toolkit** - Gestion d'état
- **React Router** - Routage
- **Tailwind CSS** - Styling
- **Vitest** - Tests unitaires
- **Playwright** - Tests E2E
- **Vite** - Build tool

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build
npm run preview
```

## 🧪 Tests

```bash
# Lancer les tests unitaires
npm run test

# Lancer les tests avec interface UI
npm run test:ui

# Lancer les tests avec couverture
npm run test:coverage

# Lancer les tests E2E
npm run test:e2e

# Lancer les tests E2E avec interface UI
npm run test:e2e:ui
```

## 👤 Comptes de test

L'application inclut des utilisateurs de test :

- **Admin**: `admin@example.com` / `admin123`
- **John Doe**: `john@example.com` / `john123`
- **Jane Smith**: `jane@example.com` / `jane123`

## 🎯 Routes

- `/` - Redirige vers le tableau de bord
- `/login` - Page de connexion
- `/register` - Page d'inscription
- `/dashboard` - Tableau de bord
- `/todos` - Liste des tâches
- `/profile` - Profil et notifications

## 📝 Fonctionnalités détaillées

### Gestion des tâches
- Créer une nouvelle tâche avec titre, description, priorité, date d'échéance
- Assigner une tâche à un utilisateur
- Modifier une tâche existante
- Supprimer une tâche
- Marquer une tâche comme complétée
- Filtrer par statut (toutes, actives, complétées)
- Filtrer par priorité
- Rechercher dans les tâches
- Pagination des résultats

### Notifications
- Notifications in-app lors de l'assignation d'une tâche
- Notifications par email (simulées dans la console)
- Marquer les notifications comme lues
- Compteur de notifications non lues

### Dashboard
- Statistiques des tâches (total, actives, complétées, priorité haute)
- Liste des tâches récentes
- Liste des notifications récentes

## 🔧 Configuration

Les données sont stockées dans le localStorage pour la simulation. Dans un environnement de production, vous devriez connecter l'application à une API backend.

### API Base URL (dev)

Par défaut l'application frontend utilise `http://localhost:4000` comme backend (utilisé par Docker Compose). Vous pouvez overrider l'URL de l'API en définissant la variable d'environnement `VITE_API_BASE_URL` avant de lancer le serveur de développement :

```bash
export VITE_API_BASE_URL="http://localhost:4000"
npm run dev
```

## 📄 Licence

Ce projet est sous licence MIT.
