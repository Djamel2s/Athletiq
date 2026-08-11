<template>
  <div class="min-h-screen bg-primary-50 dark:bg-primary-900">
    <div class="max-w-3xl mx-auto px-4 py-12 md:py-20">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 text-sm text-primary-500 hover:text-primary-700 dark:hover:text-primary-300 mb-8 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {{ t('common.back') }}
      </NuxtLink>

      <h1 class="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100 mb-8">
        {{ t('legal.mentions.title') }}
      </h1>
      <p class="text-sm text-primary-500 dark:text-primary-400 mb-8">
        {{ t('legal.lastUpdated') }}
      </p>

      <div
        v-if="locale === 'fr'"
        class="prose prose-primary dark:prose-invert max-w-none space-y-6 text-primary-700 dark:text-primary-300"
      >
        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            1. Éditeur de l'application
          </h2>
          <p>L'application Athletiq est éditée par :</p>
          <div class="bg-primary-100 dark:bg-primary-800 rounded-xl p-4 mt-2">
            <p><strong>Athletiq</strong></p>
            <p>Email : contact@athletiq.fr</p>
            <p class="text-sm text-primary-500 dark:text-primary-400 mt-2 italic">
              Les informations complètes (raison sociale, SIRET, adresse) seront ajoutées lors de
              l'immatriculation de la société.
            </p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            2. Hébergement
          </h2>
          <div class="bg-primary-100 dark:bg-primary-800 rounded-xl p-4 mt-2">
            <p><strong>Frontend :</strong> Vercel Inc. — San Francisco, CA, USA</p>
            <p><strong>Backend :</strong> Render Services Inc. — San Francisco, CA, USA</p>
            <p><strong>Base de données :</strong> Neon Inc. — San Francisco, CA, USA</p>
            <p><strong>Stockage médias :</strong> Cloudinary Ltd. — Santa Clara, CA, USA</p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            3. Directeur de la publication
          </h2>
          <p>Le directeur de la publication est le représentant légal de la société éditrice.</p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            4. Propriété intellectuelle
          </h2>
          <p>
            L'ensemble du contenu de l'application Athletiq (textes, images, graphismes, logo,
            icônes, code source) est la propriété exclusive de l'éditeur, sauf mention contraire.
            Toute reproduction, représentation ou diffusion, en tout ou partie, du contenu de ce
            site est interdite sans autorisation préalable.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            5. Données personnelles
          </h2>
          <p>
            Pour toute information relative à la collecte et au traitement de vos données
            personnelles, veuillez consulter notre
            <NuxtLink to="/legal/privacy" class="text-sand-600 hover:underline font-medium"
              >Politique de Confidentialité</NuxtLink
            >.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            6. Contact
          </h2>
          <p>Pour toute question ou réclamation : <strong>contact@athletiq.fr</strong></p>
        </section>
      </div>
      <div
        v-else
        class="prose prose-primary dark:prose-invert max-w-none space-y-6 text-primary-700 dark:text-primary-300"
      >
        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            1. Application publisher
          </h2>
          <p>The Athletiq application is published by:</p>
          <div class="bg-primary-100 dark:bg-primary-800 rounded-xl p-4 mt-2">
            <p><strong>Athletiq</strong></p>
            <p>Email: contact@athletiq.fr</p>
            <p class="text-sm text-primary-500 dark:text-primary-400 mt-2 italic">
              Full company details (legal name, registration number, address) will be added once the
              company is registered.
            </p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            2. Hosting
          </h2>
          <div class="bg-primary-100 dark:bg-primary-800 rounded-xl p-4 mt-2">
            <p><strong>Frontend:</strong> Vercel Inc. — San Francisco, CA, USA</p>
            <p><strong>Backend:</strong> Render Services Inc. — San Francisco, CA, USA</p>
            <p><strong>Database:</strong> Neon Inc. — San Francisco, CA, USA</p>
            <p><strong>Media storage:</strong> Cloudinary Ltd. — Santa Clara, CA, USA</p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            3. Publication director
          </h2>
          <p>The publication director is the legal representative of the publishing company.</p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            4. Intellectual property
          </h2>
          <p>
            All content of the Athletiq application (text, images, graphics, logo, icons, source
            code) is the exclusive property of the publisher, unless stated otherwise. Any
            reproduction, representation, or distribution, in whole or in part, of this site's
            content is prohibited without prior authorization.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            5. Personal data
          </h2>
          <p>
            For any information regarding the collection and processing of your personal data,
            please consult our
            <NuxtLink to="/legal/privacy" class="text-sand-600 hover:underline font-medium"
              >Privacy Policy</NuxtLink
            >.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            6. Contact
          </h2>
          <p>For any question or complaint: <strong>contact@athletiq.fr</strong></p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useLocale();
</script>
