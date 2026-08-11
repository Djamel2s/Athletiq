<template>
  <div class="min-h-screen geometric-bg">
    <!-- TopNav is rendered globally in app.vue -->

    <div class="px-4 md:px-6 pb-8 md:pb-12">
      <div class="w-full max-w-lg mx-auto">
        <!-- Page Header -->
        <div class="text-center mb-4 fade-in">
          <h1
            class="text-3xl md:text-5xl lg:text-6xl font-bold text-display bg-gradient-to-r from-sand-500 to-primary-900 dark:to-primary-100 bg-clip-text text-transparent mb-2"
          >
            {{ t('profile.edit.title') }}
          </h1>
          <p class="text-sm md:text-base text-primary-600 dark:text-primary-400 text-body-relaxed">
            {{ t('profile.edit.subtitle') }}
          </p>
        </div>

        <!-- Avatar -->
        <div class="flex flex-col items-center mb-6 md:mb-8 fade-in">
          <div class="relative group">
            <div
              class="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gradient-primary flex items-center justify-center shadow-lg"
            >
              <img
                v-if="authStore.user?.avatarUrl"
                :src="authStore.user.avatarUrl"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-white text-2xl md:text-3xl font-bold">{{ initials }}</span>
            </div>
            <label
              class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 rounded-2xl cursor-pointer transition-colors"
            >
              <svg
                class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarUpload"
                :disabled="avatarUploading"
              />
            </label>
            <div
              v-if="avatarUploading"
              class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl"
            >
              <div
                class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
            </div>
          </div>
          <button
            v-if="authStore.user?.avatarUrl"
            type="button"
            @click="handleAvatarDelete"
            :disabled="avatarUploading || avatarDeleting"
            class="text-xs text-red-500 hover:text-red-600 mt-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ avatarDeleting ? t('profile.avatar.deleting') : t('profile.avatar.delete') }}
          </button>
        </div>

        <!-- Formulaire -->
        <div class="card-glass slide-up">
          <form @submit.prevent="handleSave" class="space-y-5">
            <!-- Pseudo -->
            <div>
              <label
                for="username"
                class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1.5"
                >{{ t('profile.username.label') }}</label
              >
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 text-sm"
                  >@</span
                >
                <input
                  id="username"
                  v-model="usernameInput"
                  type="text"
                  class="input-primary !pl-8"
                  :placeholder="t('profile.usernamePlaceholder')"
                />
              </div>
              <p v-if="usernameChecking" class="text-xs text-primary-400 mt-1">
                {{ t('profile.username.verifying') }}
              </p>
              <p
                v-else-if="usernameAvailable === true && usernameInput.length >= 3"
                class="text-xs text-green-500 mt-1"
              >
                {{ t('profile.username.available') }}
              </p>
              <p v-else-if="usernameAvailable === false" class="text-xs text-red-500 mt-1">
                {{ t('profile.username.taken') }}
              </p>
              <p
                v-else-if="usernameInput.length > 0 && usernameInput.length < 3"
                class="text-xs text-primary-400 mt-1"
              >
                {{ t('profile.username.minChars') }}
              </p>
            </div>

            <!-- Bio -->
            <div>
              <label
                for="bio"
                class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1.5"
                >{{ t('profile.bio.label') }}</label
              >
              <textarea
                id="bio"
                v-model="bioInput"
                rows="3"
                class="input-primary resize-none"
                :placeholder="t('profile.bio.placeholder')"
                maxlength="200"
              ></textarea>
              <p class="text-xs text-primary-400 text-right mt-0.5">{{ bioInput.length }}/200</p>
            </div>

            <!-- Profil public -->
            <div class="flex items-center justify-between py-1">
              <div>
                <span class="text-primary-800 dark:text-primary-200 text-sm">{{
                  t('profile.public.label')
                }}</span>
                <p class="text-xs text-primary-500 dark:text-primary-400 mt-0.5">
                  {{ t('profile.public.hint') }}
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="isPublicInput" class="sr-only" />
                <div
                  class="w-10 h-10 rounded-md flex items-center justify-center transition-colors"
                >
                  <template v-if="isPublicInput">
                    <Icon name="lucide:globe" class="w-5 h-5 text-sand-700 dark:text-pink-300" />
                  </template>
                  <template v-else>
                    <Icon name="lucide:lock" class="w-5 h-5 text-primary-400" />
                  </template>
                </div>
              </label>
            </div>

            <div class="border-t border-primary-200 dark:border-primary-700 my-2"></div>

            <!-- Prenom et Nom -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  for="firstName"
                  class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1.5"
                  >{{ t('profile.firstName') }}</label
                >
                <input
                  id="firstName"
                  v-model="firstName"
                  type="text"
                  autocomplete="given-name"
                  class="input-primary"
                  placeholder="Jean"
                />
              </div>
              <div>
                <label
                  for="lastName"
                  class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1.5"
                  >{{ t('profile.lastName') }}</label
                >
                <input
                  id="lastName"
                  v-model="lastName"
                  type="text"
                  autocomplete="family-name"
                  class="input-primary"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <!-- Email (lecture seule) -->
            <div>
              <label
                for="email"
                class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1.5"
                >{{ t('profile.email') }}</label
              >
              <input
                id="email"
                :value="authStore.user?.email"
                type="email"
                disabled
                class="input-primary opacity-60 cursor-not-allowed"
              />
            </div>

            <!-- Genre -->
            <div>
              <label
                class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-3"
                >{{ t('profile.gender') }}</label
              >
              <div class="grid grid-cols-2 gap-2 md:gap-3">
                <button
                  v-for="genderOption in genders"
                  :key="genderOption.value"
                  type="button"
                  @click="selectedGender = genderOption.value"
                  class="p-3 md:p-4 rounded-2xl border-2 transition-all duration-300 text-center flex items-center justify-center gap-2 md:gap-3"
                  :class="
                    selectedGender === genderOption.value
                      ? 'border-sand-500 dark:border-sand-600 bg-sand-500/10 dark:bg-sand-600/15 shadow-md'
                      : 'border-primary-200 dark:border-primary-700 bg-white/50 dark:bg-primary-800/50 hover:border-primary-300 dark:hover:border-primary-600'
                  "
                >
                  <span
                    class="font-semibold text-primary-900 dark:text-primary-100 text-sm md:text-base"
                    >{{ genderOption.label }}</span
                  >
                </button>
              </div>
            </div>

            <!-- Objectif -->
            <div>
              <label
                class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-3"
                >{{ t('profile.goal') }}</label
              >
              <div class="grid grid-cols-2 gap-2 md:gap-3">
                <button
                  v-for="goalOption in goals"
                  :key="goalOption.value"
                  type="button"
                  @click="selectedGoal = goalOption.value"
                  class="p-3 md:p-4 rounded-2xl border-2 transition-all duration-300 text-left flex items-start gap-2 md:gap-3"
                  :class="
                    selectedGoal === goalOption.value
                      ? 'border-sand-500 dark:border-sand-600 bg-sand-500/10 dark:bg-sand-600/15 shadow-md'
                      : 'border-primary-200 dark:border-primary-700 bg-white/50 dark:bg-primary-800/50 hover:border-primary-300 dark:hover:border-primary-600'
                  "
                >
                  <div
                    class="w-7 h-7 md:w-8 md:h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                    :class="
                      selectedGoal === goalOption.value
                        ? 'bg-gradient-primary'
                        : 'bg-primary-200 dark:bg-primary-700'
                    "
                  >
                    <svg
                      class="w-3.5 h-3.5 md:w-4 md:h-4"
                      :class="
                        selectedGoal === goalOption.value
                          ? 'text-white'
                          : 'text-primary-600 dark:text-primary-400'
                      "
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        :d="goalOption.iconPath"
                      />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <div
                      class="font-semibold text-primary-900 dark:text-primary-100 text-xs md:text-sm"
                    >
                      {{ goalOption.label }}
                    </div>
                    <div
                      class="text-primary-500 dark:text-primary-400 text-[10px] md:text-xs mt-0.5"
                    >
                      {{ goalOption.desc }}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Success message -->
            <div
              v-if="success"
              class="p-3 rounded-xl bg-sand-500/15 dark:bg-sand-600/15 border border-sand-500/40 dark:border-sand-600/30"
            >
              <p class="text-sm text-sand-700 font-medium">{{ t('profile.edit.success') }}</p>
            </div>

            <!-- Error message -->
            <div
              v-if="error"
              class="p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800"
            >
              <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
            </div>

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary w-full text-base md:text-lg py-3 md:py-4"
            >
              <span v-if="!loading">{{ t('common.save') }}</span>
              <span v-else class="flex items-center justify-center gap-2">
                <div
                  class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></div>
                {{ t('common.saving') }}
              </span>
            </button>
          </form>
        </div>

        <!-- Back link -->
        <div class="text-center mt-6">
          <NuxtLink
            to="/profile"
            class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100 transition-colors inline-flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {{ t('profile.edit.backToProfile') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/* TopNav imported and rendered globally in app.vue; per-page import removed */
import { useAuthStore } from '~/stores/auth';
import { useSocialApi } from '~/composables/useSocialApi';
import { useLocale } from '~/composables/useLocale';

const { t } = useLocale();

definePageMeta({
  layout: false,
  middleware: 'auth',
});

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const authStore = useAuthStore();
const { applyTheme } = useTheme();
const { updateProfile: updateSocialProfile, checkUsername } = useSocialApi();

const firstName = ref(authStore.user?.firstName || '');
const lastName = ref(authStore.user?.lastName || '');
const selectedGoal = ref<string | null>(authStore.user?.goal || null);
const selectedGender = ref<string | null>(authStore.user?.gender || null);
const loading = ref(false);
const error = ref('');
const success = ref(false);

// Social fields
const _user = authStore.user as any;
const usernameInput = ref(_user?.username || '');
const bioInput = ref(_user?.bio || '');
const isPublicInput = ref(_user?.isPublic !== false);
const usernameChecking = ref(false);
const usernameAvailable = ref<boolean | null>(null);
let usernameCheckTimeout: ReturnType<typeof setTimeout> | null = null;
const originalUsername = ref('');

watch(usernameInput, (val) => {
  usernameAvailable.value = null;
  const cleaned = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
  if (cleaned !== val) usernameInput.value = cleaned;
  if (cleaned.length < 3 || cleaned === originalUsername.value) return;
  if (usernameCheckTimeout) clearTimeout(usernameCheckTimeout);
  usernameCheckTimeout = setTimeout(async () => {
    usernameChecking.value = true;
    try {
      const res = (await checkUsername(cleaned)) as any;
      usernameAvailable.value = res?.available === true;
    } catch {
      usernameAvailable.value = null;
    } finally {
      usernameChecking.value = false;
    }
  }, 500);
});

const genders = [
  { value: 'male', label: 'Homme' },
  { value: 'female', label: 'Femme' },
];

const goals = [
  {
    value: 'BULK',
    label: 'Prise de masse',
    desc: 'Gagner du muscle',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    value: 'STRENGTH',
    label: 'Force',
    desc: 'Devenir plus fort',
    iconPath:
      'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4',
  },
  {
    value: 'RECOMP',
    label: 'Recomposition',
    desc: 'Muscle & perte de gras',
    iconPath:
      'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  },
  {
    value: 'CUT',
    label: 'Seche',
    desc: 'Perdre du gras',
    iconPath:
      'M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z',
  },
];

const avatarUploading = ref(false);
const avatarDeleting = ref(false);
const toast = useToast();

const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    toast.error('Erreur', 'Le fichier doit etre une image');
    input.value = '';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Erreur', 'La photo ne doit pas depasser 5 Mo');
    input.value = '';
    return;
  }

  avatarUploading.value = true;
  try {
    const result = await authStore.uploadAvatar(file);
    if (!result.success) logger.error('Avatar upload failed:', result.error);
  } finally {
    avatarUploading.value = false;
    input.value = '';
  }
};

const handleAvatarDelete = async () => {
  if (avatarDeleting.value) return;
  avatarDeleting.value = true;
  try {
    await authStore.deleteAvatar();
  } finally {
    avatarDeleting.value = false;
  }
};

const initials = computed(() => {
  const f = firstName.value?.charAt(0) || '';
  const l = lastName.value?.charAt(0) || '';
  return (f + l).toUpperCase() || '?';
});

const handleSave = async () => {
  if (loading.value) return;
  error.value = '';
  success.value = false;
  loading.value = true;

  try {
    const data: Record<string, string> = {};
    if (firstName.value) data.firstName = firstName.value;
    if (lastName.value) data.lastName = lastName.value;
    if (selectedGoal.value) data.goal = selectedGoal.value;
    if (selectedGender.value) data.gender = selectedGender.value;

    const result = await authStore.updateProfile(data);

    // Save social profile (username, bio, isPublic)
    const socialData: Record<string, any> = {};
    if (usernameInput.value && usernameInput.value !== originalUsername.value)
      socialData.username = usernameInput.value;
    if (bioInput.value !== undefined) socialData.bio = bioInput.value;
    socialData.isPublic = isPublicInput.value;
    if (Object.keys(socialData).length > 0) {
      await updateSocialProfile(socialData);
      originalUsername.value = usernameInput.value;
    }

    if (result.success) {
      success.value = true;
      applyTheme();
      setTimeout(() => {
        success.value = false;
      }, 3000);
    } else {
      error.value = result.error || 'Une erreur est survenue';
    }
  } catch (err) {
    error.value = 'Une erreur est survenue';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  originalUsername.value = _user?.username || '';
});
</script>
