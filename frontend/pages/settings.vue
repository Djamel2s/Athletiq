<template>
  <div class="min-h-screen geometric-bg">
    <!-- Navigation -->
    <TopNav />

    <div class="pt-24 md:pt-32 px-4 md:px-6 pb-20 w-full max-w-lg mx-auto">
      <!-- Header -->
      <div class="text-center mb-10 fade-in">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-2">Paramètres</h1>
        <p class="text-primary-600 dark:text-primary-400 text-body-relaxed">Configurez votre expérience</p>
      </div>

      <!-- Sections -->
      <div class="space-y-6 slide-up">
        <!-- Compte -->
        <div class="card-glass">
          <h2 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-5 flex items-center gap-3">
            <div class="w-10 h-10 md:w-8 md:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            Compte
          </h2>
          <div class="space-y-1">
            <NuxtLink to="/edit-profile" class="flex items-center justify-between p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors">
              <span class="text-primary-800 dark:text-primary-200">Modifier mon profil</span>
              <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
            <NuxtLink to="/subscription" class="flex items-center justify-between p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors">
              <span class="text-primary-800 dark:text-primary-200">Abonnement</span>
              <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Gym Bros -->
        <div class="card-glass">
          <h2 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-5 flex items-center gap-3">
            <div class="w-10 h-10 md:w-8 md:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Icon name="lucide:users" class="w-4 h-4 text-white" />
            </div>
            Gym Bros
          </h2>
          <div class="space-y-1">
            <NuxtLink to="/friends" class="flex items-center justify-between p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors">
              <span class="text-primary-800 dark:text-primary-200">Liste des Gym Bros</span>
              <div class="flex items-center gap-2">
                <span v-if="pendingRequestsCount > 0" class="inline-flex items-center justify-center w-6 h-6 text-[10px] font-bold bg-red-500 text-white rounded-full">{{ pendingRequestsCount }}</span>
                <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </NuxtLink>
            <NuxtLink to="/feed" class="flex items-center justify-between p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors">
              <span class="text-primary-800 dark:text-primary-200">Feed d'activite</span>
              <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Preferences -->
        <div class="card-glass">
          <h2 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-5 flex items-center gap-3">
            <div class="w-10 h-10 md:w-8 md:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            Preferences
          </h2>
          <div class="space-y-1">
            <!-- Theme -->
            <div class="flex items-center justify-between p-3">
              <div class="flex bg-primary-100 dark:bg-primary-800 rounded-xl p-1 w-full">
                <button
                  @click="setTheme('light')"
                  class="flex-1 px-2 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
                  :class="$colorMode.preference === 'light' ? 'bg-white dark:bg-primary-700 shadow-sm text-primary-900 dark:text-primary-100' : 'text-primary-500 dark:text-primary-400'"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                  <span class="hidden sm:inline">Clair</span>
                </button>
                <button
                  @click="setTheme('dark')"
                  class="flex-1 px-2 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
                  :class="$colorMode.preference === 'dark' ? 'bg-white dark:bg-primary-700 shadow-sm text-primary-900 dark:text-primary-100' : 'text-primary-500 dark:text-primary-400'"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                  </svg>
                  <span class="hidden sm:inline">Sombre</span>
                </button>
                <button
                  @click="setTheme('system')"
                  class="flex-1 px-2 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
                  :class="$colorMode.preference === 'system' ? 'bg-white dark:bg-primary-700 shadow-sm text-primary-900 dark:text-primary-100' : 'text-primary-500 dark:text-primary-400'"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span class="hidden sm:inline">Auto</span>
                </button>
              </div>
            </div>

            <!-- Unite de poids -->
            <div class="flex items-center justify-between p-3">
              <span class="text-primary-800 dark:text-primary-200">Unite de poids</span>
              <div class="flex bg-primary-100 dark:bg-primary-800 rounded-xl p-1">
                <button
                  @click="weightUnit = 'kg'"
                  class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                  :class="weightUnit === 'kg' ? 'bg-white dark:bg-primary-700 shadow-sm text-primary-900 dark:text-primary-100' : 'text-primary-500 dark:text-primary-400'"
                >
                  kg
                </button>
                <button
                  @click="weightUnit = 'lbs'"
                  class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                  :class="weightUnit === 'lbs' ? 'bg-white dark:bg-primary-700 shadow-sm text-primary-900 dark:text-primary-100' : 'text-primary-500 dark:text-primary-400'"
                >
                  lbs
                </button>
              </div>
            </div>

            <!-- Timer de repos -->
            <div class="flex items-center justify-between p-3">
              <span class="text-primary-800 dark:text-primary-200">Timer de repos par defaut</span>
              <div class="flex items-center gap-2">
                <button @click="restTimer = Math.max(30, restTimer - 15)" class="w-10 h-10 md:w-8 md:h-8 rounded-lg bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 flex items-center justify-center transition-colors">
                  <svg class="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                  </svg>
                </button>
                <span class="text-primary-900 dark:text-primary-100 font-medium w-12 text-center">{{ restTimer }}s</span>
                <button @click="restTimer = Math.min(300, restTimer + 15)" class="w-10 h-10 md:w-8 md:h-8 rounded-lg bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 flex items-center justify-center transition-colors">
                  <svg class="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="card-glass">
          <h2 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-5 flex items-center gap-3">
            <div class="w-10 h-10 md:w-8 md:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
            </div>
            Notifications
          </h2>
          <div class="space-y-1">
            <div class="flex items-center justify-between p-3">
              <span class="text-primary-800 dark:text-primary-200">Records personnels</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="notifPR" class="sr-only peer" />
                <div class="w-11 h-6 bg-primary-200 dark:bg-primary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-sand-500 peer-checked:to-sand-600"></div>
              </label>
            </div>
            <div class="flex items-center justify-between p-3">
              <span class="text-primary-800 dark:text-primary-200">Series consecutives</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="notifStreak" class="sr-only peer" />
                <div class="w-11 h-6 bg-primary-200 dark:bg-primary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-sand-500 peer-checked:to-sand-600"></div>
              </label>
            </div>
            <div class="flex items-center justify-between p-3">
              <span class="text-primary-800 dark:text-primary-200">Objectifs</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="notifGoals" class="sr-only peer" />
                <div class="w-11 h-6 bg-primary-200 dark:bg-primary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-sand-500 peer-checked:to-sand-600"></div>
              </label>
            </div>

            <!-- Notifications push (native only) -->
            <div v-if="isNativePlatform" class="flex items-center justify-between p-3">
              <div>
                <span class="text-primary-800 dark:text-primary-200">Notifications push</span>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">Recevez des notifications sur votre appareil</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="pushEnabled" class="sr-only peer" />
                <div class="w-11 h-6 bg-primary-200 dark:bg-primary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-sand-500 peer-checked:to-sand-600"></div>
              </label>
            </div>

            <div class="border-t border-primary-100 dark:border-primary-800 my-2"></div>

            <!-- Rappel d'inactivite -->
            <div class="flex items-center justify-between p-3">
              <div>
                <span class="text-primary-800 dark:text-primary-200">Rappel d'inactivité</span>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">Notification si pas d'entraînement</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="reminderEnabled" class="sr-only peer" />
                <div class="w-11 h-6 bg-primary-200 dark:bg-primary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-sand-500 peer-checked:to-sand-600"></div>
              </label>
            </div>

            <div v-if="reminderEnabled" class="flex items-center justify-between p-3 pl-6">
              <span class="text-primary-600 dark:text-primary-400 text-sm">Après combien de jours</span>
              <div class="flex items-center gap-2">
                <button @click="inactivityDays = Math.max(1, inactivityDays - 1)" class="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 flex items-center justify-center transition-colors">
                  <svg class="w-3 h-3 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                  </svg>
                </button>
                <span class="text-primary-900 dark:text-primary-100 font-medium w-10 text-center">{{ inactivityDays }}j</span>
                <button @click="inactivityDays = Math.min(14, inactivityDays + 1)" class="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 flex items-center justify-center transition-colors">
                  <svg class="w-3 h-3 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- A propos -->
        <div class="card-glass">
          <h2 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-5 flex items-center gap-3">
            <div class="w-10 h-10 md:w-8 md:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            A propos
          </h2>
          <div class="space-y-1">
            <div class="flex items-center justify-between p-3">
              <span class="text-primary-800 dark:text-primary-200">Version</span>
              <span class="text-primary-500 dark:text-primary-400 text-sm">1.0.0</span>
            </div>
            <div class="flex items-center justify-between p-3">
              <span class="text-primary-800 dark:text-primary-200">Confidentialite</span>
              <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Exporter mes donnees -->
        <div class="card-glass">
          <h2 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-5 flex items-center gap-3">
            <div class="w-10 h-10 md:w-8 md:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            Exporter mes donnees
          </h2>
          <div class="space-y-1">
            <div class="flex items-center justify-between p-3">
              <div>
                <span class="text-primary-800 dark:text-primary-200">Historique des seances</span>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">Export CSV de toutes vos seances terminees</p>
              </div>
              <button
                @click="exportCsv"
                :disabled="exporting"
                class="px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {{ exporting ? 'Export...' : 'Telecharger CSV' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Sante (native only) -->
        <div v-if="isNativePlatform" class="card-glass">
          <h2 class="text-lg font-semibold text-primary-900 dark:text-primary-100 mb-5 flex items-center gap-3">
            <div class="w-10 h-10 md:w-8 md:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            Sante
          </h2>
          <div class="space-y-1">
            <div class="flex items-center justify-between p-3">
              <div>
                <span class="text-primary-800 dark:text-primary-200">Synchroniser avec Apple Sante / Health Connect</span>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">Enregistrez vos seances et donnees corporelles</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="healthSyncEnabled" class="sr-only peer" />
                <div class="w-11 h-6 bg-primary-200 dark:bg-primary-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-sand-500 peer-checked:to-sand-600"></div>
              </label>
            </div>
            <div class="flex items-center justify-between p-3">
              <div>
                <span class="text-primary-800 dark:text-primary-200">Synchroniser l'historique</span>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">Exporter toutes vos seances passees</p>
              </div>
              <button
                @click="syncHealthHistory"
                :disabled="syncingHealth"
                class="px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {{ syncingHealth ? 'Sync...' : 'Synchroniser' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Zone danger -->
        <div class="space-y-3">
          <button
            @click="handleLogout"
            class="w-full py-4 rounded-2xl border-2 border-primary-200 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 font-medium"
          >
            Se deconnecter
          </button>
          <button
            @click="showDeleteConfirm = true"
            class="w-full py-4 rounded-2xl border-2 border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-300 dark:hover:border-red-700 hover:text-red-600 transition-all duration-300 font-medium"
          >
            Supprimer mon compte
          </button>
        </div>

        <!-- Modale confirmation suppression -->
        <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center px-6" @click.self="showDeleteConfirm = false">
          <div class="fixed inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div class="relative bg-white dark:bg-primary-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <div class="text-center">
              <div class="w-14 h-14 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">Supprimer le compte</h3>
              <p class="text-primary-600 dark:text-primary-400 text-sm mb-6">Cette action est irreversible. Toutes vos donnees seront supprimees definitivement.</p>
              <div class="space-y-3">
                <button
                  @click="handleDeleteAccount"
                  :disabled="deleting"
                  class="w-full py-3 rounded-2xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {{ deleting ? 'Suppression...' : 'Confirmer la suppression' }}
                </button>
                <button
                  @click="showDeleteConfirm = false"
                  class="w-full py-3 rounded-2xl bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 font-medium hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Retour au dashboard -->
      <div class="text-center mt-8">
        <NuxtLink to="/dashboard" class="text-sm md:text-base text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors inline-flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Retour au dashboard
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopNav from '~/components/TopNav.vue'
import { useAuthStore } from '~/stores/auth'
import { useSocialApi } from '~/composables/useSocialApi'
import { Capacitor } from '@capacitor/core'

