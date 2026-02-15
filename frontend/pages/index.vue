<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div class="max-w-7xl mx-auto px-6 py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <!-- Logo icône (mobile uniquement) -->
            <img src="/athletiq-icon.svg" alt="Athletiq" class="h-14 w-auto md:hidden transition-transform duration-300 hover:scale-105" />
            <!-- Logo texte (desktop) -->
            <img src="/sans-serif-transparent.svg" alt="Athletiq" class="hidden md:block h-12 lg:h-12 xl:h-12 w-auto transition-transform duration-300 hover:scale-105" />
          </div>

          <div class="hidden md:flex items-center space-x-8">
            <a href="#features" class="text-primary-600 hover:text-primary-900 transition-all duration-300 font-medium text-lg relative group">
              Fonctionnalités
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <!-- Si connecté -->
            <template v-if="authStore.isAuthenticated">
              <NuxtLink to="/dashboard" class="btn-glass text-base px-7 py-3">Dashboard</NuxtLink>
              <button @click="logout" class="btn-primary text-base px-7 py-3">Déconnexion</button>
            </template>
            <!-- Si non connecté -->
            <template v-else>
              <NuxtLink to="/login" class="btn-glass text-base px-7 py-3">Connexion</NuxtLink>
              <NuxtLink to="/register" class="btn-primary text-base px-7 py-3">Commencer</NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-48 pb-40 px-6 geometric-bg">
      <div class="max-w-7xl mx-auto">
        <div class="text-center fade-in max-w-4xl mx-auto">
          <h1 class="text-6xl md:text-8xl font-bold mb-10 text-display text-primary-900">
            Suivi intelligent
            <span class="block text-gradient-primary mt-2">d'entraînements</span>
          </h1>
          <p class="text-xl md:text-2xl text-primary-600 mb-14 max-w-2xl mx-auto text-body-relaxed">
            Transformez chaque entraînement en données mesurables pour progresser plus vite
          </p>

          <div class="flex items-center justify-center gap-5 flex-wrap">
            <NuxtLink :to="authStore.isAuthenticated ? '/dashboard' : '/register'" class="btn-primary text-lg px-12 py-5 pulse-soft">
              {{ authStore.isAuthenticated ? 'Aller au Dashboard' : 'Commencer gratuitement' }}
            </NuxtLink>
            <a href="#features" class="btn-outline text-lg px-12 py-5">
              Découvrir
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-40 px-6">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-24 fade-in">
          <h2 class="text-5xl md:text-6xl font-bold mb-8 text-display text-primary-900">Fonctionnalités</h2>
          <p class="text-xl md:text-2xl text-primary-600 max-w-2xl mx-auto text-body-relaxed">
            Tout ce dont vous avez besoin pour progresser
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 slide-up">
          <div class="card-glass group">
            <div class="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-8 icon-container">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold mb-4 text-primary-900">Suivi précis</h3>
            <p class="text-primary-600 text-body-relaxed">
              Enregistrez chaque série, répétition et poids pour suivre votre progression
            </p>
          </div>

          <div class="card-glass group">
            <div class="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-8 icon-container">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold mb-4 text-primary-900">Analyse intelligente</h3>
            <p class="text-primary-600 text-body-relaxed">
              Graphiques d'évolution et suggestions personnalisées
            </p>
          </div>

          <div class="card-glass group">
            <div class="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-8 icon-container">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold mb-4 text-primary-900">Timelapse photo</h3>
            <p class="text-primary-600 text-body-relaxed">
              Visualisez votre transformation physique dans le temps
            </p>
          </div>

          <div class="card-glass group">
            <div class="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-8 icon-container">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold mb-4 text-primary-900">Objectifs personnalisés</h3>
            <p class="text-primary-600 text-body-relaxed">
              Définissez vos objectifs et suivez votre progression
            </p>
          </div>

          <div class="card-glass group">
            <div class="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-8 icon-container">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold mb-4 text-primary-900">Multi-plateforme</h3>
            <p class="text-primary-600 text-body-relaxed">
              Accessible sur web et mobile avec synchronisation
            </p>
          </div>

          <div class="card-glass group">
            <div class="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-8 icon-container">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h3 class="text-2xl font-semibold mb-4 text-primary-900">Données sécurisées</h3>
            <p class="text-primary-600 text-body-relaxed">
              Vos données sont cryptées et sauvegardées automatiquement
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-40 px-6">
      <div class="max-w-4xl mx-auto">
        <div class="card-glass text-center p-20 float">
          <h2 class="text-5xl md:text-6xl font-bold mb-8 text-display text-primary-900">
            {{ authStore.isAuthenticated ? 'Continuez votre progression' : 'Prêt à commencer ?' }}
          </h2>
          <p class="text-xl md:text-2xl text-primary-600 mb-12 max-w-2xl mx-auto text-body-relaxed">
            {{ authStore.isAuthenticated ? 'Accédez à votre tableau de bord pour suivre vos entraînements' : 'Créez votre compte gratuitement et commencez à suivre vos entraînements' }}
          </p>
          <NuxtLink :to="authStore.isAuthenticated ? '/dashboard' : '/register'" class="btn-primary text-lg px-14 py-6 pulse-soft">
            {{ authStore.isAuthenticated ? 'Dashboard' : 'Créer un compte gratuit' }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-sand-200 py-20 px-6">
      <div class="max-w-7xl mx-auto text-center">
        <p class="text-primary-500 text-lg">&copy; 2024 Athletiq</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  authStore.loadFromLocalStorage()
})

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
