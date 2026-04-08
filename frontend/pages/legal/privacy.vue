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
        Retour
      </NuxtLink>

      <h1 class="text-3xl md:text-4xl font-bold text-primary-900 dark:text-primary-100 mb-8">
        Politique de Confidentialité
      </h1>
      <p class="text-sm text-primary-500 dark:text-primary-400 mb-8">
        Dernière mise à jour : 8 mars 2026
      </p>

      <div
        class="prose prose-primary dark:prose-invert max-w-none space-y-6 text-primary-700 dark:text-primary-300"
      >
        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            1. Responsable du traitement
          </h2>
          <p>
            Le responsable du traitement des données personnelles collectées via Athletiq est la
            société éditrice de l'application. Pour toute question, contactez-nous à :
            <strong>contact@athletiq.fr</strong>
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            2. Données collectées
          </h2>
          <p>Nous collectons les données suivantes :</p>
          <ul class="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Données d'identification :</strong> nom, prénom, adresse email</li>
            <li>
              <strong>Données d'entraînement :</strong> séances, exercices, performances, historique
            </li>
            <li>
              <strong>Données corporelles :</strong> poids, mensurations, photos de progression
            </li>
            <li>
              <strong>Données techniques :</strong> adresse IP, type de navigateur, données de
              connexion
            </li>
            <li>
              <strong>Données de paiement :</strong> traitées par Stripe (nous ne stockons pas vos
              données bancaires)
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            3. Finalités du traitement
          </h2>
          <p>Vos données sont utilisées pour :</p>
          <ul class="list-disc pl-6 space-y-1 mt-2">
            <li>Fournir et améliorer le service Athletiq</li>
            <li>Gérer votre compte et votre abonnement</li>
            <li>Afficher vos statistiques et votre progression</li>
            <li>Assurer la sécurité du service</li>
            <li>Vous envoyer des notifications liées à votre compte (si activées)</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            4. Base légale
          </h2>
          <p>Le traitement de vos données repose sur :</p>
          <ul class="list-disc pl-6 space-y-1 mt-2">
            <li>
              <strong>L'exécution du contrat :</strong> pour fournir le service auquel vous avez
              souscrit
            </li>
            <li>
              <strong>Le consentement :</strong> pour les notifications et communications
              optionnelles
            </li>
            <li>
              <strong>L'intérêt légitime :</strong> pour améliorer le service et assurer sa sécurité
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            5. Partage des données
          </h2>
          <p>Vos données ne sont jamais vendues. Elles peuvent être partagées avec :</p>
          <ul class="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Stripe :</strong> pour le traitement des paiements</li>
            <li><strong>Cloudinary :</strong> pour le stockage des photos</li>
            <li><strong>Notre hébergeur :</strong> pour le fonctionnement technique du service</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            6. Durée de conservation
          </h2>
          <p>
            Vos données sont conservées tant que votre compte est actif. En cas de suppression de
            compte, vos données sont effacées dans un délai de 30 jours, à l'exception des données
            nécessaires au respect d'obligations légales (facturation : 10 ans).
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            7. Vos droits (RGPD)
          </h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données, vous disposez des
            droits suivants :
          </p>
          <ul class="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
            <li><strong>Droit de rectification :</strong> corriger vos données inexactes</li>
            <li><strong>Droit de suppression :</strong> demander l'effacement de vos données</li>
            <li>
              <strong>Droit à la portabilité :</strong> récupérer vos données dans un format
              structuré
            </li>
            <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
            <li><strong>Droit de limitation :</strong> limiter le traitement de vos données</li>
          </ul>
          <p class="mt-2">
            Pour exercer ces droits, contactez-nous à : <strong>contact@athletiq.fr</strong>
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            8. Sécurité
          </h2>
          <p>
            Nous mettons en place des mesures techniques et organisationnelles pour protéger vos
            données : chiffrement des mots de passe (bcrypt), connexion sécurisée (HTTPS),
            protection contre les attaques (rate limiting, headers de sécurité).
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            9. Cookies
          </h2>
          <p>
            Athletiq utilise uniquement des cookies techniques nécessaires au fonctionnement du
            service (authentification, préférences). Aucun cookie publicitaire ou de tracking n'est
            utilisé.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3">
            10. Modifications
          </h2>
          <p>
            Cette politique peut être mise à jour. En cas de modification substantielle, vous serez
            informé via l'application.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