definePageMeta({
  layout: false,
  middleware: 'auth'
})

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const authStore = useAuthStore()
const colorMode = useColorMode()

const weightUnit = ref('kg')
const restTimer = ref(90)
const notifPR = ref(true)
const notifStreak = ref(true)
const notifGoals = ref(true)
const reminderEnabled = ref(true)
const inactivityDays = ref(3)
const pushEnabled = ref(false)
const healthSyncEnabled = ref(false)
const syncingHealth = ref(false)
const isNativePlatform = ref(false)
const showDeleteConfirm = ref(false)
const deleting = ref(false)
const exporting = ref(false)

// Social profile
const { getRequests } = useSocialApi()
const pendingRequestsCount = ref(0)

const exportCsv = async () => {
  exporting.value = true
  try {
    const config = useRuntimeConfig()
    const blob = await $fetch(`${config.public.apiUrl}/workouts/export/csv`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
      responseType: 'blob'
    })
    const url = URL.createObjectURL(blob as Blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'athletiq-export.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Export CSV error:', error)
  } finally {
    exporting.value = false
  }
}
const setTheme = (theme: string) => {
  colorMode.preference = theme
}

let settingsTimeout: ReturnType<typeof setTimeout> | null = null
const debouncedSave = (key: string, value: string) => {
  if (settingsTimeout) clearTimeout(settingsTimeout)
  settingsTimeout = setTimeout(() => {
    try { localStorage.setItem(key, value) } catch (error) { logger.error('Failed to persist setting:', error) }
  }, 500)
}

