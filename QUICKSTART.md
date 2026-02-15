# Démarrage rapide - Athletiq

## 🚀 Installation

### 1. Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos informations
# DATABASE_URL=postgresql://user:password@localhost:5432/athletiq
# JWT_SECRET=votre_secret_jwt
# PORT=3001

# Lancer le serveur backend
npm run dev
```

Le backend sera accessible sur `http://localhost:3001`

### 2. Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
# NUXT_PUBLIC_API_URL=http://localhost:3001

# Lancer le serveur de développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`

## 🎨 Design System

Le projet utilise un design moderne minimaliste avec :

- **Palette de couleurs** :
  - Tons beiges/sable (primary) : du #f5f1ed au #b8a48f
  - Dégradés chaleureux pour les accents
  - Glassmorphism avec backdrop-blur
  - Effets de profondeur et ombres subtiles

- **Classes CSS principales** :
  - `.card-glass` : Cartes avec effet glassmorphism
  - `.btn-primary` : Bouton principal avec gradient beige
  - `.btn-outline` : Bouton avec bordure
  - `.btn-glass` : Bouton avec effet verre
  - `.text-gradient-primary` : Texte avec gradient
  - `.nav-blur` : Navigation avec backdrop blur

- **Animations** :
  - `.fade-in`, `.slide-up`, `.float` : Animations d'entrée
  - `.pulse-soft` : Animation de pulsation douce
  - `.icon-container` : Animations d'icônes au hover

## 📡 Routes API

### Authentification
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/login` - Connexion utilisateur

### Workouts
- `GET /api/workouts` - Liste des workouts (templates + historique)
- `GET /api/workouts/:id` - Détail d'un workout
- `POST /api/workouts` - Créer un workout/template
- `PUT /api/workouts/:id` - Modifier un workout
- `DELETE /api/workouts/:id` - Supprimer un workout
- `POST /api/workouts/:id/start` - Démarrer un workout
- `POST /api/workouts/:id/complete` - Terminer un workout

### Exercices
- `GET /api/exercises/library` - Bibliothèque d'exercices
- `POST /api/workouts/:workoutId/exercises` - Ajouter un exercice au workout
- `PUT /api/exercises/:id` - Modifier un exercice
- `DELETE /api/exercises/:id` - Supprimer un exercice
- `PUT /api/exercises/:id/order` - Réorganiser les exercices
- `GET /api/exercises/:exerciseLibraryId/history` - Historique d'un exercice

### Séries (Sets)
- `POST /api/exercises/:exerciseId/sets` - Enregistrer une série
- `PUT /api/sets/:id` - Modifier une série
- `DELETE /api/sets/:id` - Supprimer une série

### Users
- `GET /api/users/me` - Profil utilisateur

## ✨ Fonctionnalités implémentées

### ✅ Authentification
- Inscription avec email/mot de passe
- Connexion et gestion de session
- Protection des routes avec middleware
- Store Pinia pour la gestion d'état

### ✅ Gestion des Workouts
- **Builder** : Créateur de workouts avec drag & drop
- **Templates** : Workouts réutilisables
- **Live Session** : Exécution en temps réel avec timer
- **Historique** : Consultation des entraînements passés

### ✅ Exercices
- Bibliothèque d'exercices pré-remplie
- Ajout d'exercices aux workouts
- Configuration par exercice :
  - Séries/répétitions cibles
  - Poids cible
  - Temps de repos personnalisé
  - Séries personnalisées (reps/poids différents par série)

### ✅ Suivi en temps réel
- Timer de repos automatique
- Progression visuelle des séries
- Enregistrement des performances (reps, poids)
- Pré-remplissage intelligent :
  1. Historique (priorité maximale)
  2. Séries personnalisées
  3. Valeurs par défaut

### ✅ Dashboard
- Vue d'ensemble des entraînements récents
- Accès rapide aux actions principales
- Statistiques de base

## 🔧 Technologies utilisées

- **Frontend** : Nuxt 3, Vue 3 Composition API, TypeScript, Tailwind CSS, Pinia
- **Backend** : Node.js, Express, TypeScript, TypeORM
- **Database** : PostgreSQL
- **Authentification** : JWT + bcrypt

## 📋 Prochaines fonctionnalités

### À implémenter
1. **Statistiques** 📊
   - Graphiques de progression
   - Évolution par exercice
   - Records personnels
   - Volume total par entraînement

2. **Photos/Timelapse** 📸
   - Upload de photos de progression
   - Comparaison avant/après
   - Timelapse automatique

3. **Profil utilisateur** 👤
   - Modification des infos personnelles
   - Définition d'objectifs
   - Paramètres de l'application

4. **Améliorations workout** 💪
   - Timer visuel/sonore
   - Notes vocales
   - Super-sets / drop-sets
   - Export/import de workouts

5. **Bibliothèque d'exercices** 📚
   - Exercices personnalisés
   - Instructions et vidéos
   - Recherche et filtres avancés

## 📱 Structure du projet

```
Athletiq/
├── backend/
│   ├── src/
│   │   ├── entities/        # Entités TypeORM (User, Workout, Exercise, etc.)
│   │   ├── routes/          # Routes API Express
│   │   ├── middleware/      # Middleware d'authentification
│   │   └── index.ts         # Point d'entrée
│   └── package.json
│
├── frontend/
│   ├── pages/               # Pages Nuxt (auto-routing)
│   │   ├── index.vue        # Landing page
│   │   ├── dashboard.vue    # Dashboard principal
│   │   ├── login.vue        # Connexion
│   │   ├── register.vue     # Inscription
│   │   └── workouts/
│   │       ├── index.vue    # Liste des workouts
│   │       ├── start.vue    # Sélection de workout
│   │       ├── builder.vue  # Créateur de workout
│   │       └── [id]/
│   │           ├── edit.vue # Édition de workout
│   │           └── live.vue # Session d'entraînement en direct
│   ├── stores/              # Stores Pinia (auth, workout)
│   ├── types/               # Types TypeScript
│   ├── middleware/          # Middleware de routing
│   └── assets/css/          # Styles globaux
│
└── QUICKSTART.md
```

## 🐛 Débogage

### Backend
```bash
cd backend
npm run dev  # Mode développement avec hot reload
```

Les logs du backend affichent :
- Les requêtes SQL (requêtes TypeORM)
- Les erreurs de validation
- Les informations de débogage

### Frontend
```bash
cd frontend
npm run dev  # Mode développement avec hot reload
```

Console navigateur :
- Logs de pré-remplissage des séries (🔄, ✅, ⚠️)
- Erreurs de fetch API
- État des stores Pinia

## 📝 Notes

- Le projet utilise TypeORM avec PostgreSQL (pas Prisma)
- Les workouts peuvent être des **templates** (réutilisables) ou des **instances** (sessions uniques)
- L'historique des exercices permet le pré-remplissage automatique des performances
- Les séries personnalisées permettent des variations (pyramide, drop-sets, etc.)
