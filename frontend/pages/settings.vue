<template>
  <div class="min-h-screen geometric-bg">
    <div class="px-4 md:px-6 pb-20 w-full max-w-5xl mx-auto">
      <!-- Header -->
      <div class="text-center lg:text-left mb-8 lg:mb-10 fade-in">
        <h1
          class="text-3xl md:text-5xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-2"
        >
          {{ t('settings.title') }}
        </h1>
        <p class="text-primary-600 dark:text-primary-400 text-body-relaxed">
          {{ t('settings.subtitle') }}
        </p>
      </div>

      <div class="lg:flex lg:gap-8 lg:items-start slide-up">
        <!-- Navigation : onglets scrollables sur mobile, sidebar collante sur desktop -->
        <nav
          class="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 mb-6 lg:mb-0 lg:w-52 ..."
        >
          <button
            v-for="section in sections"
            :key="section.key"
            @click="activeSection = section.key"
            class="flex-1 flex items-center lg:justify-start justify-center gap-1 px-4 py-2.5 rounded-xl text-sm lg:flex-none lg:w-full"
            :class="
              activeSection === section.key
                ? 'bg-gradient-primary text-white shadow-sm'
                : 'text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800'
            "
          >
            <Icon :name="section.icon" class="w-4 h-4 flex-shrink-0" />

            <span
              :class="activeSection === section.key ? 'inline-block' : 'hidden lg:inline-block'"
            >
              {{ section.label }}
            </span>
          </button>
        </nav>

        <!-- Panneau actif -->
        <div class="flex-1 min-w-0">
          <Transition name="fade" mode="out-in">
            <div :key="activeSection" class="space-y-1">
              <!-- ===== COMPTE ===== -->
              <div v-if="activeSection === 'account'" class="card-glass !p-2">
                <div class="space-y-1">
                  <NuxtLink
                    to="/edit-profile"
                    class="flex items-center justify-between p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors"
                  >
                    <span class="text-primary-800 dark:text-primary-200">{{
                      t('settings.editProfile')
                    }}</span>
                    <Icon name="lucide:chevron-right" class="w-5 h-5 text-primary-400" />
                  </NuxtLink>
                  <NuxtLink
                    to="/subscription"
                    class="flex items-center justify-between p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors"
                  >
                    <span class="text-primary-800 dark:text-primary-200">{{
                      t('settings.subscription')
                    }}</span>
                    <Icon name="lucide:chevron-right" class="w-5 h-5 text-primary-400" />
                  </NuxtLink>

                  <div class="border-t border-primary-100 dark:border-primary-800 my-2"></div>

                  <button
                    @click="handleLogout"
                    class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors text-left"
                  >
                    <span class="text-primary-800 dark:text-primary-200">{{
                      t('settings.logout')
                    }}</span>
                    <Icon name="lucide:log-out" class="w-4.5 h-4.5 text-primary-400" />
                  </button>
                  <button
                    @click="showDeleteConfirm = true"
                    class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left group"
                  >
                    <span class="text-red-500 group-hover:text-red-600">{{
                      t('settings.deleteAccountBtn')
                    }}</span>
                    <Icon name="lucide:trash-2" class="w-4.5 h-4.5 text-red-400" />
                  </button>
                </div>
              </div>

              <!-- ===== COACHING ===== -->
              <div v-else-if="activeSection === 'coaching'" class="card-glass !p-2">
                <div class="space-y-1">
                  <NuxtLink
                    to="/my-coach"
                    class="flex items-center justify-between p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors"
                  >
                    <span class="text-primary-800 dark:text-primary-200">{{
                      t('settings.myCoach')
                    }}</span>
                    <Icon name="lucide:chevron-right" class="w-5 h-5 text-primary-400" />
                  </NuxtLink>
                  <NuxtLink
                    to="/coaching"
                    class="flex items-center justify-between p-3 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-800 transition-colors"
                  >
                    <span class="text-primary-800 dark:text-primary-200">{{
                      t('settings.coachSpace')
                    }}</span>
                    <Icon name="lucide:chevron-right" class="w-5 h-5 text-primary-400" />
                  </NuxtLink>
                </div>
              </div>

              <!-- ===== PREFERENCES ===== -->
              <div v-else-if="activeSection === 'preferences'" class="card-glass !p-5 space-y-5">
                <!-- Theme -->
                <div>
                  <p class="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2">
                    {{ t('settings.themeLight') }} / {{ t('settings.themeDark') }} /
                    {{ t('settings.themeSystem') }}
                  </p>
                  <div class="flex bg-primary-100 dark:bg-primary-800 rounded-xl p-1 w-full">
                    <button
                      @click="setTheme('light')"
                      class="flex-1 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
                      :class="
                        $colorMode.preference === 'light'
                          ? 'bg-white dark:bg-primary-700 shadow-sm text-primary-900 dark:text-primary-100'
                          : 'text-primary-500 dark:text-primary-400'
                      "
                    >
                      <Icon name="lucide:sun" class="w-4 h-4" />
                      <span>{{ t('settings.themeLight') }}</span>
                    </button>
                    <button
                      @click="setTheme('dark')"
                      class="flex-1 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
                      :class="
                        $colorMode.preference === 'dark'
                          ? 'bg-white dark:bg-primary-700 shadow-sm text-primary-900 dark:text-primary-100'
                          : 'text-primary-500 dark:text-primary-400'
                      "
                    >
                      <Icon name="lucide:moon" class="w-4 h-4" />
                      <span>{{ t('settings.themeDark') }}</span>
                    </button>
                    <button
                      @click="setTheme('system')"
                      class="flex-1 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
                      :class="
                        $colorMode.preference === 'system'
                          ? 'bg-white dark:bg-primary-700 shadow-sm text-primary-900 dark:text-primary-100'
                          : 'text-primary-500 dark:text-primary-400'
                      "
                    >
                      <Icon name="lucide:monitor" class="w-4 h-4" />
                      <span>{{ t('settings.themeSystem') }}</span>
                    </button>
                  </div>
                </div>

                <div class="border-t border-primary-100 dark:border-primary-800"></div>

                <!-- Langue -->
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-primary-800 dark:text-primary-200">
                      {{ t('settings.language') }}
                    </p>
                    <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">
                      {{ t('settings.languageHint') }}
                    </p>
                  </div>
                  <div class="flex bg-primary-100 dark:bg-primary-800 rounded-xl p-1 flex-shrink-0">
                    <button
                      v-for="loc in availableLocales"
                      :key="loc.code"
                      @click="setLocale(loc.code)"
                      class="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                      :class="
                        locale === loc.code
                          ? 'bg-white dark:bg-primary-700 shadow-sm text-primary-900 dark:text-primary-100'
                          : 'text-primary-500 dark:text-primary-400'
                      "
                    >
                      {{ loc.code.toUpperCase() }}
                    </button>
                  </div>
                </div>

                <div class="border-t border-primary-100 dark:border-primary-800"></div>

                <!-- Unite de poids -->
                <div class="flex items-center justify-between">
                  <span class="text-primary-800 dark:text-primary-200">{{
                    t('settings.weightUnit')
                  }}</span>
                  <div class="flex bg-primary-100 dark:bg-primary-800 rounded-xl p-1">
                    <button
                      @click="weightUnit = 'kg'"
                      class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                      :class="
                        weightUnit === 'kg'
                          ? 'bg-white dark:bg-primary-700 shadow-sm text-primary-900 dark:text-primary-100'
                          : 'text-primary-500 dark:text-primary-400'
                      "
                    >
                      kg
                    </button>
                    <button
                      @click="weightUnit = 'lbs'"
                      class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                      :class="
                        weightUnit === 'lbs'
                          ? 'bg-white dark:bg-primary-700 shadow-sm text-primary-900 dark:text-primary-100'
                          : 'text-primary-500 dark:text-primary-400'
                      "
                    >
                      lbs
                    </button>
                  </div>
                </div>

                <div class="border-t border-primary-100 dark:border-primary-800"></div>

                <!-- Timer de repos -->
                <div class="flex items-center justify-between">
                  <span class="text-primary-800 dark:text-primary-200">{{
                    t('settings.restTimer')
                  }}</span>
                  <div class="flex items-center gap-2">
                    <button
                      @click="restTimer = Math.max(30, restTimer - 15)"
                      class="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 flex items-center justify-center transition-colors"
                    >
                      <Icon
                        name="lucide:minus"
                        class="w-4 h-4 text-primary-600 dark:text-primary-400"
                      />
                    </button>
                    <span
                      class="text-primary-900 dark:text-primary-100 font-medium w-12 text-center font-plate"
                      >{{ restTimer }}s</span
                    >
                    <button
                      @click="restTimer = Math.min(300, restTimer + 15)"
                      class="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 flex items-center justify-center transition-colors"
                    >
                      <Icon
                        name="lucide:plus"
                        class="w-4 h-4 text-primary-600 dark:text-primary-400"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <!-- ===== NOTIFICATIONS ===== -->
              <div v-else-if="activeSection === 'notifications'" class="card-glass !p-2">
                <div class="space-y-1">
                  <div class="flex items-center justify-between p-3">
                    <span class="text-primary-800 dark:text-primary-200">{{
                      t('settings.notif.personalRecords')
                    }}</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="notifPR" class="sr-only peer" />
                      <div class="toggle-track"></div>
                    </label>
                  </div>
                  <div class="flex items-center justify-between p-3">
                    <span class="text-primary-800 dark:text-primary-200">{{
                      t('settings.notif.streaks')
                    }}</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="notifStreak" class="sr-only peer" />
                      <div class="toggle-track"></div>
                    </label>
                  </div>
                  <div class="flex items-center justify-between p-3">
                    <span class="text-primary-800 dark:text-primary-200">{{
                      t('settings.notif.goals')
                    }}</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="notifGoals" class="sr-only peer" />
                      <div class="toggle-track"></div>
                    </label>
                  </div>

                  <div v-if="isNativePlatform" class="flex items-center justify-between p-3">
                    <div>
                      <span class="text-primary-800 dark:text-primary-200">{{
                        t('settings.notif.push')
                      }}</span>
                      <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">
                        {{ t('settings.notif.pushDesc') }}
                      </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="pushEnabled" class="sr-only peer" />
                      <div class="toggle-track"></div>
                    </label>
                  </div>

                  <div class="border-t border-primary-100 dark:border-primary-800 my-2"></div>

                  <div class="flex items-center justify-between p-3">
                    <div>
                      <span class="text-primary-800 dark:text-primary-200">{{
                        t('settings.notif.inactivity')
                      }}</span>
                      <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">
                        {{ t('settings.notif.inactivityDesc') }}
                      </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="reminderEnabled" class="sr-only peer" />
                      <div class="toggle-track"></div>
                    </label>
                  </div>

                  <div v-if="reminderEnabled" class="flex items-center justify-between p-3 pl-6">
                    <span class="text-primary-600 dark:text-primary-400 text-sm">{{
                      t('settings.notif.afterHowManyDays')
                    }}</span>
                    <div class="flex items-center gap-2">
                      <button
                        @click="inactivityDays = Math.max(1, inactivityDays - 1)"
                        class="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 flex items-center justify-center transition-colors"
                      >
                        <Icon
                          name="lucide:minus"
                          class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400"
                        />
                      </button>
                      <span
                        class="text-primary-900 dark:text-primary-100 font-medium w-10 text-center font-plate"
                        >{{ inactivityDays }}j</span
                      >
                      <button
                        @click="inactivityDays = Math.min(14, inactivityDays + 1)"
                        class="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 flex items-center justify-center transition-colors"
                      >
                        <Icon
                          name="lucide:plus"
                          class="w-3.5 h-3.5 text-primary-600 dark:text-primary-400"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ===== DONNEES ===== -->
              <div v-else-if="activeSection === 'data'" class="card-glass !p-5">
                <div class="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <span class="text-primary-800 dark:text-primary-200">{{
                      t('settings.export.history')
                    }}</span>
                    <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">
                      {{ t('settings.export.historyDesc') }}
                    </p>
                  </div>
                  <button
                    @click="exportCsv"
                    :disabled="exporting"
                    class="px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
                  >
                    {{
                      exporting ? t('settings.export.exporting') : t('settings.export.downloadCsv')
                    }}
                  </button>
                </div>
              </div>

              <!-- ===== SANTE ===== -->
              <div v-else-if="activeSection === 'health'" class="card-glass !p-2">
                <div class="space-y-1">
                  <div class="flex items-center justify-between p-3">
                    <div>
                      <span class="text-primary-800 dark:text-primary-200">{{
                        t('settings.health.sync')
                      }}</span>
                      <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">
                        {{ t('settings.health.syncDesc') }}
                      </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="healthSyncEnabled" class="sr-only peer" />
                      <div class="toggle-track"></div>
                    </label>
                  </div>
                  <div class="flex items-center justify-between p-3 gap-4 flex-wrap">
                    <div>
                      <span class="text-primary-800 dark:text-primary-200">{{
                        t('settings.health.syncHistory')
                      }}</span>
                      <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">
                        {{ t('settings.health.syncHistoryDesc') }}
                      </p>
                    </div>
                    <button
                      @click="syncHealthHistory"
                      :disabled="syncingHealth"
                      class="px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex-shrink-0"
                    >
                      {{ syncingHealth ? '...' : t('settings.health.syncHistory') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Retour au dashboard -->
      <div class="text-center mt-10">
        <NuxtLink
          to="/dashboard"
          class="text-sm md:text-base text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors inline-flex items-center gap-2"
        >
          <Icon name="lucide:arrow-left" class="w-5 h-5" />
          {{ t('settings.backToDashboard') }}
        </NuxtLink>
      </div>
    </div>

    <!-- Modale confirmation suppression -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center px-6"
      @click.self="showDeleteConfirm = false"
    >
      <div class="fixed inset-0 bg-black/40 backdrop-blur-sm"></div>
      <div class="relative bg-white dark:bg-primary-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <div class="text-center">
          <div
            class="w-14 h-14 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Icon name="lucide:triangle-alert" class="w-7 h-7 text-red-500" />
          </div>
          <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100 mb-2">
            {{ t('settings.deleteAccountTitle') }}
          </h3>
          <p class="text-primary-600 dark:text-primary-400 text-sm mb-6">
            {{ t('settings.deleteAccountWarning') }}
          </p>
          <div class="space-y-3">
            <button
              @click="handleDeleteAccount"
              :disabled="deleting"
              class="w-full py-3 rounded-2xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {{ deleting ? t('settings.deleting') : t('settings.confirmDelete') }}
            </button>
            <button
              @click="showDeleteConfirm = false"
              class="w-full py-3 rounded-2xl bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 font-medium hover:bg-primary-200 dark:hover:bg-primary-700 transition-colors"
            >
              {{ t('settings.cancel') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* TopNav imported and rendered globally in app.vue; per-page import removed */
import { useAuthStore } from '~/stores/auth';
import { useSocialApi } from '~/composables/useSocialApi';
import { Capacitor } from '@capacitor/core';

definePageMeta({
  layout: false,
  middleware: 'auth',
});

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const authStore = useAuthStore();
const colorMode = useColorMode();
const { locale, availableLocales, setLocale, t } = useLocale();

const weightUnit = ref('kg');
const restTimer = ref(90);
const notifPR = ref(true);
const notifStreak = ref(true);
const notifGoals = ref(true);
const reminderEnabled = ref(true);
const inactivityDays = ref(3);
const pushEnabled = ref(false);
const healthSyncEnabled = ref(false);
const syncingHealth = ref(false);
const isNativePlatform = ref(false);
const showDeleteConfirm = ref(false);
const deleting = ref(false);
const exporting = ref(false);

// Navigation par sections
const activeSection = ref<
  'account' | 'coaching' | 'preferences' | 'notifications' | 'data' | 'health'
>('account');

const sections = computed(() => {
  const base: { key: typeof activeSection.value; label: string; icon: string }[] = [
    { key: 'account', label: t('settings.navAccount'), icon: 'lucide:user' },
    { key: 'coaching', label: t('settings.navCoaching'), icon: 'lucide:whistle' },
    { key: 'preferences', label: t('settings.navPreferences'), icon: 'lucide:sliders-horizontal' },
    { key: 'notifications', label: t('settings.navNotifications'), icon: 'lucide:bell' },
    { key: 'data', label: t('settings.navData'), icon: 'lucide:download' },
  ];
  if (isNativePlatform.value) {
    base.push({ key: 'health', label: t('settings.navHealth'), icon: 'lucide:heart-pulse' });
  }
  return base;
});

// Social profile
const { getRequests } = useSocialApi();
const pendingRequestsCount = ref(0);

const exportCsv = async () => {
  exporting.value = true;
  try {
    const config = useRuntimeConfig();
    const blob = await $fetch(`${config.public.apiUrl}/workouts/export/csv`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
      responseType: 'blob',
    });
    const url = URL.createObjectURL(blob as Blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'athletiq-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export CSV error:', error);
  } finally {
    exporting.value = false;
  }
};
const setTheme = (theme: string) => {
  colorMode.preference = theme;
};

let settingsTimeout: ReturnType<typeof setTimeout> | null = null;
const debouncedSave = (key: string, value: string) => {
  if (settingsTimeout) clearTimeout(settingsTimeout);
  settingsTimeout = setTimeout(() => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      logger.error('Failed to persist setting:', error);
    }
  }, 500);
};

let syncTimeout: ReturnType<typeof setTimeout> | null = null;
const debouncedSyncReminder = () => {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(() => {
    syncReminderSettings();
  }, 500);
};

const togglePush = async (enabled: boolean) => {
  if (enabled) {
    try {
      const { PushNotifications } = await import('@capacitor/push-notifications');
      const permResult = await PushNotifications.requestPermissions();
      if (permResult.receive !== 'granted') {
        pushEnabled.value = false;
        return;
      }
      await PushNotifications.register();
    } catch (error) {
      logger.error('Push toggle error:', error);
      pushEnabled.value = false;
    }
  } else {
    try {
      const savedToken = localStorage.getItem('fcmToken');
      if (savedToken) {
        const { useFcmTokenApi } = await import('~/composables/useFcmTokenApi');
        const { removeToken } = useFcmTokenApi();
        await removeToken(savedToken);
        localStorage.removeItem('fcmToken');
      }
    } catch (error) {
      logger.error('Push token removal error:', error);
    }
  }
};

const syncHealthHistory = async () => {
  syncingHealth.value = true;
  try {
    const { useHealthSync } = await import('~/composables/useHealthSync');
    const healthSync = useHealthSync();
    const available = await healthSync.isAvailable();
    if (!available) {
      const toast = useToast();
      toast.error(
        'Sante non disponible',
        "Le service de sante n'est pas disponible sur cet appareil"
      );
      syncingHealth.value = false;
      return;
    }
    const granted = await healthSync.requestPermissions();
    if (!granted) {
      const toast = useToast();
      toast.error('Permissions refusees', "Veuillez autoriser l'acces aux donnees de sante");
      syncingHealth.value = false;
      return;
    }
    // Fetch all completed workouts
    const config = useRuntimeConfig();
    const data = await $fetch<{ workouts: any[] }>(`${config.public.apiUrl}/workouts`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
      timeout: 30000,
    });
    const completedWorkouts = (data.workouts || []).filter(
      (w: any) => w.status === 'completed' && w.startedAt && w.completedAt
    );
    const result = await healthSync.syncAllWorkouts(
      completedWorkouts.map((w: any) => ({
        name: w.name,
        startedAt: w.startedAt,
        completedAt: w.completedAt,
        durationMinutes: w.durationMinutes,
        caloriesBurned: w.caloriesBurned,
      }))
    );
    const toast = useToast();
    toast.success('Synchronisation terminee', `${result.synced} seance(s) synchronisee(s)`);
  } catch (error) {
    logger.error('Health history sync error:', error);
    const toast = useToast();
    toast.error('Erreur de synchronisation');
  } finally {
    syncingHealth.value = false;
  }
};