let syncTimeout: ReturnType<typeof setTimeout> | null = null
const debouncedSyncReminder = () => {
  if (syncTimeout) clearTimeout(syncTimeout)
  syncTimeout = setTimeout(() => {
    syncReminderSettings()
  }, 500)
}

const togglePush = async (enabled: boolean) => {
  if (enabled) {
    try {
      const { PushNotifications } = await import('@capacitor/push-notifications')
      const permResult = await PushNotifications.requestPermissions()
      if (permResult.receive !== 'granted') {
        pushEnabled.value = false
        return
      }
      await PushNotifications.register()
    } catch (error) {
      logger.error('Push toggle error:', error)
      pushEnabled.value = false
    }
  } else {
    try {
      const savedToken = localStorage.getItem('fcmToken')
      if (savedToken) {
        const { useFcmTokenApi } = await import('~/composables/useFcmTokenApi')
        const { removeToken } = useFcmTokenApi()
        await removeToken(savedToken)
        localStorage.removeItem('fcmToken')
      }
    } catch (error) {
      logger.error('Push token removal error:', error)
    }
  }
}

const syncHealthHistory = async () => {
  syncingHealth.value = true
  try {
    const { useHealthSync } = await import('~/composables/useHealthSync')
    const healthSync = useHealthSync()
    const available = await healthSync.isAvailable()
    if (!available) {
      const toast = useToast()
      toast.error('Sante non disponible', 'Le service de sante n\'est pas disponible sur cet appareil')
      syncingHealth.value = false
      return
    }
    const granted = await healthSync.requestPermissions()
    if (!granted) {
      const toast = useToast()
      toast.error('Permissions refusees', 'Veuillez autoriser l\'acces aux donnees de sante')
      syncingHealth.value = false
      return
    }
    // Fetch all completed workouts
    const config = useRuntimeConfig()
    const data = await $fetch<{ workouts: any[] }>(`${config.public.apiUrl}/workouts`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
      timeout: 30000
    })
    const completedWorkouts = (data.workouts || []).filter((w: any) => w.status === 'completed' && w.startedAt && w.completedAt)
    const result = await healthSync.syncAllWorkouts(completedWorkouts.map((w: any) => ({
      name: w.name,
      startedAt: w.startedAt,
      completedAt: w.completedAt,
      durationMinutes: w.durationMinutes,
      caloriesBurned: w.caloriesBurned,
    })))
    const toast = useToast()
    toast.success('Synchronisation terminee', `${result.synced} seance(s) synchronisee(s)`)
  } catch (error) {
    logger.error('Health history sync error:', error)
    const toast = useToast()
    toast.error('Erreur de synchronisation')
  } finally {
    syncingHealth.value = false
  }
}

