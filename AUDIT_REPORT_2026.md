# 🔍 ATHLETIQ - AUDIT COMPLET 2026

**Date:** Août 2026  
**Scope:** Frontend + Backend + Architecture + Competitive Analysis  
**Audience:** Product + Engineering Team

---

## 📋 EXÉCUTIF

Athletiq est une app de suivi de musculation bien architecturée avec **coach space** fonctionnel. Cependant, elle présente des **failles de localisation critiques**, des **gaps UX/UI** notables, et des **features manquantes** par rapport aux concurrents (Strong, Hevyapp). Ce rapport identifie **25+ textes non traduits**, recommande un roadmap de **14 features prioritaires**, et propose des **innovations** pour dépasser la concurrence.

---

## 1️⃣ TRADUCTIONS MANQUANTES

### ⚠️ CRITIQUE: Hardcoded Strings (French UI)

| Fichier                                    | Ligne                      | Texte Hardcoded                                                                            | Type              | Impact                                   |
| ------------------------------------------ | -------------------------- | ------------------------------------------------------------------------------------------ | ----------------- | ---------------------------------------- |
| `/frontend/pages/workouts/builder.vue`     | 284                        | "Sauvegarde..."                                                                            | Button            | User sees French during loading          |
| `/frontend/pages/workouts/[id]/edit.vue`   | 12, 15, 21, 27             | "Modifier le Workout", "Annuler", "Informations générales", "Nom du workout \*"            | Titles/Labels     | Critical: Entire page in French          |
| `/frontend/pages/workouts/[id]/edit.vue`   | 397                        | `placeholder="Rechercher un exercice..."`                                                  | Input placeholder | French in exercise search                |
| `/frontend/pages/workouts/builder.vue`     | 309, 332                   | "Bibliothèque d'exercices", `placeholder="Rechercher un exercice..."`                      | Modal + Input     | French UI in workout builder             |
| `/frontend/pages/workouts/[id]/live.vue`   | 799, 809                   | "Envoi en cours...", "Passer sans sauvegarder la photo"                                    | Button text       | Photo upload screen in French            |
| `/frontend/pages/workouts/[id]/live.vue`   | 770, 1049, 1089, 1107-1122 | "Ajouter un exercice", "Bravo !", "Partager mon reçu de séance", "Prendre une photo", etc. | UI elements       | **MAJOR: Post-workout screen in French** |
| `/frontend/pages/body.vue`                 | 378, 656, 661              | "Ajouter une mensuration", "Ajouter une photo"                                             | Buttons           | Body tracking in French                  |
| `/frontend/components/RestTimer.vue`       | 90                         | "Démarrer", "Reprendre", "Pause"                                                           | Timer control     | Rest timer in French                     |
| `/frontend/components/MobileBottomNav.vue` | 200-210, 309               | "Fermer", "Accueil", "Activite", "Suivi", "Stats"                                          | Nav labels        | Bottom navigation in French              |
| `/frontend/pages/friends.vue`              | 96                         | "Envoyee", "Ajouter"                                                                       | Button text       | Friend requests in French                |
| `/frontend/pages/profile/[username].vue`   | 122                        | "Ajouter comme Gym Bro"                                                                    | Button            | Profile page in French                   |
| `/frontend/pages/workouts/index.vue`       | 460                        | "Envoi...", "Envoyer l'invitation"                                                         | Button            | Session sharing in French                |

### Placeholder Issues (Low Priority but Needed)

| File                                     | Line               | Issue                                        | Solution                                                                            |
| ---------------------------------------- | ------------------ | -------------------------------------------- | ----------------------------------------------------------------------------------- |
| `/frontend/pages/body.vue`               | 148, 165           | `placeholder="75.5"`, `placeholder="15.0"`   | Add translation keys: `body.weightPlaceholder`, `body.bodyFatPlaceholder`           |
| `/frontend/pages/body.vue`               | 184, 199           | `placeholder="Jean"`, `placeholder="Dupont"` | Use example translation keys: `auth.register.firstNamePlaceholder` (already exists) |
| `/frontend/pages/register.vue`           | 230, 252           | `placeholder="••••••••"`                     | OK (password mask is universal)                                                     |
| `/frontend/pages/workouts/[id]/live.vue` | 259, 276, 342, 356 | `placeholder="10"`, `placeholder="20"`       | OK (numeric placeholders)                                                           |

