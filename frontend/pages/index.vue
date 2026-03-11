<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div class="max-w-7xl mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <img src="/athletiq-icon.svg" alt="Athletiq" class="h-14 w-auto md:hidden transition-transform duration-300 hover:scale-105" />
            <img src="/athletiq-full-icon.svg" alt="Athletiq" class="hidden md:block h-12 w-auto transition-transform duration-300 hover:scale-105" />
          </div>

          <!-- Mobile buttons -->
          <div class="flex md:hidden items-center space-x-3">
            <template v-if="authStore.isAuthenticated">
              <NuxtLink to="/dashboard" class="btn-primary text-sm px-4 py-2">Dashboard</NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="btn-glass text-sm px-4 py-2">Connexion</NuxtLink>
              <NuxtLink to="/register" class="btn-primary text-sm px-4 py-2">Commencer</NuxtLink>
            </template>
          </div>

          <!-- Desktop nav -->
          <div class="hidden md:flex items-center space-x-8">
            <a href="#features" class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-all duration-300 font-medium text-lg relative group">
              Fonctionnalites
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#pricing" class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-all duration-300 font-medium text-lg relative group">
              Tarifs
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <template v-if="authStore.isAuthenticated">
              <NuxtLink to="/dashboard" class="btn-glass text-base px-7 py-3">Dashboard</NuxtLink>
              <button @click="logout" class="btn-primary text-base px-7 py-3">Deconnexion</button>
            </template>
            <template v-else>
              <NuxtLink to="/login" class="btn-glass text-base px-7 py-3">Connexion</NuxtLink>
              <NuxtLink to="/register" class="btn-primary text-base px-7 py-3">Commencer</NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero -->
    <section class="pt-28 md:pt-40 pb-16 md:pb-28 px-6 geometric-bg">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div class="fade-in text-center lg:text-left">
            <p class="text-sm md:text-base font-semibold text-[#b8a48f] dark:text-[#d4c4b0] uppercase tracking-wider mb-4">Suivi de musculation</p>
            <h1 class="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 md:mb-8 text-display text-primary-900 dark:text-primary-100 leading-tight">
              Chaque serie<br>
              compte.<br>
              <span class="text-gradient-primary">Suivez-les.</span>
            </h1>
            <p class="text-lg md:text-xl text-primary-600 dark:text-primary-400 mb-8 md:mb-10 max-w-lg mx-auto lg:mx-0">
              Athletiq enregistre vos entrainements, mesure votre progression et vous montre concretement ce qui fonctionne. 14 jours d'essai, sans carte bancaire.
            </p>

            <div class="flex items-center justify-center lg:justify-start gap-3 md:gap-5 flex-wrap">
              <NuxtLink :to="authStore.isAuthenticated ? '/dashboard' : '/register'" class="btn-primary text-base md:text-lg px-8 md:px-12 py-4 md:py-5">
                {{ authStore.isAuthenticated ? 'Aller au Dashboard' : 'Essayer gratuitement' }}
              </NuxtLink>
              <NuxtLink to="/login" class="btn-glass text-base md:text-lg px-8 md:px-10 py-4 md:py-5">
                Compte demo
              </NuxtLink>
            </div>
          </div>

          <!-- Visual hero -->
          <div class="relative h-80 md:h-96 lg:h-[28rem] slide-up hidden md:flex flex-col items-center justify-center">
            <div class="relative flex-1 w-full flex items-center justify-center">
              <img
                src="/athletiq-icon.svg"
                alt="Athletiq"
                class="h-full max-h-[18rem] w-auto object-contain drop-shadow-2xl opacity-30"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Ce que fait Athletiq — layout asymetrique -->
    <section id="features" class="py-16 md:py-28 px-4 md:px-6">
      <div class="max-w-6xl mx-auto">
        <!-- Bloc principal : suivi en temps reel -->
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 mb-6 md:mb-8">
          <div class="lg:col-span-3 card-glass group !p-8 md:!p-10">
            <div class="flex items-start gap-5 mb-5">
              <div class="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100 mb-3">Pendant votre seance</h3>
                <p class="text-primary-600 dark:text-primary-400 text-lg leading-relaxed">
                  Chrono, timer de repos, suivi serie par serie. Vous tapez vos poids et vos reps, Athletiq s'occupe du reste. Pas besoin d'un carnet.
                </p>
              </div>
            </div>
            <!-- Mini mockup -->
            <div class="glass rounded-xl p-4 mt-2">
              <div class="flex items-center justify-between mb-3">
                <span class="text-sm font-semibold text-primary-900 dark:text-primary-100">Squat</span>
                <span class="text-xs text-primary-500 dark:text-primary-400">Repos : 1:42</span>
              </div>
              <div class="space-y-2">
                <div class="flex items-center gap-3 text-sm">
                  <span class="w-6 text-primary-400">1</span>
                  <span class="font-medium text-primary-900 dark:text-primary-100">100 kg</span>
                  <span class="text-primary-500">x</span>
                  <span class="font-medium text-primary-900 dark:text-primary-100">8 reps</span>
                  <svg class="w-4 h-4 text-green-500 ml-auto" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <div class="flex items-center gap-3 text-sm">
                  <span class="w-6 text-primary-400">2</span>
                  <span class="font-medium text-primary-900 dark:text-primary-100">100 kg</span>
                  <span class="text-primary-500">x</span>
                  <span class="font-medium text-primary-900 dark:text-primary-100">7 reps</span>
                  <svg class="w-4 h-4 text-green-500 ml-auto" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                </div>
                <div class="flex items-center gap-3 text-sm opacity-50">
                  <span class="w-6 text-primary-400">3</span>
                  <span class="text-primary-400">— kg x — reps</span>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2 card-glass group !p-8 md:!p-10 flex flex-col justify-between">
            <div>
              <div class="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center mb-5">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-3">Apres votre seance</h3>
              <p class="text-primary-600 dark:text-primary-400 leading-relaxed">
                Volume total, records personnels battus, graphiques de progression par exercice. Vous voyez si vous avez fait mieux que la derniere fois.
              </p>
            </div>
            <div class="mt-6 flex items-end gap-1 h-16">
              <div class="w-full bg-[#d4c4b0]/20 rounded-t" style="height: 30%"></div>
              <div class="w-full bg-[#d4c4b0]/30 rounded-t" style="height: 45%"></div>
              <div class="w-full bg-[#d4c4b0]/40 rounded-t" style="height: 40%"></div>
              <div class="w-full bg-[#d4c4b0]/50 rounded-t" style="height: 55%"></div>
              <div class="w-full bg-[#d4c4b0]/60 rounded-t" style="height: 65%"></div>
              <div class="w-full bg-[#d4c4b0]/70 rounded-t" style="height: 60%"></div>
              <div class="w-full bg-[#d4c4b0]/80 rounded-t" style="height: 75%"></div>
              <div class="w-full bg-gradient-primary rounded-t" style="height: 90%"></div>
            </div>
          </div>
        </div>

        <!-- 4 features en grille variee -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div class="card-glass group !p-7">
            <div class="flex items-start gap-4">
              <div class="w-11 h-11 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-1">Suivi corporel</h3>
                <p class="text-primary-600 dark:text-primary-400 text-sm leading-relaxed">
                  Poids, mensurations, photos de progression. Comparez vos photos avant/apres et suivez votre transformation semaine apres semaine.
                </p>
              </div>
            </div>
          </div>

          <div class="card-glass group !p-7">
            <div class="flex items-start gap-4">
              <div class="w-11 h-11 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-1">Objectifs</h3>
                <p class="text-primary-600 dark:text-primary-400 text-sm leading-relaxed">
                  "Squatter 140 kg", "Perdre 5 kg", "Atteindre 12% de bodyfat". Posez un objectif, Athletiq mesure ou vous en etes.
                </p>
              </div>
            </div>
          </div>

          <div class="card-glass group !p-7">
            <div class="flex items-start gap-4">
              <div class="w-11 h-11 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-1">Calendrier & streaks</h3>
                <p class="text-primary-600 dark:text-primary-400 text-sm leading-relaxed">
                  Un heatmap de votre activite et un compteur de jours consecutifs. Ca motive de ne pas casser la serie.
                </p>
              </div>
            </div>
          </div>

          <div class="card-glass group !p-7">
            <div class="flex items-start gap-4">
              <div class="w-11 h-11 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-1">Partage Instagram</h3>
                <p class="text-primary-600 dark:text-primary-400 text-sm leading-relaxed">
                  Generez une image Story avec vos stats de seance en un clic. Le design est deja fait, vous avez juste a poster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Social proof rapide — pas de grille identique, juste une ligne -->
    <section class="py-6 md:py-10 px-4 md:px-6">
      <div class="max-w-4xl mx-auto">
        <div class="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm md:text-base text-primary-500 dark:text-primary-400">
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4 text-[#b8a48f]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            Optimise mobile
          </span>
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4 text-[#b8a48f]" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            Donnees securisees
          </span>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section id="pricing" class="py-16 md:py-28 px-4 md:px-6 geometric-bg">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-10 md:mb-14">
          <h2 class="text-3xl md:text-5xl font-bold mb-4 text-display text-primary-900 dark:text-primary-100">
            Gratuit pour commencer, Pro pour aller plus loin
          </h2>
          <p class="text-lg md:text-xl text-primary-600 dark:text-primary-400 max-w-xl mx-auto">
            Utilisez Athletiq gratuitement avec des limites, ou passez Pro pour tout debloquer. 14 jours d'essai Pro offerts.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
          <!-- Free -->
          <div class="card-glass text-center">
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">Gratuit</h3>
            <div class="flex items-baseline justify-center gap-1 mb-2">
              <span class="text-4xl md:text-5xl font-bold text-primary-900 dark:text-primary-100">0€</span>
            </div>
            <p class="text-sm text-primary-500 dark:text-primary-400 mb-6">Pour toujours</p>
            <ul class="space-y-3 mb-8 text-left text-sm">
              <li class="flex items-center gap-3 text-primary-700 dark:text-primary-300">
                <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                2 seances / semaine
              </li>
              <li class="flex items-center gap-3 text-primary-700 dark:text-primary-300">
                <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                2 templates de workout
              </li>
              <li class="flex items-center gap-3 text-primary-700 dark:text-primary-300">
                <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                Historique 30 jours
              </li>
              <li class="flex items-center gap-3 text-primary-700 dark:text-primary-300">
                <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                3 photos, 1 objectif
              </li>
            </ul>
            <NuxtLink to="/register" class="btn-outline w-full text-base py-4">
              S'inscrire
            </NuxtLink>
          </div>

          <!-- Monthly -->
          <div class="card-glass text-center">
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">Mensuel</h3>
            <div class="flex items-baseline justify-center gap-1 mb-2">
              <span class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#d4c4b0] to-[#9d8569] bg-clip-text text-transparent">9,99€</span>
              <span class="text-primary-500 dark:text-primary-400">/mois</span>
            </div>
            <p class="text-sm text-primary-500 dark:text-primary-400 mb-6">Sans engagement</p>
            <ul class="space-y-3 mb-8 text-left text-sm">
              <li class="flex items-center gap-3 text-primary-700 dark:text-primary-300">
                <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                Seances illimitees
              </li>
              <li class="flex items-center gap-3 text-primary-700 dark:text-primary-300">
                <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                Templates illimites
              </li>
              <li class="flex items-center gap-3 text-primary-700 dark:text-primary-300">
                <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                Historique complet
              </li>
              <li class="flex items-center gap-3 text-primary-700 dark:text-primary-300">
                <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                Photos & objectifs illimites
              </li>
            </ul>
            <NuxtLink to="/register" class="btn-outline w-full text-base py-4">
              14 jours d'essai gratuit
            </NuxtLink>
          </div>

          <!-- Yearly -->
          <div class="card-glass text-center relative border-2 border-[#d4c4b0]/50">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-primary text-white text-xs font-bold rounded-full whitespace-nowrap">
              2 mois offerts
            </div>
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">Annuel</h3>
            <div class="flex items-baseline justify-center gap-1 mb-1">
              <span class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#d4c4b0] to-[#9d8569] bg-clip-text text-transparent">79,99€</span>
              <span class="text-primary-500 dark:text-primary-400">/an</span>
            </div>
            <p class="text-sm text-primary-500 dark:text-primary-400 mb-6">6,66€/mois — 33% d'economie</p>
            <ul class="space-y-3 mb-8 text-left text-sm">
              <li class="flex items-center gap-3 text-primary-700 dark:text-primary-300">
                <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                Tout le plan mensuel
              </li>
              <li class="flex items-center gap-3 text-primary-700 dark:text-primary-300">
                <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                Le prix de 2 cafes par mois
              </li>
              <li class="flex items-center gap-3 text-primary-700 dark:text-primary-300">
                <svg class="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                Ideal si vous etes regulier
              </li>
            </ul>
            <NuxtLink to="/register" class="btn-primary w-full text-base py-4">
              14 jours d'essai gratuit
            </NuxtLink>
          </div>
        </div>

        <p class="text-center text-xs text-primary-400 dark:text-primary-500 mt-6">
          Carte bancaire, Apple Pay, Google Pay. Paiement securise via Stripe.
        </p>
      </div>
    </section>

    <!-- Demo -->
    <section class="py-16 md:py-24 px-4 md:px-6">
      <div class="max-w-3xl mx-auto">
        <div class="card-glass !p-8 md:!p-12 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div class="flex-1">
            <h2 class="text-2xl md:text-3xl font-bold text-primary-900 dark:text-primary-100 mb-3">Pas convaincu ? Testez.</h2>
            <p class="text-primary-600 dark:text-primary-400 mb-4">
              Un compte demo est deja rempli avec des donnees : seances, stats, objectifs, photos. Explorez sans creer de compte.
            </p>
            <p class="text-sm text-primary-500 dark:text-primary-400 font-mono glass rounded-lg inline-block px-3 py-1.5">
              demo@athletiq.app / Athletiq!Demo2025
            </p>
          </div>
          <NuxtLink to="/login" class="btn-primary text-base px-8 py-4 flex-shrink-0 w-full md:w-auto text-center">
            Voir le demo
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="py-16 md:py-24 px-4 md:px-6 geometric-bg">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-display text-primary-900 dark:text-primary-100">
          {{ authStore.isAuthenticated ? 'Votre dashboard vous attend' : 'Vous allez quand meme pas noter vos series sur votre telephone dans Notes ?' }}
        </h2>
        <p class="text-lg text-primary-600 dark:text-primary-400 mb-8 max-w-xl mx-auto">
          {{ authStore.isAuthenticated ? '' : '14 jours gratuits. Sans carte bancaire. Ca prend 30 secondes.' }}
        </p>
        <NuxtLink :to="authStore.isAuthenticated ? '/dashboard' : '/register'" class="btn-primary text-base md:text-lg px-10 md:px-14 py-4 md:py-5">
          {{ authStore.isAuthenticated ? 'Dashboard' : 'Creer mon compte' }}
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-sand-200 dark:border-primary-700 py-10 md:py-14 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <img src="/athletiq-full-icon.svg" alt="Athletiq" class="h-8 w-auto" />
            <span class="text-primary-400 dark:text-primary-500 text-sm">Suivi de musculation</span>
          </div>

          <div class="flex items-center gap-6 text-sm">
            <a href="#features" class="text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">Fonctionnalités</a>
            <a href="#pricing" class="text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">Tarifs</a>
            <NuxtLink to="/legal/cgu" class="text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">CGU</NuxtLink>
            <NuxtLink to="/legal/privacy" class="text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">Confidentialité</NuxtLink>
            <NuxtLink to="/legal/mentions" class="text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors">Mentions légales</NuxtLink>
          </div>

          <p class="text-primary-400 dark:text-primary-500 text-sm">
            &copy; 2025 Athletiq
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

useSeoMeta({
  title: 'Athletiq - Suis ta progression. Prouve-le.',
  ogTitle: 'Athletiq - Suis ta progression. Prouve-le.',
  description: "L'app de musculation qui transforme tes entraînements en résultats. Suivi des séances, progression visuelle, streak et insights personnalisés.",
  ogDescription: "L'app de musculation qui transforme tes entraînements en résultats. Suivi des séances, progression visuelle, streak et insights personnalisés.",
  ogImage: 'https://athletiq.fr/athletiq-og.png',
  ogUrl: 'https://athletiq.fr',
  twitterCard: 'summary_large_image',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Athletiq',
        operatingSystem: 'Web',
        applicationCategory: 'HealthApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR'
        },
        url: 'https://athletiq.fr',
        description: "L'app de musculation qui transforme tes entraînements en résultats. Suivi des séances, progression visuelle, streak et insights personnalisés.",
        author: {
          '@type': 'Organization',
          name: 'Athletiq'
        }
      })
    }
  ]
})

const authStore = useAuthStore()

onMounted(() => {
  authStore.loadFromLocalStorage()
})

const logout = () => {
  authStore.logout()
  navigateTo('/login')
}
</script>

<style scoped>
.hero-figure-enter-active,
.hero-figure-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.hero-figure-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.hero-figure-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