onBeforeUnmount(() => {
  if (settingsTimeout) clearTimeout(settingsTimeout)
  if (syncTimeout) clearTimeout(syncTimeout)
})

const handleLogout = () => {
  authStore.logout()
  navigateTo('/login')
}

const handleDeleteAccount = async () => {
  deleting.value = true
  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiUrl}/users/me`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` },
      timeout: 30000
    })
    authStore.logout()
    navigateTo('/')
  } catch (error) {
    logger.error('Delete account error:', error)
    deleting.value = false
  }
}

onMounted(async () => {
  if (process.client) {
    isNativePlatform.value = Capacitor.isNativePlatform()
    try {
      weightUnit.value = localStorage.getItem('pref_weight_unit') || 'kg'
      restTimer.value = parseInt(localStorage.getItem('pref_rest_timer') || '90')
      notifPR.value = localStorage.getItem('pref_notif_pr') !== 'false'
      notifStreak.value = localStorage.getItem('pref_notif_streak') !== 'false'
      notifGoals.value = localStorage.getItem('pref_notif_goals') !== 'false'
      reminderEnabled.value = localStorage.getItem('pref_reminder_enabled') !== 'false'
      inactivityDays.value = parseInt(localStorage.getItem('pref_inactivity_days') || '3')
      pushEnabled.value = localStorage.getItem('pushEnabled') !== 'false' && isNativePlatform.value
      healthSyncEnabled.value = localStorage.getItem('healthSyncEnabled') === 'true'
    } catch (error) {
      logger.error('Failed to load local settings:', error)
    }
  }

  // Also sync with backend
  try {
    const config = useRuntimeConfig()
    const user = await $fetch<any>(`${config.public.apiUrl}/users/me`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
      timeout: 30000
    })
    if (user.reminderEnabled !== undefined) reminderEnabled.value = user.reminderEnabled
    if (user.inactivityThresholdDays) inactivityDays.value = user.inactivityThresholdDays
  } catch (err) { logger.error('Settings sync failed:', err) }

  // Load pending friend requests count
  try {
    const reqData = await getRequests() as any
    const pending = reqData?.received || reqData?.pending || []
    pendingRequestsCount.value = Array.isArray(pending) ? pending.length : 0
  } catch (error) {
    logger.error('Failed to load pending requests count:', error)
    pendingRequestsCount.value = 0
  }
})

