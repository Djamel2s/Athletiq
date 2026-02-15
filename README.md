# Athletiq - Suivi intelligent d'entraînements de musculation

> Transformez chaque entraînement en données mesurables pour progresser plus vite.

Athletiq est une application web et mobile dédiée au suivi précis des performances en musculation, l'analyse de la progression et l'optimisation de la prise de masse grâce à des données claires et exploitables.

---

## Objectifs du projet

- Permettre un suivi précis des entraînements
- Analyser l'évolution des charges et performances
- Aider à la prise de masse ou à la perte de poids
- Visualiser les progrès avec des statistiques claires
- Optimiser la progression grâce à l'analyse des données
- Suivre visuellement sa transformation physique dans le temps

---

## Fonctionnalités principales

### 1. Création et gestion des entraînements
- Création de séances personnalisées
- Ajout d'exercices (développé couché, squat, curl, etc.)
- Nombre de séries et répétitions par exercice
- Temps de repos configurable
- Duplication de séances pour gagner du temps

### 2. Suivi des performances
Pour chaque exercice :
- Poids utilisé
- Nombre de répétitions
- Nombre de séries
- RPE (niveau de difficulté ressenti)
- Notes personnelles

L'application enregistre automatiquement l'historique et permet de :
- Voir son record personnel (PR)
- Comparer avec les séances précédentes
- Visualiser l'évolution des charges

### 3. Analyse intelligente des performances
- Graphiques d'évolution des charges
- Calcul automatique du volume total (séries × reps × poids)
- Détection de stagnation
- Suggestions d'augmentation progressive des charges
- Estimation du 1RM (charge maximale théorique)

### 4. Suivi physique et poids corporel
- Enregistrement du poids corporel
- Évolution graphique du poids
- Corrélation entre progression musculaire et poids
- Calcul automatique de l'IMC
- Suivi des mensurations (bras, cuisses, tour de taille…)

### 5. Photos de progression et timelapse
**Fonctionnalité unique de motivation :**
- Prendre une ou plusieurs photos après chaque entraînement
- Définir une photo principale du jour
- Galerie chronologique de toutes vos photos
- **Mode Timelapse** : défilement automatique des photos comme une vidéo rapide
- Voir votre transformation physique sur n'importe quelle période
- Comparaison avant/après personnalisable

### 6. Tableau de bord intelligent
Un dashboard central qui affiche :
- Progression hebdomadaire
- Volume d'entraînement total
- Exercices les plus performants
- Objectifs atteints
- Recommandations personnalisées

### 7. Objectifs personnalisés
- Objectif prise de masse
- Objectif force
- Objectif recomposition corporelle
- Objectif perte de poids

L'application adapte les statistiques affichées selon l'objectif choisi.

### 8. Compte utilisateur et synchronisation
- Création de compte
- Connexion sécurisée
- Synchronisation cloud
- Sauvegarde automatique
- Utilisation sur mobile et web

---

## Stack technique

### **Frontend**

| Technologie | Usage |
|-------------|-------|
| **Nuxt 3** | Framework Vue.js avec SSR/SSG |
| **Vue 3** | Framework JavaScript (Composition API) |
| **TypeScript** | Typage statique |
| **Pinia** | Gestion d'état global |
| **Vuetify 3** | Composants UI Material Design |
| **Chart.js + vue-chartjs** | Graphiques de progression |
| **Vite** | Build tool ultra-rapide |
| **Capacitor** | Wrapper natif pour app mobile (iOS/Android) |

### **Backend**

| Technologie | Usage |
|-------------|-------|
| **Node.js v20+** | Runtime JavaScript |
| **Express.js** | Framework web minimaliste |
| **TypeScript** | Typage statique |
| **Prisma** | ORM type-safe pour PostgreSQL |
| **Passport.js** | Authentification (JWT, OAuth) |
| **Zod** | Validation de données |
| **Multer** | Upload de fichiers |
| **Cloudinary** | Stockage et optimisation d'images |

### **Base de données**

| Technologie | Usage |
|-------------|-------|
| **PostgreSQL** | Base de données relationnelle |
| **Prisma** | ORM et migrations |
| **Redis (Upstash)** | Cache et sessions |

### **Hébergement**