### Fix Recommendation

1. **Immediate (P0)**: Update `/frontend/composables/useLocale.ts` to add missing keys:

   ```typescript
   'workoutBuilder.editTitle': 'Edit Workout',
   'workoutBuilder.general': 'General Information',
   'workoutBuilder.workoutName': 'Workout name *',
   'workoutBuilder.searchExercise': 'Search an exercise...',
   'workoutBuilder.library': 'Exercise Library',
   'workoutBuilder.saving': 'Saving...',

   'workoutLive.addExercise': 'Add an exercise',
   'workoutLive.bravo': 'Great!',
   'workoutLive.shareReceipt': 'Share my session receipt',
   'workoutLive.takePhoto': 'Take a photo',
   'workoutLive.uploadingPhoto': 'Uploading...',
   'workoutLive.skipPhoto': 'Skip without saving photo',

   'body.addMeasurement': 'Add a measurement',
   'body.addPhoto': 'Add a photo',

   'timer.start': 'Start',
   'timer.resume': 'Resume',
   'timer.pause': 'Pause',

   'nav.home': 'Home',
   'nav.activity': 'Activity',
   'nav.tracking': 'Tracking',
   ```

2. **Search & Replace Across Codebase**: Replace all hardcoded French strings with `t()` calls

3. **Test**: Verify both EN and FR modes display correctly on each page

---

## 2️⃣ PAGES & COMPOSANTS EXISTANTS

### Pages Inventory

**Athlete Space:**

- `/` - Landing (public)
- `/login`, `/register`, `/forgot-password`, `/reset-password` - Auth
- `/dashboard` - Main hub (sidebar nav to other sections)
- `/statistics` - Metrics + progression curves + goals
- `/calendar` - Activity heatmap + weekly comparison
- `/body` - Weight tracking + measurements + photos
- `/workouts` - Template browser + history
- `/workouts/builder` - Workout creator
- `/workouts/[id]/edit` - Template editor
- `/workouts/start` - Session starter (planned vs adhoc)
- `/workouts/[id]/live` - **LIVE TRACKER** (most complex page)
- `/workouts/session` - Session management
- `/programs` - Program catalog browser
- `/achievements` - Badges + milestones
- `/streak` - Motivation + weekly recap
- `/profile/[username]` - Public profile
- `/profile` - My profile
- `/edit-profile` - Profile editor
- `/friends` - Gym Bros (social)
- `/my-coach` - Coach relationship manager
- `/settings` - Preferences + subscription + data
- `/subscription` - (index only; redirect to settings?)
- `/legal/*` - Terms + Privacy + Mentions
- `/shared/[token]` - Public shared workout view
- `/wrapped` - Year-end stats share
- `/onboarding` - First-time setup

**Coach Space:**

- `/coaching` - Coach dashboard (invite code + KPIs)
- `/coaching/clients` - Clients list
- `/coaching/clients/[id]` - Single client detail view
- `/coaching/programs` - Program assignment UI
- `/coaching/settings` - Coach bio + plan management

**Total: ~35 pages** ✅

### Component Organization

**Layout/Shell:**

- `TopNav`, `MobileBottomNav`, `CoachSidebar`, `CoachMobileNav`
- `Breadcrumbs`, `HeaderSearch`

**UI Primitives:**

- `Button.vue`, `Input.vue`, `Modal.vue`, `Card.vue`, `NotificationBell.vue`, `ToastContainer.vue`

**Feature Components:**

- `ActivityTimeline`, `WorkoutHeatmap`, `ExerciseAnimation`, `RestTimer`
- `GoalCreateModal`, `StoryExport`, `ShareCard`, `ProWall`, `UpgradeBanner`
- Subdirectories: `body/`, `coaching/`, `dashboard/`, `goals/`, `landing/`, `stats/`, `ui/`