watch(weightUnit, (val) => {
  if (process.client) debouncedSave('pref_weight_unit', val)
})

watch(restTimer, (val) => {
  if (process.client) debouncedSave('pref_rest_timer', String(val))
})

watch(notifPR, (val) => {
  if (process.client) debouncedSave('pref_notif_pr', String(val))
})

watch(notifStreak, (val) => {
  if (process.client) debouncedSave('pref_notif_streak', String(val))
})

watch(notifGoals, (val) => {
  if (process.client) debouncedSave('pref_notif_goals', String(val))
})

watch(reminderEnabled, (val) => {
  if (process.client) debouncedSave('pref_reminder_enabled', String(val))
  debouncedSyncReminder()
})

watch(inactivityDays, (val) => {
  if (process.client) debouncedSave('pref_inactivity_days', String(val))
  debouncedSyncReminder()
})

watch(pushEnabled, (val) => {
  if (process.client) {
    localStorage.setItem('pushEnabled', String(val))
    togglePush(val)
  }
})

watch(healthSyncEnabled, async (val) => {
  if (process.client) {
    localStorage.setItem('healthSyncEnabled', String(val))
    if (val) {
      try {
        const { useHealthSync } = await import('~/composables/useHealthSync')
        const healthSync = useHealthSync()
        const available = await healthSync.isAvailable()
        if (!available) {
          healthSyncEnabled.value = false
          const toast = useToast()
          toast.error('Sante non disponible')
          return
        }
        const granted = await healthSync.requestPermissions()
        if (!granted) {
          healthSyncEnabled.value = false
          const toast = useToast()
          toast.error('Permissions refusees')
        }
      } catch (error) {
        logger.error('Health sync initialization failed:', error)
        healthSyncEnabled.value = false
      }
    }
  }
})

const syncReminderSettings = async () => {
  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiUrl}/users/me`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      timeout: 30000,
      body: {
        reminderEnabled: reminderEnabled.value,
        inactivityThresholdDays: inactivityDays.value
      }
    })
  } catch (err) { logger.error('Settings sync failed:', err) }
}
</script>