| Service | Usage |
|---------|-------|
| **Vercel** | Hébergement frontend (Nuxt) |
| **Railway** | Hébergement backend + PostgreSQL |
| **Cloudinary** | CDN pour images |
| **Upstash** | Redis serverless |

### **DevOps**

- **Docker** (containerisation backend)
- **GitHub Actions** (CI/CD)
- **ESLint + Prettier** (qualité du code)
- **Sentry** (monitoring des erreurs)
- **Posthog** (analytics utilisateur)

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND                            │
│  ┌────────────────┐              ┌─────────────────┐   │
│  │   Nuxt 3 Web   │              │  Capacitor App  │   │
│  │   (Vercel)     │              │  (iOS/Android)  │   │
│  └────────┬───────┘              └────────┬────────┘   │
│           │                               │             │
│           └───────────────┬───────────────┘             │
│                           │                             │
└───────────────────────────┼─────────────────────────────┘
                            │
                    API REST (JWT)
                            │
┌───────────────────────────┼─────────────────────────────┐
│                    BACKEND (Railway)                    │
│                           │                             │
│  ┌────────────────────────▼──────────────────────┐     │
│  │       Node.js + Express + TypeScript          │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │     │
│  │  │  Auth    │  │  Routes  │  │  Upload  │   │     │
│  │  │ (JWT)    │  │  (REST)  │  │ (Multer) │   │     │
│  │  └──────────┘  └──────────┘  └──────────┘   │     │
│  └────────────────────┬──────────────────────────┘     │
│                       │                                 │
│           ┌───────────┼──────────────┐                 │
│           │           │              │                 │
│  ┌────────▼──────┐ ┌──▼──────┐ ┌────▼──────────┐     │
│  │  PostgreSQL   │ │  Redis  │ │  Cloudinary   │     │
│  │   (Prisma)    │ │(Upstash)│ │  (CDN Images) │     │
│  └───────────────┘ └─────────┘ └───────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## Structure du projet

```
athletiq/
├── frontend/                 # Application Nuxt 3
│   ├── pages/               # Pages (routing automatique)
│   │   ├── index.vue       # Dashboard
│   │   ├── workouts/       # Gestion entraînements
│   │   ├── progress/       # Statistiques et graphs
│   │   ├── timelapse/      # Galerie photos & timelapse
│   │   └── profile/        # Profil utilisateur
│   ├── components/         # Composants réutilisables
│   │   ├── workout/       # Composants entraînement
│   │   ├── charts/        # Graphiques
│   │   └── timelapse/     # Player timelapse
│   ├── composables/       # Logique réutilisable
│   ├── stores/            # Pinia stores
│   ├── assets/            # CSS, images statiques
│   ├── public/            # Fichiers publics
│   ├── nuxt.config.ts     # Config Nuxt
│   └── package.json
│
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── routes/         # Routes API
│   │   │   ├── auth.ts    # Authentification
│   │   │   ├── workouts.ts
│   │   │   ├── exercises.ts
│   │   │   ├── progress.ts
│   │   │   ├── photos.ts  # Upload & timelapse
│   │   │   └── users.ts
│   │   ├── middlewares/   # Middlewares (auth, upload)
│   │   ├── services/      # Logique métier
│   │   ├── config/        # Configuration (DB, Cloudinary)
│   │   ├── utils/         # Utilitaires
│   │   └── server.ts      # Point d'entrée
│   ├── prisma/
│   │   ├── schema.prisma  # Schéma base de données
│   │   └── migrations/    # Migrations SQL
│   ├── .env.example       # Variables d'environnement
│   ├── tsconfig.json
│   └── package.json
│
├── mobile/                  # Config Capacitor (si séparé)
│   └── capacitor.config.ts
│
├── docker-compose.yml       # PostgreSQL + Redis local
├── .github/
│   └── workflows/          # CI/CD
└── README.md
```

---

## Schéma de base de données (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ========================================
// UTILISATEURS
// ========================================

model User {
  id            Int            @id @default(autoincrement())
  email         String         @unique
  password      String
  firstName     String?
  lastName      String?
  avatarUrl     String?
  goal          Goal?          // prise_masse, force, recomposition, perte_poids
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  workouts      Workout[]
  bodyStats     BodyStat[]
  measurements  Measurement[]
}

