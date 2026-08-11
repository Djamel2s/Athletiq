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
        {{ t('legal.cgu.title') }}
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
            1. Objet
          </h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation de
            l'application Athletiq, accessible via le web et les applications mobiles. En utilisant
            Athletiq, vous acceptez les présentes CGU dans leur intégralité.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            2. Description du service
          </h2>
          <p>
            Athletiq est une application de suivi d'entraînements de musculation permettant de :
          </p>
          <ul class="list-disc pl-6 space-y-1 mt-2">
            <li>Créer et suivre des séances d'entraînement</li>
            <li>Enregistrer des performances (poids, répétitions, séries)</li>
            <li>Suivre des mesures corporelles et des photos de progression</li>
            <li>Consulter des statistiques et objectifs personnels</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            3. Inscription et compte
          </h2>
          <p>
            L'utilisation d'Athletiq nécessite la création d'un compte. Vous êtes responsable de la
            confidentialité de vos identifiants. Toute activité effectuée depuis votre compte est
            réputée être de votre fait.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            4. Abonnements et tarifs
          </h2>
          <p>
            Athletiq propose un plan gratuit avec des fonctionnalités limitées et des abonnements
            payants (mensuel et annuel) offrant un accès complet. Les tarifs sont indiqués sur la
            page d'abonnement. Les paiements sont traités de manière sécurisée via Stripe.
          </p>
          <p class="mt-2">
            Les abonnements sont renouvelés automatiquement. Vous pouvez annuler à tout moment
            depuis votre espace de gestion. L'annulation prend effet à la fin de la période en
            cours.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            5. Période d'essai
          </h2>
          <p>
            Tout nouvel utilisateur bénéficie d'une période d'essai gratuite de 14 jours donnant
            accès à l'ensemble des fonctionnalités premium. À l'issue de cette période, le compte
            passe automatiquement en plan gratuit si aucun abonnement n'est souscrit.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            6. Utilisation acceptable
          </h2>
          <p>
            Vous vous engagez à utiliser Athletiq de manière conforme aux lois en vigueur et à ne
            pas :
          </p>
          <ul class="list-disc pl-6 space-y-1 mt-2">
            <li>Tenter d'accéder de manière non autorisée au service</li>
            <li>Utiliser le service à des fins frauduleuses</li>
            <li>Publier du contenu illicite via les fonctionnalités de l'application</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            7. Propriété intellectuelle
          </h2>
          <p>
            L'ensemble des éléments composant Athletiq (code, design, marque, contenus) sont
            protégés par le droit de la propriété intellectuelle. Toute reproduction ou utilisation
            non autorisée est strictement interdite.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            8. Limitation de responsabilité
          </h2>
          <p>
            Athletiq est fourni "en l'état". Nous ne garantissons pas l'absence d'interruptions ou
            d'erreurs. Athletiq ne se substitue pas à un avis médical professionnel. Consultez un
            professionnel de santé avant de commencer tout programme d'entraînement.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            9. Résiliation
          </h2>
          <p>
            Vous pouvez supprimer votre compte à tout moment. Nous nous réservons le droit de
            suspendre ou supprimer un compte en cas de violation des présentes CGU.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            10. Modifications
          </h2>
          <p>
            Nous nous réservons le droit de modifier les présentes CGU. Les utilisateurs seront
            informés de toute modification substantielle. L'utilisation continue du service après
            modification vaut acceptation des nouvelles conditions.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            11. Contact
          </h2>
          <p>
            Pour toute question relative aux présentes CGU, vous pouvez nous contacter à l'adresse :
            <strong>contact@athletiq.fr</strong>
          </p>
        </section>
      </div>
      <div
        v-else
        class="prose prose-primary dark:prose-invert max-w-none space-y-6 text-primary-700 dark:text-primary-300"
      >
        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            1. Purpose
          </h2>
          <p>
            These Terms of Use govern the use of the Athletiq application, accessible via the web
            and mobile apps. By using Athletiq, you accept these Terms in their entirety.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            2. Service description
          </h2>
          <p>Athletiq is a strength training tracking app that allows you to:</p>
          <ul class="list-disc pl-6 space-y-1 mt-2">
            <li>Create and track workout sessions</li>
            <li>Log performance (weight, reps, sets)</li>
            <li>Track body measurements and progress photos</li>
            <li>View personal statistics and goals</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            3. Registration and account
          </h2>
          <p>
            Using Athletiq requires creating an account. You are responsible for keeping your
            credentials confidential. Any activity carried out from your account is deemed to be
            your own.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            4. Subscriptions and pricing
          </h2>
          <p>
            Athletiq offers a free plan with limited features and paid subscriptions (monthly and
            annual) offering full access. Pricing is shown on the subscription page. Payments are
            securely processed via Stripe.
          </p>
          <p class="mt-2">
            Subscriptions renew automatically. You can cancel at any time from your account
            settings. Cancellation takes effect at the end of the current period.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            5. Trial period
          </h2>
          <p>
            Every new user gets a free 14-day trial giving access to all premium features. At the
            end of this period, the account automatically switches to the free plan if no
            subscription has been taken out.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            6. Acceptable use
          </h2>
          <p>You agree to use Athletiq in compliance with applicable laws and not to:</p>
          <ul class="list-disc pl-6 space-y-1 mt-2">
            <li>Attempt to gain unauthorized access to the service</li>
            <li>Use the service for fraudulent purposes</li>
            <li>Post unlawful content through the application's features</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            7. Intellectual property
          </h2>
          <p>
            All elements making up Athletiq (code, design, brand, content) are protected by
            intellectual property law. Any unauthorized reproduction or use is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            8. Limitation of liability
          </h2>
          <p>
            Athletiq is provided "as is". We do not guarantee the absence of interruptions or
            errors. Athletiq does not replace professional medical advice. Consult a healthcare
            professional before starting any training program.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            9. Termination
          </h2>
          <p>
            You can delete your account at any time. We reserve the right to suspend or delete an
            account in the event of a breach of these Terms.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            10. Changes
          </h2>
          <p>
            We reserve the right to amend these Terms. Users will be informed of any substantial
            change. Continued use of the service after a change constitutes acceptance of the new
            terms.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            11. Contact
          </h2>
          <p>
            For any question regarding these Terms, you can contact us at:
            <strong>contact@athletiq.fr</strong>
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useLocale();
</script>