onBeforeUnmount(() => {
  if (settingsTimeout) clearTimeout(settingsTimeout);
  if (syncTimeout) clearTimeout(syncTimeout);
});

const handleLogout = () => {
  authStore.logout();
  navigateTo('/login');
};

const handleDeleteAccount = async () => {
  deleting.value = true;
  try {
    const config = useRuntimeConfig();
    await $fetch(`${config.public.apiUrl}/users/me`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` },
      timeout: 30000,
    });
    authStore.logout();
    navigateTo('/');
  } catch (error) {
    logger.error('Delete account error:', error);
    deleting.value = false;
  }
};

onMounted(async () => {
  if (process.client) {
    isNativePlatform.value = Capacitor.isNativePlatform();
    try {
      weightUnit.value = localStorage.getItem('pref_weight_unit') || 'kg';
      restTimer.value = parseInt(localStorage.getItem('pref_rest_timer') || '90');
      notifPR.value = localStorage.getItem('pref_notif_pr') !== 'false';
      notifStreak.value = localStorage.getItem('pref_notif_streak') !== 'false';
      notifGoals.value = localStorage.getItem('pref_notif_goals') !== 'false';
      reminderEnabled.value = localStorage.getItem('pref_reminder_enabled') !== 'false';
      inactivityDays.value = parseInt(localStorage.getItem('pref_inactivity_days') || '3');
      pushEnabled.value = localStorage.getItem('pushEnabled') !== 'false' && isNativePlatform.value;
      healthSyncEnabled.value = localStorage.getItem('healthSyncEnabled') === 'true';
    } catch (error) {
      logger.error('Failed to load local settings:', error);
    }
  }

  // Also sync with backend
  try {
    const config = useRuntimeConfig();
    const user = await $fetch<any>(`${config.public.apiUrl}/users/me`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
      timeout: 30000,
    });
    if (user.reminderEnabled !== undefined) reminderEnabled.value = user.reminderEnabled;
    if (user.inactivityThresholdDays) inactivityDays.value = user.inactivityThresholdDays;
  } catch (err) {
    logger.error('Settings sync failed:', err);
  }

  // Load pending friend requests count
  try {
    const reqData = (await getRequests()) as any;
    const pending = reqData?.received || reqData?.pending || [];
    pendingRequestsCount.value = Array.isArray(pending) ? pending.length : 0;
  } catch (error) {
    logger.error('Failed to load pending requests count:', error);
    pendingRequestsCount.value = 0;
  }
});

watch(weightUnit, (val) => {
  if (process.client) debouncedSave('pref_weight_unit', val);
});

watch(restTimer, (val) => {
  if (process.client) debouncedSave('pref_rest_timer', String(val));
});

watch(notifPR, (val) => {
  if (process.client) debouncedSave('pref_notif_pr', String(val));
});

watch(notifStreak, (val) => {
  if (process.client) debouncedSave('pref_notif_streak', String(val));
});

watch(notifGoals, (val) => {
  if (process.client) debouncedSave('pref_notif_goals', String(val));
});

watch(reminderEnabled, (val) => {
  if (process.client) debouncedSave('pref_reminder_enabled', String(val));
  debouncedSyncReminder();
});

watch(inactivityDays, (val) => {
  if (process.client) debouncedSave('pref_inactivity_days', String(val));
  debouncedSyncReminder();
});

watch(pushEnabled, (val) => {
  if (process.client) {
    localStorage.setItem('pushEnabled', String(val));
    togglePush(val);
  }
});

watch(healthSyncEnabled, async (val) => {
  if (process.client) {
    localStorage.setItem('healthSyncEnabled', String(val));
    if (val) {
      try {
        const { useHealthSync } = await import('~/composables/useHealthSync');
        const healthSync = useHealthSync();
        const available = await healthSync.isAvailable();
        if (!available) {
          healthSyncEnabled.value = false;
          const toast = useToast();
          toast.error('Sante non disponible');
          return;
        }
        const granted = await healthSync.requestPermissions();
        if (!granted) {
          healthSyncEnabled.value = false;
          const toast = useToast();
          toast.error('Permissions refusees');
        }
      } catch (error) {
        logger.error('Health sync initialization failed:', error);
        healthSyncEnabled.value = false;
      }
    }
  }
});

const syncReminderSettings = async () => {
  try {
    const config = useRuntimeConfig();
    await $fetch(`${config.public.apiUrl}/users/me`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      timeout: 30000,
      body: {
        reminderEnabled: reminderEnabled.value,
        inactivityThresholdDays: inactivityDays.value,
      },
    });
  } catch (err) {
    logger.error('Settings sync failed:', err);
  }
};
</script>

<style scoped>
.toggle-track {
  width: 44px;
  height: 24px;
  background: rgb(var(--sand-200, 226 220 208));
  border-radius: 9999px;
  position: relative;
  transition: background 0.2s ease;
}
.dark .toggle-track {
  background: rgb(var(--primary-700, 68 64 60));
}
.toggle-track::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 9999px;
  transition: transform 0.2s ease;
}
.peer:checked ~ .toggle-track {
  background: linear-gradient(135deg, rgb(var(--sand-500)) 0%, rgb(var(--sand-600)) 100%);
}
.peer:checked ~ .toggle-track::after {
  transform: translateX(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