enum Goal {
  BULK          // Prise de masse
  STRENGTH      // Force
  RECOMP        // Recomposition
  CUT           // Perte de poids
}

// ========================================
// ENTRAÎNEMENTS
// ========================================

model Workout {
  id          Int             @id @default(autoincrement())
  userId      Int
  name        String
  date        DateTime        @default(now())
  duration    Int?            // en minutes
  notes       String?
  createdAt   DateTime        @default(now())

  user        User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  exercises   Exercise[]
  photos      WorkoutPhoto[]  // Photos de l'entraînement

  @@index([userId, date])
}

model Exercise {
  id          Int       @id @default(autoincrement())
  workoutId   Int
  name        String    // "Développé couché", "Squat", etc.
  category    String?   // "Pectoraux", "Jambes", etc.
  notes       String?

  workout     Workout   @relation(fields: [workoutId], references: [id], onDelete: Cascade)
  sets        Set[]

  @@index([workoutId])
}

model Set {
  id          Int       @id @default(autoincrement())
  exerciseId  Int
  setNumber   Int       // 1, 2, 3...
  reps        Int       // Nombre de répétitions
  weight      Float     // Poids en kg
  rpe         Int?      // Rate of Perceived Exertion (1-10)
  notes       String?

  exercise    Exercise  @relation(fields: [exerciseId], references: [id], onDelete: Cascade)

  @@index([exerciseId])
}

// ========================================
// PHOTOS DE PROGRESSION (TIMELAPSE)
// ========================================

model WorkoutPhoto {
  id          Int       @id @default(autoincrement())
  workoutId   Int
  photoUrl    String    // URL Cloudinary
  isPrimary   Boolean   @default(false)  // Photo principale du jour
  createdAt   DateTime  @default(now())

  workout     Workout   @relation(fields: [workoutId], references: [id], onDelete: Cascade)

  @@index([workoutId, isPrimary])
  @@index([createdAt])  // Pour le timelapse chronologique
}

// ========================================
// SUIVI PHYSIQUE
// ========================================

model BodyStat {
  id        Int       @id @default(autoincrement())
  userId    Int
  date      DateTime  @default(now())
  weight    Float     // Poids en kg
  bodyFat   Float?    // % masse grasse (optionnel)
  notes     String?

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, date])
}

model Measurement {
  id          Int       @id @default(autoincrement())
  userId      Int
  date        DateTime  @default(now())
  chest       Float?    // Tour de poitrine (cm)
  waist       Float?    // Tour de taille
  hips        Float?    // Tour de hanches
  biceps      Float?    // Tour de bras
  thighs      Float?    // Tour de cuisse
  calves      Float?    // Tour de mollet

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, date])
}
```

---

## Installation et setup

### **Prérequis**

- Node.js v20+
- PostgreSQL 14+
- npm ou pnpm
- Compte Cloudinary (gratuit)

### **1. Cloner le repository**

```bash
git clone https://github.com/votre-username/athletiq.git
cd athletiq
```

### **2. Setup Backend**

```bash
cd backend
npm install

# Copier .env.example vers .env
cp .env.example .env
```

**Éditer `.env` :**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/athletiq"

# JWT
JWT_SECRET="votre_secret_super_securise"
JWT_EXPIRES_IN="7d"

# Cloudinary
CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"

# Redis (optionnel pour dev)
REDIS_URL="redis://localhost:6379"

# Server
PORT=3001
NODE_ENV="development"
```

**Initialiser la base de données :**

```bash
# Générer le client Prisma
npx prisma generate

# Créer la base de données et appliquer les migrations
npx prisma migrate dev --name init

# (Optionnel) Seed avec des données de test
npx prisma db seed
```

**Lancer le serveur :**

```bash
npm run dev
# Backend disponible sur http://localhost:3001
```

### **3. Setup Frontend**

```bash
cd ../frontend
npm install

# Copier .env.example vers .env
cp .env.example .env
```

**Éditer `.env` :**

```env
# API Backend
NUXT_PUBLIC_API_URL="http://localhost:3001/api"

# Cloudinary (pour upload direct si besoin)
NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME="votre_cloud_name"
```