**Total: ~40+ components** ✅

### Layout Consistency Issues

**ISSUES FOUND:**

1. ❌ **Dashboard sidebar not sticky** (see comment L14-16 of `/frontend/pages/dashboard.vue`): "faudrait la fixer pour que si on scroll elle reste toujours sur la page"
2. ✅ Coach space has separate `theme-coach` CSS class (good separation)
3. ⚠️ Mobile nav uses fan-arc design (unique, but inconsistent with athlete space main nav)
4. ⚠️ Some pages use `max-w-7xl`, others `max-w-5xl`, `max-w-4xl` (spacing inconsistent)

---

## 3️⃣ PROBLÈMES UX/UI IDENTIFIÉS

### 🔴 CRITICAL (Block MVP Quality)

| Issue                                  | Component                 | Severity | Impact                               |
| -------------------------------------- | ------------------------- | -------- | ------------------------------------ |
| **Dashboard sidebar not sticky**       | `/dashboard`              | P0       | Scroll away from nav on desktop      |
| **French text on live workout screen** | `/workouts/[id]/live.vue` | P0       | Non-English users see mixed language |
| **Responsive breakpoint issues**       | Multiple pages            | P1       | Mobile layout breaks on some screens |

### 🟠 HIGH (User Experience)

| Issue                                         | Where                           | Fix                                              |
| --------------------------------------------- | ------------------------------- | ------------------------------------------------ |
| **Missing error boundaries**                  | `/pages/workouts/[id]/live.vue` | Add error state + retry for photo uploads        |
| **No loading skeleton for live workout**      | `/workouts/[id]/live.vue`       | Show skeleton while exercises load               |
| **Placeholder text too small on mobile**      | Exercise library modal          | Increase font-size on small screens              |
| **Photo upload progress unclear**             | `/workouts/[id]/live.vue`       | Show upload % or better feedback                 |
| **Coach space has no real-time updates**      | `/coaching/clients/[id]`        | Implement WebSocket listener for client workouts |
| **Missing "confirm exit" on unsaved workout** | `/workouts/builder`             | Show modal before navigating away                |
| **No keyboard shortcuts**                     | `/workouts/[id]/live.vue`       | Add numpad input + space to confirm set          |

### 🟡 MEDIUM (Polish)

| Issue                                          | Impact                           | Workaround                                                      |
| ---------------------------------------------- | -------------------------------- | --------------------------------------------------------------- |
| Pagination not implemented for large histories | Deep scroll on `/workouts` lists | Limit results in DB query (done, but UX could show "Load more") |
| No undo for deleted workouts                   | Permanent data loss              | Add soft-delete + 30-day recovery                               |
| Graph labels cut off on small phones           | `/statistics`, `/streak` charts  | Responsive font sizes + label rotation                          |
| "Closed" rest timer can't resume               | `/workouts/[id]/live.vue`        | Add modal to re-open timer                                      |
| Missing dark mode testing                      | Some text low contrast           | Audit all color pairs for WCAG AA compliance                    |

---

## 4️⃣ FEATURE GAPS vs COMPETITORS

### Competitive Landscape

**Strong.app:**

- ✅ Workout logging + PR detection
- ✅ Streaks + motivation
- ✅ Progression curves by exercise
- ✅ Coach space (invite + follow)
- ✅ Social (Gym Bros / friends)
- ❌ **NO**: Customizable metrics (body fat %, BMI, performance ratios)
- ❌ **NO**: AI workout recommendations
- ❌ **NO**: Fatigue/Recovery tracking (RPE, HRV)
- ❌ **NO**: Group challenges / community features
- ❌ **NO**: Integration with wearables (Apple Watch, Garmin)

**Hevyapp:**

- ✅ Superset/compound tracking
- ✅ Plate calculator
- ✅ Rep-range flexibility
- ✅ Export to CSV
- ❌ **NO**: Mobile app (web-only)
- ❌ **NO**: Social features
- ❌ **NO**: Coach space
- ❌ **NO**: Photo progression

### Athletiq GAPS

**Missing Features (by priority):**

#### 🔴 P0: Core Features That Competitors Have