**Lancer le frontend :**

```bash
npm run dev
# Frontend disponible sur http://localhost:3000
```

### **4. Setup Mobile (Capacitor)**

```bash
cd frontend

# Ajouter les plateformes
npx cap add ios
npx cap add android

# Build et sync
npm run build
npx cap sync

# Ouvrir dans Xcode (iOS) ou Android Studio
npx cap open ios
npx cap open android
```

### **5. Docker (optionnel pour PostgreSQL + Redis)**

```bash
# Depuis la racine du projet
docker-compose up -d

# PostgreSQL sera disponible sur localhost:5432
# Redis sur localhost:6379
```

**`docker-compose.yml` :**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: athletiq
      POSTGRES_PASSWORD: password
      POSTGRES_DB: athletiq
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## Implémentation du système de photos

### **Flow complet**

```
User prend photo après entraînement
    ↓
Upload vers backend (Multer)
    ↓
Cloudinary (compression + CDN)
    ↓
URL stockée en DB (WorkoutPhoto)
    ↓
Affichage dans galerie / timelapse
```

### **Backend : Route upload**

```typescript
// backend/src/routes/photos.ts
import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';
import { prisma } from '../config/database';
import { authenticate } from '../middlewares/auth';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB max
});

// Upload photo d'entraînement
router.post(
  '/workout/:workoutId',
  authenticate,
  upload.single('photo'),
  async (req, res) => {
    try {
      const { workoutId } = req.params;
      const { isPrimary } = req.body;

      // Si photo principale, retirer l'ancien flag
      if (isPrimary === 'true') {
        await prisma.workoutPhoto.updateMany({
          where: { workoutId: parseInt(workoutId) },
          data: { isPrimary: false }
        });
      }

      // Upload vers Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `athletiq/workouts/${workoutId}`,
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto:good' }
            ]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      // Sauvegarder en DB
      const photo = await prisma.workoutPhoto.create({
        data: {
          workoutId: parseInt(workoutId),
          photoUrl: result.secure_url,
          isPrimary: isPrimary === 'true'
        }
      });

      res.json(photo);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Récupérer photos pour timelapse
router.get('/timelapse', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const photos = await prisma.workoutPhoto.findMany({
      where: {
        isPrimary: true,
        workout: {
          userId: req.user.id,
          date: {
            gte: startDate ? new Date(startDate) : undefined,
            lte: endDate ? new Date(endDate) : undefined
          }
        }
      },
      include: {
        workout: {
          select: {
            date: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(photos);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

### **Frontend : Composant Timelapse**

```vue
<!-- frontend/components/timelapse/TimelapsePlayer.vue -->
<template>
  <div class="timelapse-player">
    <div class="photo-container">
      <img
        :src="currentPhoto?.photoUrl"
        :alt="`Photo du ${formatDate(currentPhoto?.workout.date)}`"
        class="photo"
      />
      <div class="photo-info">
        <p>{{ formatDate(currentPhoto?.workout.date) }}</p>
        <p>Photo {{ currentIndex + 1 }} / {{ photos.length }}</p>
      </div>
    </div>

    <div class="controls">
      <button @click="prev">Précédent</button>
      <button @click="togglePlay">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </button>
      <button @click="next">Suivant</button>

      <div class="speed-control">
        <label>Vitesse:</label>
        <input
          v-model="playbackSpeed"
          type="range"
          min="100"
          max="2000"
          step="100"
        />
        <span>{{ playbackSpeed }}ms</span>
      </div>
    </div>

    <div class="timeline">
      <input
        v-model="currentIndex"
        type="range"
        :min="0"
        :max="photos.length - 1"
        @input="onTimelineChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  photos: Array<{
    id: number;
    photoUrl: string;
    workout: { date: string; name: string };
  }>;
}>();

const currentIndex = ref(0);
const isPlaying = ref(false);
const playbackSpeed = ref(500); // ms entre chaque photo
let intervalId: number | null = null;

const currentPhoto = computed(() => props.photos[currentIndex.value]);

function togglePlay() {
  if (isPlaying.value) {
    pause();
  } else {
    play();
  }
}

function play() {
  isPlaying.value = true;
  intervalId = setInterval(() => {
    if (currentIndex.value < props.photos.length - 1) {
      currentIndex.value++;
    } else {
      currentIndex.value = 0; // Boucle
    }
  }, playbackSpeed.value);
}

function pause() {
  isPlaying.value = false;
  if (intervalId) clearInterval(intervalId);
}

function next() {
  pause();
  if (currentIndex.value < props.photos.length - 1) {
    currentIndex.value++;
  }
}

function prev() {
  pause();
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function onTimelineChange() {
  pause();
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('fr-FR');
}

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
.timelapse-player {
  max-width: 800px;
  margin: 0 auto;
}

.photo-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #000;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.photo-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
}

.controls {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}

.timeline {
  margin-top: 20px;
}

.timeline input {
  width: 100%;
}
</style>
```

---

## Scripts utiles

```json
// package.json (backend)
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  }
}
```

```json
// package.json (frontend)
{
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",
    "mobile:ios": "npm run build && npx cap sync && npx cap open ios",
    "mobile:android": "npm run build && npx cap sync && npx cap open android"
  }
}
```

---

## Roadmap de développement

### **Phase 1 : MVP (4-6 semaines)**
- [ ] Setup projet (frontend + backend)
- [ ] Authentification (inscription, connexion, JWT)
- [ ] CRUD Entraînements (création, modification, suppression)
- [ ] CRUD Exercices et séries
- [ ] Historique des entraînements
- [ ] Suivi du poids corporel
- [ ] Dashboard basique

### **Phase 2 : Analyse et graphiques (3-4 semaines)**
- [ ] Graphiques d'évolution des charges (Chart.js)
- [ ] Calcul du volume total
- [ ] Calcul du 1RM
- [ ] Détection des records personnels (PR)
- [ ] Statistiques par exercice
- [ ] Graphiques poids corporel

### **Phase 3 : Photos et timelapse (2-3 semaines)**
- [ ] Upload photos après entraînement (Cloudinary)
- [ ] Galerie photos chronologique
- [ ] Sélection photo principale du jour
- [ ] Composant Timelapse avec lecture automatique
- [ ] Filtrage par période (semaine, mois, année)
- [ ] Comparaison avant/après

### **Phase 4 : Mobile (2-3 semaines)**
- [ ] Configuration Capacitor
- [ ] Accès caméra native
- [ ] Notifications push
- [ ] Mode hors-ligne (cache local)
- [ ] Build et publication (App Store, Play Store)

### **Phase 5 : Fonctionnalités avancées (4-6 semaines)**
- [ ] Détection de stagnation
- [ ] Suggestions d'augmentation de charges
- [ ] Suivi mensurations (bras, cuisses, etc.)
- [ ] Objectifs personnalisés (force, masse, recomp)
- [ ] Système de badges et achievements
- [ ] Intégration IA (recommandations personnalisées)

### **Phase 6 : Premium et monétisation (2-3 semaines)**
- [ ] Système d'abonnement (Stripe)
- [ ] Analyse prédictive (IA)
- [ ] Export de données (PDF, CSV)
- [ ] Suivi nutritionnel
- [ ] Templates d'entraînements premium

---

## Tests

```bash
# Backend
npm run test              # Tests unitaires
npm run test:e2e          # Tests E2E

# Frontend
npm run test              # Tests Vitest
npm run test:e2e          # Tests Playwright
```

---

## Déploiement

### **Frontend (Vercel)**

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
cd frontend
vercel --prod
```

### **Backend (Railway)**

1. Créer un compte sur [railway.app](https://railway.app)
2. Créer un nouveau projet
3. Ajouter PostgreSQL (addon)
4. Connecter le repo GitHub
5. Configurer les variables d'environnement
6. Deploy automatique sur chaque push

### **Base de données (Railway PostgreSQL)**

Railway fournit automatiquement :
- PostgreSQL hébergé
- Backups automatiques
- URL de connexion (`DATABASE_URL`)

---

## License

MIT License - voir [LICENSE](LICENSE)

---

## Contribution

Les contributions sont les bienvenues. Merci de créer une issue avant de soumettre une PR.

---

## Contact

Pour toute question : contact@athletiq.app

---

**Développé par l'équipe Athletiq**