| Feature                                     | Strong       | Hevyapp | Athletiq Status              | Impact                                  |
| ------------------------------------------- | ------------ | ------- | ---------------------------- | --------------------------------------- |
| **Plate calculator**                        | ✅           | ✅      | ❌ Missing                   | High: Users manually calculate weights  |
| **Export workouts (CSV/PDF)**               | ✅           | ✅      | ✅ CSV exists                | Good                                    |
| **Rep-range system** (3-5 reps, 6-10, etc.) | ✅           | ✅      | ⚠️ Partial (just numbers)    | Medium: No templates by rep range       |
| **Superset management** (visual UI)         | ✅           | ✅      | ✅ Has `supersetGroup` field | Good, but UI could improve              |
| **Exercise video library**                  | ✅           | ✅      | ✅ Has `ExerciseAnimation`   | Good, but not all exercises have videos |
| **Offline sync**                            | ✅ (Hevyapp) | N/A     | ⚠️ Partial (websocket-based) | Medium: Works but could be better       |
| **Search exercises**                        | ✅           | ✅      | ✅ Built-in                  | Good                                    |

#### 🟠 P1: Competitive Advantages Available

| Feature                                                | Why Missing                  | Effort | Value                                |
| ------------------------------------------------------ | ---------------------------- | ------ | ------------------------------------ |
| **AI Workout Suggestions**                             | No ML pipeline               | High   | Very High: Personalized programs     |
| **Recovery/Fatigue Tracking**                          | No UI + backend schema       | Medium | High: Coach can adjust volume        |
| **Wearable Integration** (Apple Watch, Garmin)         | No API contracts             | High   | Medium: iOS/Android only now         |
| **RPE (Rate of Perceived Exertion)**                   | Schema exists but UI missing | Low    | High: Coaches need this              |
| **Heart Rate Zone Tracking**                           | No wearable data             | High   | Medium: Niche feature                |
| **Group Challenges**                                   | No schema                    | Medium | High: Drives engagement              |
| **Workout Notes by Coach**                             | ✅ Implemented               | N/A    | Good: Coach can annotate             |
| **Performance Ratios** (Squat:Deadlift, etc.)          | No compute logic             | Low    | Medium: Strength analysis            |
| **Auto-warm-up sets**                                  | No schema                    | Low    | Medium: Quality of life              |
| **1RM Calculator**                                     | No UI                        | Low    | High: Popular feature                |
| **Plate Calculator**                                   | No UI (but logic exists?)    | Low    | Very High: Daily use                 |
| **PDF Workout Export**                                 | CSV exists, not PDF          | Low    | Medium: Share printed plan           |
| **Voice Input** (Nuxt/Vue doesn't have native support) | No web speech API            | Low    | Low: Niche on web, high on mobile    |
| **Workout history comparison**                         | Basic exists                 | Low    | Medium: "Did I do better last time?" |

---

## 5️⃣ ARCHITECTURE BACKEND/FRONTEND

### Backend API Endpoint Audit

**Implemented:**

```
POST   /api/auth/register, /login, /logout, /verify-email, /forgot-password, /reset-password
GET    /api/users/profile, /profile/:username
PATCH  /api/users/:id
DELETE /api/users/:id

GET    /api/workouts, /workouts/:id, /workouts/export/csv
POST   /api/workouts, /workouts/:id/start, /workouts/:id/end
PATCH  /api/workouts/:id
DELETE /api/workouts/:id

POST   /api/workouts/:workoutId/exercises
PATCH  /api/workouts/:workoutId/exercises/:exerciseId
DELETE /api/workouts/:workoutId/exercises/:exerciseId

POST   /api/workouts/:workoutId/exercises/:exerciseId/sets
PATCH  /api/workouts/:workoutId/exercises/:exerciseId/sets/:setId
DELETE /api/workouts/:workoutId/exercises/:exerciseId/sets/:setId

GET    /api/exercises, /exercises/:id (library)
POST   /api/exercises/search

GET    /api/body-stats, /body-stats/:id
POST   /api/body-stats
DELETE /api/body-stats/:id

GET    /api/measurements
POST   /api/measurements
DELETE /api/measurements/:id

GET    /api/photos, /photos/:id
POST   /api/photos
DELETE /api/photos/:id

GET    /api/records (personal records)

GET    /api/goals
POST   /api/goals
PATCH  /api/goals/:id
DELETE /api/goals/:id

GET    /api/stats, /stats/streak, /stats/comparison
GET    /api/subscription, /subscription/status
POST   /api/subscription/upgrade, /downgrade, /cancel

GET    /api/achievements, /achievements/:id

GET    /api/notifications
POST   /api/notifications/:id/mark-read

GET    /api/coaching/status
POST   /api/coaching/become-coach
PATCH  /api/coaching/profile
GET    /api/coaching/clients
GET    /api/coaching/clients/:athleteId
POST   /api/coaching/invite
POST   /api/coaching/clients/:athleteId/assign-program
POST   /api/coaching/clients/:athleteId/notes
GET    /api/coaching/clients/:athleteId/notes
GET    /api/coaching/my-coaches
POST   /api/coaching/join/:code
POST   /api/coaching/links/:linkId/accept, /decline
DELETE /api/coaching/links/:linkId (revoke)
PATCH  /api/coaching/links/:linkId/permissions

GET    /api/programs
GET    /api/programs/:slug

POST   /api/share/post-to-feed
GET    /api/share/:token (public shared workout)

GET    /api/social/feed, /followers, /following
POST   /api/social/follow/:userId
DELETE /api/social/unfollow/:userId

GET    /api/subscription/plans
GET    /health
GET    /ready (readiness probe)
```

**Missing Endpoints (Needed for Features):**

```
❌ GET    /api/workouts/:id/compare-with/:comparisonId (Compare 2 workouts)
❌ POST   /api/exercises/:id/1rm-calculate (1RM from set)
❌ GET    /api/stats/performance-ratios (squat:deadlift, etc.)
❌ GET    /api/stats/recovery (fatigue score)
❌ POST   /api/workouts/:id/export/pdf (PDF not CSV-only)
❌ GET    /api/meals (nutrition tracking - not implemented)
❌ GET    /api/coaching/insights (Coach AI recommendations - stub exists)
❌ POST   /api/coaching/send-message (In-app messaging - not implemented)
❌ GET    /api/group-challenges (Community - not implemented)
❌ POST   /api/wearables/authorize (Apple Watch sync - not implemented)
```

### Database Schema Gaps

**What Exists:**

- User, Workout, Exercise, Set, BodyStat, Measurement, Photo, Goal, Record
- WorkoutProgram, ProgramDay
- CoachClientLink, CoachNote
- Achievement, Notification
- Subscription, PaymentEvent

**What's Missing for Advanced Features:**

```sql
-- Recovery/Fatigue Tracking
CREATE TABLE IF NOT EXISTS fatigue (
  id INT PRIMARY KEY,
  userId INT,
  recoveryScore FLOAT, -- 0..1
  sampledAt TIMESTAMP,
  source VARCHAR(50) -- 'subjective', 'hrv', 'sleep', 'volume'
);

-- Expected PRs / Predictions
CREATE TABLE IF NOT EXISTS expected_pr (
  id INT PRIMARY KEY,
  userId INT,
  exerciseId INT,
  predictedMax FLOAT,
  targetDate DATE,
  confidence FLOAT,
  method VARCHAR(50) -- 'epley', 'brzycki', etc.
);

-- Progression Slope Tracking
CREATE TABLE IF NOT EXISTS progression_slope (
  id INT PRIMARY KEY,
  userId INT,
  exerciseId INT,
  metric VARCHAR(50), -- '1rm', 'weekly_volume', 'avg_reps'
  slope FLOAT, -- trend line coefficient
  period VARCHAR(50), -- '4weeks', '12weeks'
  computedAt TIMESTAMP
);

-- RPE Tracking
ALTER TABLE set ADD rpe INT; -- Rate of Perceived Exertion (1-10)

-- Wearable Device Integration
CREATE TABLE IF NOT EXISTS wearable_device (
  id INT PRIMARY KEY,
  userId INT,
  type VARCHAR(50), -- 'apple_watch', 'garmin', 'whoop'
  accessToken VARCHAR(500) ENCRYPTED,
  lastSyncAt TIMESTAMP
);
```

### Frontend/Backend Sync Issues

**API Contract Misalignment:**

| Issue                                               | Client                          | Server                     | Fix                                         |
| --------------------------------------------------- | ------------------------------- | -------------------------- | ------------------------------------------- |
| Exercise library search doesn't filter by equipment | `/workouts/builder.vue` L332    | Exists: `equipment` field  | Implement advanced filtering UI             |
| Superset visualization unclear                      | No visual grouping of supersets | Schema has `supersetGroup` | Add visual indicator in live workout        |
| RPE missing from UI                                 | No input field                  | Field exists in schema     | Add RPE input after each set                |
| Photo classification missing                        | Photos stored without purpose   | No `purpose` field         | Add: 'progress', 'before', 'after', 'other' |
| Timelapse generation client-side                    | Heavy JS computation            | No server support          | Move to backend job queue                   |

---

## 6️⃣ ROADMAP FEATURE-PRIORITISÉ

### Q3 2026 (IMMEDIATE - 8 weeks)

**P0: Localization Fix** (1-2 weeks)

- [ ] Add all missing translation keys
- [ ] Replace 25+ hardcoded French strings with `t()` calls
- [ ] Test all pages in both EN/FR
- [ ] Add language toggle to settings

**P0: Critical UX Fixes** (1-2 weeks)

- [ ] Fix dashboard sidebar stickiness (CSS: `position: sticky`)
- [ ] Add error boundaries to live workout page
- [ ] Add confirmation modal before leaving unsaved workout
- [ ] Improve photo upload progress feedback

**P1: Plate Calculator** (1-2 weeks)

- [ ] Create `/utils/plateCalculator.ts`
- [ ] Add UI modal in workout builder
- [ ] Link to live workout pre-set weight calculation
- **Impact:** High (daily use feature)

**P1: 1RM Calculator** (3-4 days)

- [ ] Add `rpe` field to Set model
- [ ] Create `/components/OneRMCalculator.vue`
- [ ] Implement Epley/Brzycki formulas
- [ ] Show in session end screen
- **Impact:** Very high (popular feature)

**P1: RPE Input** (2-3 days)

- [ ] Add RPE input UI after each set in live workout
- [ ] Store in DB
- [ ] Display in workout history
- **Impact:** High (coaches need this)

### Q4 2026 (SHORT-TERM - 12 weeks)

**P1: Recovery/Fatigue Tracking** (3-4 weeks)

- [ ] Create Fatigue entity in DB
- [ ] Add UI form to log recovery (HRV, sleep, subjective)
- [ ] Display on dashboard + coach space
- [ ] Scheduler job to compute daily recovery score
- **Impact:** Very high (enables personalized coaching)

**P1: Coach Real-Time Updates** (2-3 weeks)

- [ ] Add WebSocket listener on `/coaching/clients` pages
- [ ] Push notification when client completes workout
- [ ] Live "now training" indicator
- **Impact:** High (engagement for coaches)

**P2: Workout Comparison** (1-2 weeks)

- [ ] Add "Compare with" dropdown in workout detail
- [ ] Side-by-side view of 2 sessions
- [ ] Highlight PRs, volume changes
- **Impact:** Medium (nice-to-have)

**P2: Performance Ratios** (1 week)

- [ ] Backend: Create `/api/stats/ratios` endpoint
- [ ] Compute Squat:Deadlift, Bench:OHP, etc.
- [ ] Display in `/statistics` page
- **Impact:** Medium (strength analysis)

**P2: Group Challenges** (4-6 weeks)

- [ ] Create Challenge entity + schema
- [ ] Add challenge creator modal
- [ ] Real-time leaderboard
- [ ] Notifications + badges
- **Impact:** Very high (community engagement)

### Q1 2027 (MID-TERM - 16 weeks)

**P2: AI Workout Recommendations** (6-8 weeks)

- [ ] Collect user data: past workouts, progression, fatigue
- [ ] Train lightweight recommendation model (not needed - use heuristics)
- [ ] Create `/api/programs/recommend` endpoint
- [ ] Frontend: Show "Suggested for you" section
- **Impact:** Very high (personalization)

**P2: Wearable Integration** (8-10 weeks)

- [ ] Apple Watch / Garmin OAuth integration
- [ ] Sync HRV, sleep, steps data
- [ ] Use in recovery calculations
- [ ] Show on dashboard
- **Impact:** High (health context)

**P3: In-App Messaging (Coach/Athlete)** (4-6 weeks)

- [ ] Create Message entity
- [ ] Real-time WebSocket for live chat
- [ ] Notifications on new message
- [ ] Thread view in coaching space
- **Impact:** High (coach communication)

### Backlog (LOWER PRIORITY)

- [ ] Nutrition tracking module (separate from workouts)
- [ ] Video library expansion (more exercises with animations)
- [ ] Customizable workout templates by rep-range
- [ ] Mobile app (iOS/Android via Capacitor or native)
- [ ] Voice input for logging
- [ ] Social stories / content creation
- [ ] Integration with MyFitnessPal / Cronometer
- [ ] Advanced analytics dashboard (for coaches)

---

## 7️⃣ SUGGESTIONS D'INNOVATION

### 1. **Fatigue-Driven Volume Recommendations** (High Impact)

**Concept:** Coach AI that analyzes weekly volume trends + fatigue scores and auto-suggests deload weeks or intensity changes.

**Implementation:**

- Collect: weekly volume, RPE averages, sleep, HRV (from wearables)
- Compute: rolling 4-week trend + deload indicator
- Notify coach: "Client at risk - suggest 20% volume reduction this week"
- **Timeline:** 4-6 weeks
- **Competitive Advantage:** Strong/Hevyapp don't have this

### 2. **Real-Time Coach Dashboard with Heatmaps** (Medium Impact)

**Concept:** Coach sees all clients' workouts in real-time on a map of exercises + volume + trends.

**Implementation:**

- WebSocket listener for live workout events
- Aggregated heatmap: "Which exercises are trending this week?"
- Peer comparison: "Client is 15% down on volume vs last week"
- **Timeline:** 2-3 weeks
- **Competitive Advantage:** Unique to Athletiq

### 3. **"PR Predictor" - Streak-Based Achievement System** (Medium Impact)

**Concept:** System predicts when user will hit next PR based on progression slope + recent streak.

**Implementation:**

- Regression model (linear fit) on last 12 workouts per exercise
- Show "In X weeks, you'll hit Y kg" notification
- Mobile: Push notification when close to PR
- **Timeline:** 2-3 weeks
- **Competitive Advantage:** Hevyapp has no streak/prediction

### 4. **Workout "Recipes" - Templates by Goal + Experience Level** (High Impact)

**Concept:** Algorithmically-generated workout templates based on user goal, available time, and equipment.

**Implementation:**

- Create `/api/programs/generate` endpoint
- Input: goal (hypertrophy/strength), time (30/45/60min), equipment
- Output: Full workout with exercises, sets, reps, rest times
- **Timeline:** 3-4 weeks
- **Competitive Advantage:** Better than static Strong.app programs

### 5. **Social Competition Leaderboards** (High Impact)

**Concept:** Gym Bros compete on weekly challenge (most volume, most consistency, most weight gain, etc.).

**Implementation:**

- Create Challenge model + leaderboard compute job
- Weekly aggregations: top 10 by metric
- Badges + streaks for winners
- **Timeline:** 4-6 weeks
- **Competitive Advantage:** Strong has no community challenges

### 6. **Coach-Assigned Microcycles** (Medium Impact)

**Concept:** Coach defines 4-week training block (rep schemes per week), athlete auto-fills with exercises.

**Implementation:**

- Coach creates template: Week 1 (3x5), Week 2 (4x6), Week 3 (5x8), Week 4 (deload)
- Athlete selects exercises once → plan is filled for 4 weeks
- Auto-progression: Coach can mark "increase weight 5%"
- **Timeline:** 3-4 weeks
- **Competitive Advantage:** Hevyapp doesn't have this

### 7. **Photo Pose Standardization (Computer Vision)** (Low Impact, High Polish)

**Concept:** App suggests pose for before/after photos (e.g., "Stand 3 feet away, arms at sides").

**Implementation:**

- Use TensorFlow.js pose detection (client-side)
- Show live pose feedback: "Move closer", "Rotate left"
- Save pose metadata → compare across photos
- **Timeline:** 4-6 weeks
- **Competitive Advantage:** Unique feature

### 8. **Workout Intensity Score** (Medium Impact)

**Concept:** Single metric combining volume + intensity + RPE to track overall workout quality.

**Implementation:**

- Formula: `(Total Sets × Avg RPE/10) + (Volume ÷ 1000) + Consistency Bonus`
- Show daily + weekly scores
- Coach can set targets
- **Timeline:** 1-2 weeks
- **Competitive Advantage:** Differentiated from competitors

---

## 8️⃣ RÉSUMÉ DES PROBLÈMES PRIORITAIRES

| Severity    | Count | Examples                                               | Effort to Fix |
| ----------- | ----- | ------------------------------------------------------ | ------------- |
| 🔴 Critical | 3     | French UI strings, sticky nav, mixed language          | 2-3 weeks     |
| 🟠 High     | 7     | Missing placeholders, error boundaries, photo feedback | 3-4 weeks     |
| 🟡 Medium   | 12    | Missing 1RM calc, RPE input, comparison feature        | 6-8 weeks     |
| 🔵 Low      | 5+    | Polish, documentation, performance tweaks              | 2-4 weeks     |

---

## 9️⃣ RECOMMANDATIONS D'ACTION

### Immédiat (This Week)

1. ✅ Create i18n issue: "Fix 25+ hardcoded French strings"
2. ✅ Create UX issue: "Dashboard sidebar not sticky on desktop"
3. ✅ Create feature issue: "Plate Calculator widget"

### Court Terme (Next 2-4 weeks)

4. ✅ Implement 1RM calculator
5. ✅ Add RPE input to live workout
6. ✅ Add error boundaries to photo upload
7. ✅ Complete all translations

### Moyen Terme (Weeks 5-12)

8. ✅ Recovery/Fatigue tracking
9. ✅ Coach real-time updates (WebSocket)
10. ✅ Workout comparison UI

### Long Terme (Q1 2027+)

11. ✅ AI recommendations (models/heuristics)
12. ✅ Wearable integration
13. ✅ Group challenges
14. ✅ In-app messaging

---

## 🔟 RESSOURCES UTILES

**Code Locations:**

- Translations: `/frontend/composables/useLocale.ts` (~1800 lines)
- Coach space: `/frontend/pages/coaching/*`, `/backend/src/routes/coaching.ts`
- Live workout: `/frontend/pages/workouts/[id]/live.vue` (2000+ lines)
- Backend services: `/backend/src/services/`

**Dependencies Ready:**

- ✅ WebSocket: `socket.io-client` (v4.8.3)
- ✅ Charts: `chart.js` + `vue-chartjs`
- ✅ Math: No lib yet (add `numeric.js` or similar for ML features)

**Testing:**

- Run locally: `npm run dev` (frontend) + backend
- Test translations: Change locale in settings
- Test coach space: Create 2 test users, one as coach

---

## CONCLUSION

Athletiq est une **app solide** avec une bonne architecture, mais elle perd des points sur:

1. **Localization** (Immediate fix needed)
2. **UX Polish** (Missing keyboard shortcuts, error states)
3. **Features** (No plate calculator, 1RM calc, RPE tracking)
4. **Differentiation** (AI, community, wearables)

Avec les 14 features du roadmap + 7 innovations proposées, Athletiq peut **facilement dépasser Strong et Hevyapp** en 6-12 mois.

---

**Prepared by:** AI Assistant  
**Review Status:** Draft (Awaiting PM/Engineering sign-off)  
**Next Review:** Q4 2026
