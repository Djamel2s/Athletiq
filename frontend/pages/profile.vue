<template>
  <div class="min-h-screen geometric-bg">
    <!-- TopNav is rendered globally in app.vue -->

    <div class="px-4 md:px-6 pb-28 lg:pb-20 max-w-lg mx-auto relative">
      <!-- Loading -->
      <div v-if="pageLoading" class="text-center py-20">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-700 border-t-sand-500"
        ></div>
      </div>

      <template v-else>
        <!-- GymBros requests carousel (top-right, minimal) -->
        <div v-if="isOwnProfile && (requestsList.length || requestsLoading)" class="hidden md:flex absolute -top-2 right-0 z-20">
          <div class="w-80 max-w-xs rounded-xl shadow-lg bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-800 p-3">
            <div class="flex items-center justify-between mb-2">
              <div class="text-xs font-semibold text-primary-600 dark:text-primary-300">Demandes GymBros</div>
              <div class="text-xs text-primary-400">{{ requestsList.length }}</div>
            </div>
            <div v-if="requestsLoading" class="text-center py-6">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-sand-500"></div>
            </div>
            <div v-else-if="requestsList.length">
              <div class="flex items-center gap-3">
                <button @click="prevRequest" class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-800 flex items-center justify-center">
                  <Icon name="lucide:chevron-left" class="w-4 h-4" />
                </button>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full overflow-hidden bg-gradient-primary flex items-center justify-center">
                      <img v-if="requestsList[requestIndex].avatarUrl" :src="requestsList[requestIndex].avatarUrl" class="w-full h-full object-cover" />
                      <Icon v-else name="lucide:user" class="w-5 h-5 text-white" />
                    </div>
                    <div class="min-w-0">
                      <div class="font-semibold text-sm text-primary-900 dark:text-white truncate">{{ requestsList[requestIndex].username || requestsList[requestIndex].firstName || requestsList[requestIndex].email }}</div>
                      <div class="text-xs text-primary-500 dark:text-primary-400 truncate">{{ requestsList[requestIndex].message || 'Veut rejoindre tes GymBros' }}</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 mt-3">
                    <button @click.prevent="acceptRequestAction(requestsList[requestIndex].id)" class="flex-1 py-2 rounded-lg bg-emerald-600 text-white text-sm">Accepter</button>
                    <button @click.prevent="rejectRequestAction(requestsList[requestIndex].id)" class="py-2 px-3 rounded-lg bg-rose-50 text-rose-600 text-sm">Refuser</button>
                    <button @click.prevent="ignoreRequest" class="ml-1 py-2 px-2 rounded-lg bg-primary-50 text-primary-600 text-sm">Ignorer</button>
                  </div>
                </div>
                <button @click="nextRequest" class="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-800 flex items-center justify-center">
                  <Icon name="lucide:chevron-right" class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div v-else class="text-center py-4 text-xs text-primary-500">Aucune demande</div>
          </div>
        </div>
        <!-- Username setup prompt (first visit) -->
        <div v-if="showUsernameSetup" class="card-glass !p-6 text-center mb-6 fade-in">
          <Icon name="lucide:at-sign" class="w-12 h-12 mx-auto mb-3 text-sand-500" />
          <h2 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-2">
            Choisis ton pseudo
          </h2>
          <p class="text-sm text-primary-500 dark:text-primary-400 mb-4">
            C'est ton identifiant unique sur Athletiq
          </p>
          <form @submit.prevent="saveUsername" class="space-y-3">
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 text-sm"
                >@</span
              >
              <input
                v-model="usernameInput"
                type="text"
                class="input-primary pl-8"
                placeholder="ton_pseudo"
                pattern="[a-z0-9_]{3,20}"
                required
              />
            </div>
            <p v-if="usernameError" class="text-xs text-red-500">{{ usernameError }}</p>
            <p v-if="usernameAvailable === true" class="text-xs text-green-500">
              Pseudo disponible
            </p>
            <button
              type="submit"
              :disabled="!usernameAvailable || usernameLoading"
              class="btn-primary w-full py-3 disabled:opacity-50"
            >
              {{ usernameLoading ? 'Verification...' : 'Valider' }}
            </button>
          </form>
        </div>

        <!-- Profile content -->
        <template v-if="!showUsernameSetup || profileData?.username">
          <!-- Cover area with avatar -->
          <div class="text-center mb-6 fade-in">
            <!-- Avatar (carre avec coins arrondis) -->
            <div class="relative inline-block mb-4">
              <div class="w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-sand-500/30 mx-auto">
                <div
                  class="w-full h-full flex items-center justify-center"
                  :class="displayedUser?.avatarUrl ? '' : 'bg-gradient-primary'"
                >
                  <img
                    v-if="displayedUser?.avatarUrl"
                    :src="displayedUser.avatarUrl"
                    alt="Avatar"
                    class="w-full h-full object-cover"
                  />
                  <span v-else class="text-white text-3xl font-bold">{{ initials }}</span>
                </div>
              </div>
              <!-- Upload overlay (only for own profile) -->
              <label
                v-if="isOwnProfile"
                class="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 rounded-2xl cursor-pointer transition-colors group"
              >
                <Icon
                  name="lucide:camera"
                  class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                />
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

            <!-- Username + privacy badge -->
            <div class="flex items-center justify-center gap-2 flex-wrap">
              <h1
                v-if="profileData?.username"
                class="text-2xl font-bold text-primary-900 dark:text-primary-100"
              >
                @{{ profileData.username }}
              </h1>
              <h1 v-else class="text-2xl font-bold text-primary-900 dark:text-primary-100">
                {{ displayedUser?.firstName || displayedUser?.email }}
              </h1>
              <span
                v-if="profileData?.username"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold tracking-wide uppercase"
                :class="profileVisibility.badgeClass"
              >
                <Icon :name="profileVisibility.icon" class="w-3.5 h-3.5" />
              </span>
            </div>
            <p v-if="profileData?.bio" class="text-sm text-primary-500 dark:text-primary-400 mt-1">
              {{ profileData.bio }}
            </p>
          </div>

          <!-- Stats Row (buttons open modals) -->
          <div class="flex justify-center gap-8 mb-6 slide-up">
            <button
              @click="openWorkoutsModal"
              :disabled="!canOpenProfileModals"
              class="text-center transition-opacity cursor-pointer"
              :class="
                canOpenProfileModals
                  ? 'hover:opacity-70'
                  : 'cursor-not-allowed opacity-50 hover:opacity-50'
              "
            >
              <div class="flex items-center justify-center gap-1.5">
                <span class="text-lg font-bold text-primary-900 dark:text-primary-100">{{
                  profileData?.stats?.workoutCount ?? 0
                }}</span>
                <Icon
                  name="lucide:dumbbell"
                  class="w-4 h-4 text-primary-400 dark:text-primary-500"
                />
              </div>
              <p class="text-[11px] text-primary-500 dark:text-primary-400">Workouts</p>
            </button>
            <button
              @click="openGymBrosModal"
              :disabled="!canOpenProfileModals"
              class="text-center transition-opacity cursor-pointer"
              :class="
                canOpenProfileModals
                  ? 'hover:opacity-70'
                  : 'cursor-not-allowed opacity-50 hover:opacity-50'
              "
            >
              <div class="flex items-center justify-center gap-1.5">
                <span class="text-lg font-bold text-primary-900 dark:text-primary-100">{{
                  gymBrosCount
                }}</span>
                <Icon name="lucide:users" class="w-4 h-4 text-primary-400 dark:text-primary-500" />
              </div>
              <p class="text-[11px] text-primary-500 dark:text-primary-400">Gym Bros</p>
            </button>
            <button
              @click="openStreakModal"
              :disabled="!canOpenProfileModals"
              class="text-center transition-opacity cursor-pointer"
              :class="
                canOpenProfileModals
                  ? 'hover:opacity-70'
                  : 'cursor-not-allowed opacity-50 hover:opacity-50'
              "
            >
              <div class="flex items-center justify-center gap-1.5">
                <span class="text-lg font-bold text-primary-900 dark:text-primary-100">{{
                  profileData?.stats?.streak ?? 0
                }}</span>
                <Icon
                  name="lucide:flame"
                  class="w-4 h-4"
                  :class="
                    (profileData?.stats?.streak ?? 0) > 0
                      ? 'text-orange-500'
                      : 'text-primary-400 dark:text-primary-500'
                  "
                />
              </div>
              <p class="text-[11px] text-primary-500 dark:text-primary-400">Streak</p>
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-center gap-2 mb-8 slide-up">
            <template v-if="isOwnProfile">
              <NuxtLink
                to="/edit-profile"
                class="btn-glass px-5 py-2.5 text-sm font-medium inline-flex items-center gap-2"
              >
                <Icon name="lucide:edit-3" class="w-4 h-4" />
                Modifier
              </NuxtLink>
              <button
                v-if="profileData?.username"
                @click="showQrModal = true"
                class="btn-glass px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2"
                title="Mon QR Code"
              >
                <Icon name="lucide:qr-code" class="w-4 h-4" />
              </button>
              <NuxtLink
                to="/settings"
                class="btn-glass px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2"
                title="Parametres"
              >
                <Icon name="lucide:settings" class="w-4 h-4" />
              </NuxtLink>
            </template>
            <template v-else>
              <div class="flex items-center gap-2">
                <button
                  v-if="profileData?.requestPending"
                  class="btn-ghost px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2 cursor-not-allowed"
                  disabled
                >
                  <Icon name="lucide:clock" class="w-4 h-4" />
                  Demande envoyée
                </button>
                <button
                  v-else-if="profileData?.isFriend"
                  @click="removeFriendAction"
                  class="btn-danger px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2"
                >
                  <Icon name="lucide:user-minus" class="w-4 h-4" />
                  Supprimer
                </button>
                <button
                  v-else
                  @click="sendFriendRequestAction"
                  class="btn-primary px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2"
                >
                  <Icon name="lucide:user-plus" class="w-4 h-4" />
                  Ajouter
                </button>
                <!-- Removed extra Workouts / Gym Bros buttons: counters above now link to the right pages -->
              </div>
            </template>
          </div>

          <div v-if="profileData?.restricted" class="text-center py-8">
            <Icon name="lucide:lock" class="w-12 h-12 mx-auto mb-3 text-primary-400" />
            <p class="text-primary-500 dark:text-primary-400">
              Ce profil est privé. Les photos, posts et informations sont restreints.
            </p>
          </div>

          <!-- Tab Bar (Posts par defaut) -->
          <div v-if="!profileData?.restricted" class="flex justify-center mb-6">
            <div
              class="flex space-x-1 bg-white/50 dark:bg-primary-900/50 backdrop-blur-lg rounded-xl p-1"
            >
              <button
                @click="activeTab = 'posts'"
                :class="[
                  'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
                  activeTab === 'posts'
                    ? 'bg-gradient-primary text-white shadow-sm'
                    : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100',
                ]"
              >
                <Icon name="lucide:activity" class="w-4 h-4 inline-block mr-1 -mt-0.5" />
                Posts
              </button>
              <!-- Show Photos tab only on own profile -->
              <button
                v-if="isOwnProfile"
                @click="activeTab = 'photos'"
                :class="[
                  'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
                  activeTab === 'photos'
                    ? 'bg-gradient-primary text-white shadow-sm'
                    : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100',
                ]"
              >
                <Icon name="lucide:image" class="w-4 h-4 inline-block mr-1 -mt-0.5" />
                Photos
              </button>
            </div>
          </div>

          <!-- Posts Grid -->
          <div v-if="!profileData?.restricted && activeTab === 'posts'" class="slide-up">
            <div v-if="posts.length > 0" class="grid grid-cols-3 gap-4">
              <div v-for="post in posts" :key="post.id" class="relative rounded-lg overflow-hidden bg-primary-900/40" @click="openPostModal(post)" style="cursor:pointer;">
                <!-- Three-dots menu (top-right) -->
                <div class="absolute top-2 right-2 z-10">
                  <button
                    @click.stop="togglePostMenu(post.id)"
                    class="w-8 h-8 rounded-lg bg-white/80 dark:bg-primary-800/80 flex items-center justify-center text-primary-700 hover:bg-primary-950 hover:text-white transition-colors"
                    aria-label="Options"
                  >
                    <Icon name="lucide:more-vertical" class="w-4 h-4" />
                  </button>
                  <div v-if="openMenuPostId === post.id" class="mt-2 w-44 rounded-lg shadow-lg bg-white dark:bg-primary-900 border border-primary-200 dark:border-primary-800 overflow-hidden">
                    <button @click.stop.prevent="sharePost(post)" class="w-full text-left px-3 py-2 text-sm hover:bg-primary-50 dark:hover:bg-primary-800">Partager</button>
                    <button v-if="isOwnProfile" @click.stop.prevent="(async ()=>{ await deletePostAction(post.id) })()" class="w-full text-left px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20">Supprimer</button>
                  </div>
                </div>
                <div class="aspect-square w-full h-full">
                  <template v-if="post.type === 'PHOTO'">
                    <img v-if="post.data?.photoUrl" :src="post.data.photoUrl" class="w-full h-full object-cover" />
                    <img v-else-if="Array.isArray(post.data?.photos)" :src="post.data.photos[0]" class="w-full h-full object-cover" />
                    <div v-else-if="post.data?.beforeUrl && post.data?.afterUrl" class="w-full h-full grid grid-cols-2">
                      <img :src="post.data.beforeUrl" class="w-full h-full object-cover" />
                      <img :src="post.data.afterUrl" class="w-full h-full object-cover" />
                    </div>
                  </template>
                  <template v-else-if="post.type === 'TIMELAPSE'">
                    <img :src="post.data?.timelapseUrl" class="w-full h-full object-cover" />
                  </template>
                  <div v-if="Array.isArray(post.data?.photos) && post.data.photos.length > 1" class="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">{{ post.data.photos.length }}</div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-16">
              <Icon name="lucide:activity" class="w-16 h-16 mx-auto mb-4 text-primary-300 dark:text-primary-600" />
              <p class="text-primary-500 dark:text-primary-400 text-sm">Aucun post pour le moment</p>
            </div>
          </div>

          <!-- Photos Tab -->
          <div v-if="!profileData?.restricted && activeTab === 'photos'" class="slide-up space-y-4">
            <!-- Timelapse + Avant/Apres buttons -->
            <div v-if="primaryPhotos.length >= 2" class="flex gap-2">
              <button
                @click="showTimelapseModal = true"
                class="btn-glass px-3 py-2 text-xs font-medium inline-flex items-center gap-1.5 flex-1 justify-center"
              >
                <Icon name="lucide:film" class="w-3.5 h-3.5" />
                Timelapse
              </button>
              <button
                @click="openBeforeAfter"
                class="btn-glass px-3 py-2 text-xs font-medium inline-flex items-center gap-1.5 flex-1 justify-center"
              >
                <Icon name="lucide:git-compare" class="w-3.5 h-3.5" />
                Avant / Apres
              </button>
                        <button
                          v-if="isOwnProfile"
                          @click="showPhotoComposer = true"
                          class="btn-glass px-3 py-2 text-xs font-medium inline-flex items-center gap-1.5 flex-1 justify-center"
                        >
                          <Icon name="lucide:pen" class="w-3.5 h-3.5" />
                          Nouveau post
                        </button>
            </div>

            <!-- Photos grid with add button -->
            <div class="grid grid-cols-3 gap-1.5">
              <!-- Add photo button -->
              <div
                @click="showUploadModal = true"
                class="aspect-square rounded-lg border-2 border-dashed border-primary-300 dark:border-primary-600 flex flex-col items-center justify-center cursor-pointer hover:border-sand-500 dark:hover:border-sand-400 hover:bg-sand-500/5 transition-colors"
              >
                <Icon name="lucide:plus" class="w-6 h-6 text-primary-400 dark:text-primary-500" />
                <span class="text-[10px] text-primary-400 dark:text-primary-500 mt-1">Ajouter</span>
              </div>

              <!-- Photo items -->
              <div
                v-for="photo in photos"
                :key="photo.id"
                class="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                @click="selectedPhoto = photo"
              >
                <img
                  :src="photo.photoUrl"
                  :alt="`Photo`"
                  loading="lazy"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div
                  class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"
                ></div>
                <span v-if="photo.isPrimary" class="absolute top-1 left-1 text-yellow-400 text-xs"
                  >&#9733;</span
                >
                <button
                  @click.stop="publishPhoto(photo)"
                  class="absolute top-2 right-2 w-8 h-8 bg-white/80 dark:bg-primary-800/80 rounded-full flex items-center justify-center text-primary-900 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Publier"
                >
                  <Icon name="lucide:upload" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Empty state (no photos at all) -->
            <div v-if="photos.length === 0" class="text-center py-8">
              <p class="text-primary-400 dark:text-primary-500 text-xs">
                Prends des photos apres tes workouts pour suivre ta transformation
              </p>
            </div>
          </div>
        </template>
      </template>
    </div>

    <!-- QR Code Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showQrModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click="showQrModal = false"
        >
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <div
            class="relative bg-white dark:bg-primary-900 rounded-2xl p-6 max-w-sm w-full text-center shadow-xl"
            @click.stop
          >
            <button
              @click="showQrModal = false"
              class="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-primary-400 hover:text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
            >
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
            <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4">
              Mon QR Code
            </h3>
            <div class="flex justify-center mb-4">
              <div class="bg-white p-3 rounded-xl">
                <img
                  :src="`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrUrl)}`"
                  alt="QR Code"
                  width="220"
                  height="220"
                  class="block"
                />
              </div>
            </div>
            <p class="text-base font-semibold text-primary-900 dark:text-primary-100">
              @{{ profileData?.username }}
            </p>
            <p class="text-sm text-primary-500 dark:text-primary-400 mb-5">Scanne pour m'ajouter</p>
            <button
              @click="shareQr"
              class="w-full py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Icon name="lucide:share-2" class="w-4 h-4" />
              Partager
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Photo modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedPhoto"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click="selectedPhoto = null"
        >
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <img
            :src="selectedPhoto.photoUrl"
            class="relative max-w-full max-h-[90vh] rounded-2xl object-contain"
            @click.stop
          />
          <button
            @click="selectedPhoto = null"
            class="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-colors"
          >
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </div>
      </Transition>
    </Teleport>

    <!-- Workouts Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showWorkoutsModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click="showWorkoutsModal = false"
        >
          <div
            class="relative w-full max-w-lg overflow-hidden rounded-3xl border border-primary-200/70 bg-white/95 text-primary-900 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-primary-800/70 dark:bg-primary-950/95 dark:text-primary-100"
            @click.stop
          >
            <div class="flex justify-end px-3 pt-3">
              <button
                @click="showWorkoutsModal = false"
                class="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500 transition-colors hover:bg-primary-100 hover:text-primary-900 dark:bg-primary-900/70 dark:text-primary-300 dark:hover:bg-primary-800 dark:hover:text-white"
              >
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>
            <div class="max-h-[70vh] overflow-y-auto px-4 pb-4 custom-scrollbar">
              <div v-if="workoutsLoading" class="text-center py-10">
                <div
                  class="inline-block animate-spin rounded-full h-9 w-9 border-2 border-primary-200 border-t-sand-500 dark:border-primary-700"
                ></div>
              </div>
              <div v-else>
                <div v-if="workoutsList.length" class="space-y-3">
                  <div
                    v-for="w in workoutsList"
                    :key="w.id"
                    class="flex items-start justify-between gap-4 rounded-2xl border border-primary-200/80 bg-primary-50/70 p-4 shadow-sm transition-colors hover:border-sand-300 hover:bg-sand-50/70 dark:border-primary-800 dark:bg-primary-900/60 dark:hover:border-sand-500/30"
                  >
                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <Icon name="lucide:calendar-check-2" class="w-4 h-4 text-sand-500" />
                        <div class="font-semibold text-primary-950 dark:text-white truncate">
                          {{ w.name }}
                        </div>
                      </div>
                      <div class="mt-1 text-xs text-primary-500 dark:text-primary-400">
                        {{ formatDate(w.completedAt || w.createdAt) }} ·
                        {{ Math.max(1, Math.round((w.duration || 0) / 60)) }} min
                      </div>
                    </div>
                    <div
                      class="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary-600 shadow-sm dark:bg-primary-800 dark:text-primary-200"
                    >
                      {{ w.totalVolume ? `${Math.round(w.totalVolume)} kg` : '—' }}
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="rounded-2xl border border-dashed border-primary-200 bg-primary-50/60 py-12 text-center dark:border-primary-800 dark:bg-primary-900/40"
                >
                  <Icon
                    name="lucide:dumbbell"
                    class="w-12 h-12 mx-auto mb-3 text-primary-300 dark:text-primary-600"
                  />
                  <p class="text-primary-600 dark:text-primary-300 font-medium">
                    Aucun workout disponible
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- GymBros Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showGymBrosModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click="showGymBrosModal = false"
        >
          <div
            class="relative w-full max-w-md overflow-hidden rounded-3xl border border-primary-200/70 bg-white/95 text-primary-900 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-primary-800/70 dark:bg-primary-950/95 dark:text-primary-100"
            @click.stop
          >
            <div class="flex justify-end px-3 pt-3">
              <button
                @click="showGymBrosModal = false"
                class="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500 transition-colors hover:bg-primary-100 hover:text-primary-900 dark:bg-primary-900/70 dark:text-primary-300 dark:hover:bg-primary-800 dark:hover:text-white"
              >
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>
            <div class="max-h-[70vh] overflow-y-auto px-4 pb-4 custom-scrollbar">
              <div v-if="gymBrosLoading" class="text-center py-10">
                <div
                  class="inline-block animate-spin rounded-full h-9 w-9 border-2 border-primary-200 border-t-sand-500 dark:border-primary-700"
                ></div>
              </div>
              <div v-else>
                <div v-if="gymBrosList.length" class="space-y-3">
                  <div
                    v-for="g in gymBrosList"
                    :key="g.id"
                    class="group flex items-center gap-3 rounded-2xl border border-primary-200/80 bg-primary-50/70 p-3 shadow-sm transition hover:border-sand-300 hover:bg-sand-50/70 dark:border-primary-800 dark:bg-primary-900/60 dark:hover:border-sand-500/30"
                  >
                    <div
                      class="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-primary flex items-center justify-center ring-2 ring-white/60 dark:ring-primary-900"
                    >
                      <img
                        v-if="g.avatarUrl"
                        :src="g.avatarUrl"
                        class="w-full h-full object-cover"
                      />
                      <Icon v-else name="lucide:user" class="w-5 h-5 text-white" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="font-semibold text-primary-950 dark:text-white truncate">
                        {{ g.username || g.firstName || g.email }}
                      </div>
                    </div>
                    <button
                      @click.prevent="navigateTo(`/profile/${g.username || g.id}`)"
                      class="shrink-0 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-primary-700 shadow-sm transition hover:bg-primary-950 hover:text-white dark:bg-primary-800 dark:text-primary-100 dark:hover:bg-primary-700 dark:hover:text-white"
                    >
                      Voir
                    </button>
                  </div>
                </div>
                <div
                  v-else
                  class="rounded-2xl border border-dashed border-primary-200 bg-primary-50/60 py-12 text-center dark:border-primary-800 dark:bg-primary-900/40"
                >
                  <Icon
                    name="lucide:users"
                    class="w-12 h-12 mx-auto mb-3 text-primary-300 dark:text-primary-600"
                  />
                  <p class="text-primary-600 dark:text-primary-300 font-medium">
                    Aucun Gym Bro disponible
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Streak Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showStreakModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click="showStreakModal = false"
        >
          <div
            class="relative w-full max-w-md overflow-hidden rounded-3xl border border-primary-200/70 bg-white/95 text-primary-900 shadow-[0_30px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-primary-800/70 dark:bg-primary-950/95 dark:text-primary-100"
            @click.stop
          >
            <div class="flex justify-end px-3 pt-3">
              <button
                @click="showStreakModal = false"
                class="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500 transition-colors hover:bg-primary-100 hover:text-primary-900 dark:bg-primary-900/70 dark:text-primary-300 dark:hover:bg-primary-800 dark:hover:text-white"
              >
                <Icon name="lucide:x" class="w-5 h-5" />
              </button>
            </div>
            <div class="max-h-[70vh] overflow-y-auto px-4 pb-4 custom-scrollbar">
              <div v-if="streakLoading" class="text-center py-10">
                <div
                  class="inline-block animate-spin rounded-full h-9 w-9 border-2 border-primary-200 border-t-sand-500 dark:border-primary-700"
                ></div>
              </div>
              <div v-else>
                <div v-if="streakData" class="space-y-4">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="card-glass !p-4">
                      <p class="text-xs text-primary-500 dark:text-primary-400">Streak actuel</p>
                      <p class="mt-2 text-3xl font-bold text-primary-950 dark:text-white">
                        {{ streakData.currentStreak }}
                      </p>
                    </div>
                    <div class="card-glass !p-4">
                      <p class="text-xs text-primary-500 dark:text-primary-400">
                        Objectif / semaine
                      </p>
                      <p class="mt-2 text-3xl font-bold text-primary-950 dark:text-white">
                        {{ streakData.streakGoalPerWeek ?? '—' }}
                      </p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div class="card-glass !p-4">
                      <p class="text-xs text-primary-500 dark:text-primary-400">
                        Workouts cette semaine
                      </p>
                      <p class="mt-2 text-xl font-bold text-primary-950 dark:text-white">
                        {{ streakData.currentWeekWorkouts ?? '—' }}
                      </p>
                    </div>
                    <div class="card-glass !p-4">
                      <p class="text-xs text-primary-500 dark:text-primary-400">
                        Dernier entraînement
                      </p>
                      <p class="mt-2 text-xl font-bold text-primary-950 dark:text-white">
                        {{
                          streakData.daysSinceLastWorkout === null
                            ? '—'
                            : `${streakData.daysSinceLastWorkout} j`
                        }}
                      </p>
                    </div>
                  </div>

                  <div
                    v-if="streakData.weeklyHistory && streakData.weeklyHistory.length"
                    class="card-glass !p-4"
                  >
                    <ul class="space-y-2 text-sm">
                      <li
                        v-for="w in streakData.weeklyHistory.slice(-8)"
                        :key="w.week"
                        class="flex items-center justify-between rounded-xl bg-primary-50 px-3 py-2 dark:bg-primary-800/50"
                      >
                        <span class="text-primary-600 dark:text-primary-300">{{ w.week }}</span>
                        <span
                          class="font-semibold"
                          :class="
                            w.metGoal
                              ? 'text-emerald-600 dark:text-emerald-300'
                              : 'text-rose-500 dark:text-rose-300'
                          "
                          >{{ w.count }} {{ w.metGoal ? '✓' : '✗' }}</span
                        >
                      </li>
                    </ul>
                  </div>
                </div>
                <div
                  v-else
                  class="rounded-2xl border border-dashed border-primary-200 bg-primary-50/60 py-12 text-center dark:border-primary-800 dark:bg-primary-900/40"
                >
                  <Icon
                    name="lucide:flame"
                    class="w-12 h-12 mx-auto mb-3 text-primary-300 dark:text-primary-600"
                  />
                  <p class="text-primary-600 dark:text-primary-300 font-medium">
                    Aucune donnée de streak disponible
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Upload Photo Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showUploadModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click="showUploadModal = false"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div
            class="relative bg-white dark:bg-primary-900 rounded-2xl p-6 max-w-sm w-full shadow-xl"
            @click.stop
          >
            <button
              @click="showUploadModal = false"
              class="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-primary-400 hover:text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
            >
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
            <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4">
              Ajouter une photo
            </h3>
            <div class="space-y-4">
              <div>
                <label
                  class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1.5"
                  >Workout associe</label
                >
                <select
                  v-model="uploadWorkoutId"
                  class="w-full px-3 py-2.5 rounded-xl border border-primary-200 dark:border-primary-700 bg-white/60 dark:bg-primary-800/60 text-sm text-primary-900 dark:text-primary-100 focus:outline-none focus:ring-2 focus:ring-sand-500/50"
                >
                  <option :value="null" disabled>Selectionner...</option>
                  <option v-for="w in completedWorkouts" :key="w.id" :value="w.id">
                    {{ w.name }} — {{ formatDate(w.completedAt || w.createdAt) }}
                  </option>
                </select>
              </div>
              <label
                class="flex items-center gap-2 text-sm text-primary-700 dark:text-primary-300 cursor-pointer"
              >
                <input
                  type="checkbox"
                  v-model="uploadIsPrimary"
                  class="w-4 h-4 rounded border-primary-300 dark:border-primary-600 text-sand-600 focus:ring-sand-600"
                />
                Photo principale (timelapse)
              </label>
              <label
                class="btn-primary w-full cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Icon name="lucide:camera" class="w-4 h-4" />
                <span>{{ uploadingPhoto ? 'Upload...' : 'Choisir une photo' }}</span>
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handlePhotoUpload"
                  :disabled="!uploadWorkoutId || uploadingPhoto"
                />
              </label>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Photo Composer Modal (multi-select) -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showPhotoComposer"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click="showPhotoComposer = false"
        >
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div class="relative bg-white dark:bg-primary-900 rounded-2xl p-6 max-w-lg w-full shadow-xl" @click.stop>
            <button @click="showPhotoComposer = false" class="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-primary-400 hover:text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
            <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4">Nouveau post</h3>
            <textarea v-model="composerCaption" placeholder="Ajouter une description (optionnel)" class="w-full p-3 rounded-lg border border-primary-200 dark:border-primary-700 bg-white/60 dark:bg-primary-800/60 text-sm text-primary-900 dark:text-primary-100 mb-3"></textarea>

            <!-- Composer limited to Photos only per UX request -->

            <div class="grid grid-cols-3 gap-1 max-h-72 overflow-auto mb-3">
              <label v-for="photo in photos" :key="photo.id" class="relative cursor-pointer">
                <input type="checkbox" :value="photo.id" v-model="selectedForPost" class="hidden" />
                <img :src="photo.photoUrl" class="w-full h-24 object-cover rounded-md" />
                <div v-if="selectedForPost.includes(photo.id)" class="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                  <Icon name="lucide:check" class="w-6 h-6" />
                </div>
              </label>
            </div>

            <div v-if="selectedForPost.length > 1" class="flex items-center gap-3 mb-3">
              <div class="text-sm text-primary-600">Présentation :</div>
              <select v-model="composerLayout" class="rounded-md border border-primary-200 dark:border-primary-700 bg-white/60 dark:bg-primary-800/60 px-2 py-1 text-sm">
                <option value="carousel">Carrousel</option>
                <option value="gallery">Galerie</option>
              </select>
            </div>

            <div class="flex justify-end gap-2">
              <button @click="showPhotoComposer = false" class="btn-glass px-4 py-2">Annuler</button>
              <button v-if="composerMode === 'photos'" @click="publishSelectedPhotos" class="btn-primary px-4 py-2">Publier</button>
              <button v-if="composerMode === 'timelapse'" @click="generateAndPublishTimelapse" :disabled="composerLoading" class="btn-primary px-4 py-2">{{ composerLoading ? 'Génération...' : 'Générer et publier timelapse' }}</button>
              <button v-if="composerMode === 'beforeafter'" @click="publishBeforeAfterFromComposer" class="btn-primary px-4 py-2">Publier Avant/Après</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Edit Post Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click="showEditModal = false">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div class="relative bg-white dark:bg-primary-900 rounded-2xl p-6 max-w-md w-full shadow-xl" @click.stop>
            <button @click="showEditModal = false" class="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-primary-400 hover:text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
            <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4">Modifier le post</h3>
            <textarea v-model="editCaption" placeholder="Texte du post" class="w-full p-3 rounded-lg border border-primary-200 dark:border-primary-700 bg-white/60 dark:bg-primary-800/60 text-sm text-primary-900 dark:text-primary-100 mb-3"></textarea>
              <div v-if="editingPostId && posts.find(p => p.id === editingPostId)?.data" class="mb-3">
                <div class="text-sm text-primary-600 mb-2">Sélectionner depuis mes photos</div>
                <div class="grid grid-cols-4 gap-2 max-h-56 overflow-auto mb-2">
                  <label v-for="photo in photos" :key="photo.id" class="relative cursor-pointer">
                    <input type="checkbox" :value="photo.id" v-model="editSelectedPhotos" class="hidden" />
                    <img :src="photo.photoUrl" class="w-full h-20 object-cover rounded-md" />
                    <div v-if="editSelectedPhotos.includes(photo.id)" class="absolute inset-0 bg-black/30 flex items-center justify-center text-white">
                      <Icon name="lucide:check" class="w-6 h-6" />
                    </div>
                  </label>
                </div>
                  <div class="text-xs text-primary-500 mb-2">Ou garde l_media actuelle si aucune sélection</div>
                  <div v-if="editSelectedPhotos.length > 1" class="flex items-center gap-3 mb-2">
                    <div class="text-sm text-primary-600">Présentation :</div>
                    <select v-model="editLayout" class="rounded-md border border-primary-200 dark:border-primary-700 bg-white/60 dark:bg-primary-800/60 px-2 py-1 text-sm">
                      <option value="carousel">Carrousel</option>
                      <option value="gallery">Galerie</option>
                    </select>
                  </div>
              </div>
            <div class="flex justify-end gap-2">
              <button @click="showEditModal = false" class="btn-glass px-4 py-2">Annuler</button>
              <button @click="saveEdit" class="btn-primary px-4 py-2">Enregistrer</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Timelapse Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showTimelapseModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click="showTimelapseModal = false"
        >
          <div class="absolute inset-0 bg-black/90"></div>
          <div class="relative max-w-lg w-full" @click.stop>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-white font-bold text-lg">Timelapse</h3>
              <div class="flex items-center gap-2">
                <button
                  @click="shareTimelapse"
                  class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors"
                  title="Partager"
                >
                  <Icon name="lucide:share-2" class="w-5 h-5" />
                </button>
                <button
                  @click="publishTimelapse"
                  class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors"
                  title="Publier"
                >
                  <Icon name="lucide:upload" class="w-5 h-5" />
                </button>
                <button
                  @click="showTimelapseModal = false"
                  class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors"
                >
                  <Icon name="lucide:x" class="w-5 h-5" />
                </button>
              </div>
            </div>
            <div class="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black">
              <Transition name="fade" mode="out-in">
                <img
                  :key="timelapseIndex"
                  :src="primaryPhotos[timelapseIndex]?.photoUrl"
                  class="w-full h-full object-cover"
                />
              </Transition>
              <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span class="bg-black/60 text-white text-xs px-2 py-1 rounded-lg">{{
                  formatDate(primaryPhotos[timelapseIndex]?.createdAt)
                }}</span>
                <span class="bg-black/60 text-white text-xs px-2 py-1 rounded-lg"
                  >{{ timelapseIndex + 1 }} / {{ primaryPhotos.length }}</span
                >
              </div>
            </div>
            <div class="flex items-center justify-center gap-3 mt-4">
              <button
                @click="timelapseIndex = Math.max(0, timelapseIndex - 1)"
                :disabled="timelapseIndex === 0"
                class="w-10 h-10 bg-white/20 hover:bg-white/30 disabled:opacity-30 rounded-xl flex items-center justify-center text-white transition-colors"
              >
                <Icon name="lucide:chevron-left" class="w-5 h-5" />
              </button>
              <button
                @click="toggleTimelapsePlay"
                class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors"
              >
                <Icon :name="timelapseAutoPlay ? 'lucide:pause' : 'lucide:play'" class="w-5 h-5" />
              </button>
              <button
                @click="timelapseIndex = Math.min(primaryPhotos.length - 1, timelapseIndex + 1)"
                :disabled="timelapseIndex >= primaryPhotos.length - 1"
                class="w-10 h-10 bg-white/20 hover:bg-white/30 disabled:opacity-30 rounded-xl flex items-center justify-center text-white transition-colors"
              >
                <Icon name="lucide:chevron-right" class="w-5 h-5" />
              </button>
              <!-- Speed controls -->
              <div class="h-6 w-px bg-white/20 mx-1"></div>
              <button
                v-for="speed in timelapseSpeeds"
                :key="speed"
                @click="timelapseSpeed = speed"
                :class="[
                  'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  timelapseSpeed === speed
                    ? 'bg-white/30 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20',
                ]"
              >
                {{ speed }}x
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Before/After Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showBeforeAfterModal"
          class="fixed inset-0 z-[100] flex items-center justify-center p-4"
          @click="showBeforeAfterModal = false"
        >
          <div class="absolute inset-0 bg-black/90"></div>
          <div class="relative max-w-md w-full" @click.stop>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-white font-bold text-lg">Avant / Apres</h3>
              <div class="flex items-center gap-2">
                <button
                  @click="shareBeforeAfter"
                  class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors"
                  title="Partager"
                >
                  <Icon name="lucide:share-2" class="w-5 h-5" />
                </button>
                <button
                  @click="publishBeforeAfter"
                  class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors"
                  title="Publier"
                >
                  <Icon name="lucide:upload" class="w-5 h-5" />
                </button>
                <button
                  @click="showBeforeAfterModal = false"
                  class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors"
                >
                  <Icon name="lucide:x" class="w-5 h-5" />
                </button>
              </div>
            </div>
            <!-- Photo selectors -->
            <div class="flex gap-3 mb-4">
              <select
                v-model="beforePhotoIndex"
                class="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none"
              >
                <option
                  v-for="(p, i) in primaryPhotos"
                  :key="'b' + p.id"
                  :value="i"
                  class="text-black"
                >
                  {{ formatDate(p.createdAt) }}
                </option>
              </select>
              <select
                v-model="afterPhotoIndex"
                class="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none"
              >
                <option
                  v-for="(p, i) in primaryPhotos"
                  :key="'a' + p.id"
                  :value="i"
                  class="text-black"
                >
                  {{ formatDate(p.createdAt) }}
                </option>
              </select>
            </div>
            <!-- Slider comparison -->
            <div
              class="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-col-resize select-none"
              @mousedown="startSliderDrag"
              @mousemove="onSliderDrag"
              @mouseup="stopSliderDrag"
              @mouseleave="stopSliderDrag"
              @touchstart.prevent="startSliderTouch"
              @touchmove.prevent="onSliderTouch"
              @touchend="stopSliderDrag"
              ref="sliderContainer"
            >
              <!-- After photo (full, behind) -->
              <img
                :src="primaryPhotos[afterPhotoIndex]?.photoUrl"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <!-- Before photo (clipped) -->
              <div
                class="absolute inset-0 overflow-hidden"
                :style="{ width: sliderPosition + '%' }"
              >
                <img
                  :src="primaryPhotos[beforePhotoIndex]?.photoUrl"
                  class="absolute inset-0 w-full h-full object-cover"
                  :style="{ minWidth: sliderContainerWidth + 'px' }"
                />
              </div>
              <!-- Slider line -->
              <div
                class="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
                :style="{ left: sliderPosition + '%' }"
              >
                <div
                  class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center"
                >
                  <Icon name="lucide:move-horizontal" class="w-4 h-4 text-primary-900" />
                </div>
              </div>
              <!-- Labels -->
              <span
                class="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg"
                >Avant</span
              >
              <span
                class="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg"
                >Apres</span
              >
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Post viewer modal (full-size) -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showPostModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4" @click="closePostModal">
          <div class="absolute inset-0 bg-black/80"></div>
          <div class="relative max-w-3xl w-full rounded-2xl bg-white dark:bg-primary-900 shadow-xl p-4" @click.stop>
            <button @click="closePostModal" class="absolute top-4 right-4 w-10 h-10 rounded-lg flex items-center justify-center text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-800">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
                <div class="flex gap-4">
              <div class="flex-1">
                <div class="w-full h-[60vh] bg-black rounded-lg overflow-hidden flex items-center justify-center">
                  <template v-if="selectedPost?.type === 'PHOTO'">
                    <div v-if="selectedPost.data?.photoUrl" class="w-full h-full flex items-center justify-center">
                      <img :src="selectedPost.data.photoUrl" class="w-full h-full object-contain" />
                    </div>
                    <div v-else-if="Array.isArray(selectedPost.data?.photos)">
                      <div class="relative w-full h-full">
                        <img :src="selectedPost.data.photos[(carouselIndexMap[selectedPost.id] ?? 0)]" class="w-full h-full object-contain" />
                        <button @click="prevCarousel(selectedPost.id, selectedPost.data.photos.length)" class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/60 rounded-full flex items-center justify-center z-20">
                          <Icon name="lucide:chevron-left" class="w-5 h-5" />
                        </button>
                        <button @click="nextCarousel(selectedPost.id, selectedPost.data.photos.length)" class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/60 rounded-full flex items-center justify-center z-20">
                          <Icon name="lucide:chevron-right" class="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div v-else-if="selectedPost.data?.beforeUrl && selectedPost.data?.afterUrl" class="w-full h-full grid grid-cols-2 gap-1">
                      <img :src="selectedPost.data.beforeUrl" class="w-full h-full object-contain" />
                      <img :src="selectedPost.data.afterUrl" class="w-full h-full object-contain" />
                    </div>
                  </template>
                  <template v-else-if="selectedPost?.type === 'TIMELAPSE'">
                    <img
                      v-if="!modalImageError"
                      :src="selectedPost.data?.timelapseUrl"
                      class="w-full h-full object-contain"
                      @error="modalImageError = true"
                    />
                    <video v-else controls :src="selectedPost.data?.timelapseUrl" class="w-full h-full object-contain" />
                  </template>
                </div>
              </div>
              <div class="w-80 max-h-[60vh] overflow-auto p-3 border-l border-primary-200/60 dark:border-primary-800/60">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-gradient-primary flex items-center justify-center">
                    <img v-if="selectedPost?.user?.avatarUrl" :src="selectedPost.user.avatarUrl" class="w-full h-full object-cover" />
                    <Icon v-else name="lucide:user" class="w-5 h-5 text-white" />
                  </div>
                  <div class="min-w-0">
                    <div class="font-semibold text-primary-900 dark:text-white truncate">@{{ selectedPost?.user?.username || selectedPost?.user?.firstName || selectedPost?.userName || selectedPost?.username || selectedPost?.userId || 'utilisateur' }}</div>
                    <div class="text-xs text-primary-500">{{ timeAgo(selectedPost?.createdAt) }}</div>
                  </div>
                </div>
                <p v-if="selectedPost?.data?.caption" class="text-sm text-primary-700 dark:text-primary-300 mb-2">{{ selectedPost.data.caption }}</p>
                <div v-if="selectedPost?.data?.photos && selectedPost.data.photos.length" class="flex gap-2 items-center">
                  <span v-for="(p, i) in selectedPost.data.photos" :key="i" @click="carouselIndexMap[selectedPost.id] = i" :class="['w-2 h-2 rounded-full cursor-pointer', (carouselIndexMap[selectedPost.id] ?? 0) === i ? 'bg-primary-700' : 'bg-primary-200']"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <MobileBottomNav active-path="/profile" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import { useSocialApi } from '~/composables/useSocialApi';
import { apiFetch } from '~/utils/apiFetch';
import { useBodyApi } from '~/composables/useBodyApi';
/* TopNav imported and rendered globally in app.vue; per-page import removed */

definePageMeta({
  layout: false,
  middleware: 'auth',
});

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const authStore = useAuthStore();
const { getMyProfile, getProfile, updateProfile, checkUsername, sendFriendRequest, removeFriend, createPost, editPost, deletePost, getRequests, acceptRequest, rejectRequest } =
  useSocialApi();
const bodyApi = useBodyApi();
const { getRecentPhotos } = bodyApi;
const toast = useToast();
const workoutStore = useWorkoutStore();
const statsApi = useStatsApi();

// Modals for stats
const showWorkoutsModal = ref(false);
const showGymBrosModal = ref(false);
const showStreakModal = ref(false);

// Gym bro requests (carousel)
const requestsLoading = ref(false);
const requestsList = ref<any[]>([]);
const requestIndex = ref(0);

const loadRequests = async () => {
  requestsLoading.value = true;
  try {
    const res: any = await getRequests();
    requestsList.value = res?.requests || res || [];
    requestIndex.value = 0;
  } catch (e) {
    console.error('Failed to load requests', e);
  } finally {
    requestsLoading.value = false;
  }
};

const prevRequest = () => {
  if (!requestsList.value.length) return;
  requestIndex.value = (requestIndex.value - 1 + requestsList.value.length) % requestsList.value.length;
};
const nextRequest = () => {
  if (!requestsList.value.length) return;
  requestIndex.value = (requestIndex.value + 1) % requestsList.value.length;
};

const acceptRequestAction = async (id: number) => {
  try {
    await acceptRequest(id);
    requestsList.value = requestsList.value.filter((r) => r.id !== id);
    requestIndex.value = Math.min(requestIndex.value, Math.max(0, requestsList.value.length - 1));
    toast.success('Demande acceptée');
  } catch (e) {
    console.error(e);
    toast.error('Impossible d\'accepter la demande');
  }
};

const rejectRequestAction = async (id: number) => {
  try {
    await rejectRequest(id);
    requestsList.value = requestsList.value.filter((r) => r.id !== id);
    requestIndex.value = Math.min(requestIndex.value, Math.max(0, requestsList.value.length - 1));
    toast.success('Demande refusée');
  } catch (e) {
    console.error(e);
    toast.error('Impossible de refuser la demande');
  }
};

const ignoreRequest = () => {
  // just advance the carousel without hitting API
  nextRequest();
};

const workoutsLoading = ref(false);
const gymBrosLoading = ref(false);
const streakLoading = ref(false);

const workoutsList = ref<any[]>([]);
const gymBrosList = ref<any[]>([]);
const streakData = ref<any | null>(null);

const profileVisibility = computed(() => {
  const isPrivate = profileData.value?.isPublic === false;
  return {
    label: isPrivate ? 'Privé' : 'Public',
    icon: isPrivate ? 'lucide:lock' : 'lucide:globe',
    badgeClass: isPrivate
      ? 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-300'
      : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  };
});

const canOpenProfileModals = computed(() => {
  if (isOwnProfile.value) return true;
  if (profileData.value?.restricted) return false;
  return profileData.value?.isPublic !== false;
});

const openWorkoutsModal = async () => {
  if (!canOpenProfileModals.value) {
    toast.error('Profil prive — contenu indisponible');
    return;
  }

  showWorkoutsModal.value = true;
  if (profileData.value?.workouts?.length) {
    workoutsList.value = profileData.value.workouts;
  } else if (isOwnProfile.value) {
    if (!workoutStore.workoutHistory.length) {
      workoutsLoading.value = true;
      try {
        await workoutStore.fetchWorkouts();
        workoutsList.value = workoutStore.workoutHistory;
      } catch (e) {
        toast.error("Impossible de charger l'historique");
      } finally {
        workoutsLoading.value = false;
      }
    } else {
      workoutsList.value = workoutStore.workoutHistory;
    }
  } else {
    workoutsList.value = [];
    toast.error('Historique non disponible pour ce profil');
  }
};

const openGymBrosModal = async () => {
  if (!canOpenProfileModals.value) {
    toast.error('Profil prive — contenu indisponible');
    return;
  }

  showGymBrosModal.value = true;
  gymBrosLoading.value = true;
  try {
    if (profileData.value?.friends?.length) {
      gymBrosList.value = profileData.value.friends;
    } else if (isOwnProfile.value) {
      gymBrosList.value = [];
    } else {
      toast.error('Liste des amis non disponible pour ce profil');
      gymBrosList.value = [];
    }
  } catch (e) {
    toast.error('Impossible de charger la liste des gym bros');
    gymBrosList.value = [];
  } finally {
    gymBrosLoading.value = false;
  }
};

const openStreakModal = async () => {
  if (!canOpenProfileModals.value) {
    toast.error('Profil prive — contenu indisponible');
    return;
  }

  showStreakModal.value = true;
  streakLoading.value = true;
  try {
    if (isOwnProfile.value) {
      try {
        streakData.value = await statsApi.getStreak();
      } catch {
        const stats = profileData.value?.stats || {};
        streakData.value = {
          currentStreak: stats.streak || 0,
          bestStreak: stats.bestStreak || stats.streak || 0,
          streakGoalPerWeek: stats.streakGoalPerWeek ?? stats.goalPerWeek ?? null,
          currentWeekWorkouts: stats.currentWeekWorkouts ?? null,
          daysSinceLastWorkout: stats.daysSinceLastWorkout ?? null,
          weeklyHistory: stats.weeklyHistory || [],
          milestones: stats.milestones || [],
          nextMilestone: stats.nextMilestone ?? null,
        };
      }
    } else {
      const stats = profileData.value?.stats || {};
      streakData.value = {
        currentStreak: stats.streak || 0,
        bestStreak: stats.bestStreak || stats.streak || 0,
        streakGoalPerWeek: stats.streakGoalPerWeek ?? stats.goalPerWeek ?? null,
        currentWeekWorkouts: stats.currentWeekWorkouts ?? null,
        daysSinceLastWorkout: stats.daysSinceLastWorkout ?? null,
        weeklyHistory: stats.weeklyHistory || [],
        milestones: stats.milestones || [],
        nextMilestone: stats.nextMilestone ?? null,
      };
    }
  } catch (e) {
    toast.error('Impossible de charger le résumé de streak');
    streakData.value = null;
  } finally {
    streakLoading.value = false;
  }
};

const pageLoading = ref(true);
const activeTab = ref<'photos' | 'posts'>('posts');
const profileData = ref<any>(null);
const photos = ref<any[]>([]);
const posts = ref<any[]>([]);
const openMenuPostId = ref<number | null>(null);
const selectedPhoto = ref<any>(null);
const avatarUploading = ref(false);
const showQrModal = ref(false);
const gymBrosCount = ref(0);

// Photo upload
const showUploadModal = ref(false);
const uploadWorkoutId = ref<number | null>(null);
const uploadIsPrimary = ref(false);
const uploadingPhoto = ref(false);
const completedWorkouts = computed(() => {
  return (workoutStore.workouts || []).filter((w: any) => w.completedAt);
});

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const handlePhotoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !uploadWorkoutId.value) return;
  if (!file.type.startsWith('image/')) {
    toast.error('Le fichier doit etre une image');
    input.value = '';
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.error('La photo ne doit pas depasser 5 Mo');
    input.value = '';
    return;
  }
  uploadingPhoto.value = true;
  try {
    await bodyApi.uploadPhoto(uploadWorkoutId.value, file, uploadIsPrimary.value);
    toast.success('Photo ajoutee !');
    showUploadModal.value = false;
    uploadWorkoutId.value = null;
    uploadIsPrimary.value = false;
    // Reload photos
    photos.value = await getRecentPhotos(50);
  } catch {
    toast.error("Erreur lors de l'upload");
  } finally {
    uploadingPhoto.value = false;
    input.value = '';
  }
};

// Photo composer (multi-select + modes)
const showPhotoComposer = ref(false);
const composerCaption = ref('');
const selectedForPost = ref<number[]>([]);
const composerMode = ref<'photos' | 'timelapse' | 'beforeafter'>('photos');
const composerLoading = ref(false);
const composerLayout = ref<'carousel' | 'gallery'>('carousel');
const carouselIndexMap = ref<Record<number, number>>({});

const ensureCarouselIndex = (postId: number) => {
  if (carouselIndexMap.value[postId] === undefined) carouselIndexMap.value[postId] = 0;
};

const nextCarousel = (postId: number, count: number) => {
  ensureCarouselIndex(postId);
  carouselIndexMap.value[postId] = (carouselIndexMap.value[postId] + 1) % Math.max(1, count);
};

const prevCarousel = (postId: number, count: number) => {
  ensureCarouselIndex(postId);
  carouselIndexMap.value[postId] = (carouselIndexMap.value[postId] - 1 + Math.max(1, count)) % Math.max(1, count);
};

// Post viewer modal
const selectedPost = ref<any | null>(null);
const showPostModal = ref(false);
const modalImageError = ref(false);
const openPostModal = (post: any) => {
  selectedPost.value = post;
  modalImageError.value = false;
  ensureCarouselIndex(post.id);
  showPostModal.value = true;
};
const closePostModal = () => {
  showPostModal.value = false;
  selectedPost.value = null;
};

const toggleSelectForPost = (photoId: number) => {
  const idx = selectedForPost.value.indexOf(photoId);
  if (idx === -1) selectedForPost.value.push(photoId);
  else selectedForPost.value.splice(idx, 1);
};

const publishSelectedPhotos = async () => {
  if (!selectedForPost.value.length) return toast.error('Selectionne au moins une photo');
  const photosUrls = photos.value
    .filter((p: any) => selectedForPost.value.includes(p.id))
    .map((p: any) => p.photoUrl);
  try {
    const payloadData: any = { photos: photosUrls, caption: composerCaption.value || null };
    if (photosUrls.length > 1) payloadData.layout = composerLayout.value;
    const created: any = await createPost({ type: 'PHOTO', data: payloadData });
    const newPost = {
      id: created.id,
      type: 'PHOTO',
      data: { photos: photosUrls, caption: composerCaption.value || null, ...(photosUrls.length > 1 ? { layout: composerLayout.value } : {}) },
      reactions: 0,
      createdAt: created.createdAt || new Date().toISOString(),
      user: {
        id: authStore.user?.id,
        firstName: authStore.user?.firstName,
        lastName: authStore.user?.lastName,
        username: authStore.user?.username,
        avatarUrl: authStore.user?.avatarUrl,
      },
    };
    posts.value.unshift(newPost);
    toast.success('Post publié');
    showPhotoComposer.value = false;
    composerCaption.value = '';
    composerLayout.value = 'carousel';
    selectedForPost.value = [];
  } catch (e) {
    console.error(e);
    toast.error("Impossible de publier le post");
  }
};

// Generate timelapse from selected photos and publish
const generateAndPublishTimelapse = async () => {
  if (selectedForPost.value.length < 2) return toast.error('Selectionne au moins deux photos pour un timelapse');
  const images = photos.value
    .filter((p: any) => selectedForPost.value.includes(p.id))
    .map((p: any) => p.photoUrl);
  try {
    composerLoading.value = true;
    toast.info('Génération du timelapse...');
    const res: any = await apiFetch('/timelapse/generate', { method: 'POST', body: { images } });
    const url = res?.url || res?.secure_url || res?.secureUrl || res?.secure_url;
    if (!url) throw new Error('No URL');
    const created: any = await createPost({ type: 'TIMELAPSE', data: { timelapseUrl: url, photoCount: images.length, caption: composerCaption.value || null } });
    const newPost = {
      id: created.id,
      type: 'TIMELAPSE',
      data: { timelapseUrl: url, photoCount: images.length, caption: composerCaption.value || null },
      reactions: 0,
      createdAt: created.createdAt || new Date().toISOString(),
      user: {
        id: authStore.user?.id,
        firstName: authStore.user?.firstName,
        lastName: authStore.user?.lastName,
        username: authStore.user?.username,
        avatarUrl: authStore.user?.avatarUrl,
      },
    };
    posts.value.unshift(newPost);
    toast.success('Timelapse publié');
    showPhotoComposer.value = false;
    composerCaption.value = '';
    composerLayout.value = 'carousel';
    selectedForPost.value = [];
  } catch (e) {
    console.error(e);
    toast.error('Impossible de générer/publier le timelapse');
  } finally {
    composerLoading.value = false;
  }
};

// Publish before/after using two selected photos (first/last)
const publishBeforeAfterFromComposer = async () => {
  if (selectedForPost.value.length < 2) return toast.error('Selectionne au moins deux photos');
  const selected = photos.value.filter((p: any) => selectedForPost.value.includes(p.id));
  const before = selected[0];
  const after = selected[selected.length - 1];
  try {
    const created: any = await createPost({ type: 'PHOTO', data: { beforeUrl: before.photoUrl, afterUrl: after.photoUrl, caption: composerCaption.value || null } });
    const newPost = {
      id: created.id,
      type: 'PHOTO',
      data: { beforeUrl: before.photoUrl, afterUrl: after.photoUrl, caption: composerCaption.value || null },
      reactions: 0,
      createdAt: created.createdAt || new Date().toISOString(),
      user: {
        id: authStore.user?.id,
        firstName: authStore.user?.firstName,
        lastName: authStore.user?.lastName,
        username: authStore.user?.username,
        avatarUrl: authStore.user?.avatarUrl,
      },
    };
    posts.value.unshift(newPost);
    toast.success('Avant / Après publié');
    showPhotoComposer.value = false;
    composerCaption.value = '';
    composerLayout.value = 'carousel';
    selectedForPost.value = [];
  } catch (e) {
    console.error(e);
    toast.error('Impossible de publier');
  }
};

// Edit post modal
const showEditModal = ref(false);
const editingPostId = ref<number | null>(null);
const editCaption = ref('');
const editUploadedUrl = ref('');
const editReplaceKey = ref<'photoUrl' | 'beforeUrl' | 'afterUrl' | 'timelapseUrl' | null>(null);
const editSelectedPhotos = ref<number[]>([]);
const editLayout = ref<'carousel' | 'gallery'>('carousel');

const openEditModal = (post: any) => {
  editingPostId.value = post.id;
  // prefer caption stored on post.data.caption
  editCaption.value = post.data?.caption || '';
  editUploadedUrl.value = '';
  // default replace key heuristics
  if (post.data?.photoUrl) editReplaceKey.value = 'photoUrl';
  else if (post.data?.beforeUrl && post.data?.afterUrl) editReplaceKey.value = 'afterUrl';
  else if (post.data?.timelapseUrl) editReplaceKey.value = 'timelapseUrl';
  else editReplaceKey.value = null;
  // preselect photos from user's gallery when editing
  editSelectedPhotos.value = [];
  if (post.data) {
    if (Array.isArray(post.data.photos)) {
      // match by URL to local photos list and select ids
      const urls = post.data.photos;
      editSelectedPhotos.value = photos.value
        .filter((p: any) => urls.includes(p.photoUrl))
        .map((p: any) => p.id);
    } else if (post.data.photoUrl) {
      const match = photos.value.find((p: any) => p.photoUrl === post.data.photoUrl);
      if (match) editSelectedPhotos.value = [match.id];
    } else if (post.data.beforeUrl || post.data.afterUrl) {
      const arr: number[] = [];
      const beforeMatch = photos.value.find((p: any) => p.photoUrl === post.data.beforeUrl);
      const afterMatch = photos.value.find((p: any) => p.photoUrl === post.data.afterUrl);
      if (beforeMatch) arr.push(beforeMatch.id);
      if (afterMatch) arr.push(afterMatch.id);
      editSelectedPhotos.value = arr;
    }
    // respect previously saved layout
    editLayout.value = post.data?.layout || 'carousel';
  }
  showEditModal.value = true;
};

const saveEdit = async () => {
  if (!editingPostId.value) return;
  try {
    const payload: any = { caption: editCaption.value || null };
    // If user selected photos from gallery, use them
    if (editSelectedPhotos.value && editSelectedPhotos.value.length > 0) {
      const urls = photos.value
        .filter((p: any) => editSelectedPhotos.value.includes(p.id))
        .map((p: any) => p.photoUrl);
      // if multiple selected, set photos array and layout
      if (urls.length > 1) {
        payload.photos = urls;
        payload.layout = editLayout.value;
      } else if (urls.length === 1) payload.photoUrl = urls[0];
      // for before/after posts, if exactly two selected, map to before/after
      const original = posts.value.find((p) => p.id === editingPostId.value);
      if (original?.type === 'PHOTO' && urls.length === 2) {
        payload.beforeUrl = urls[0];
        payload.afterUrl = urls[1];
        // remove photos/photoUrl/layout keys if set
        delete payload.photos;
        delete payload.photoUrl;
        delete payload.layout;
      }
    } else if (editUploadedUrl.value && editReplaceKey.value) {
      payload[editReplaceKey.value] = editUploadedUrl.value;
    }
    const updated: any = await editPost(editingPostId.value, payload);
    // update local posts array
    const idx = posts.value.findIndex((p) => p.id === editingPostId.value);
    if (idx !== -1) {
      posts.value[idx].data = { ...(posts.value[idx].data || {}), ...(updated.data || {}) };
      posts.value[idx].createdAt = updated.createdAt || posts.value[idx].createdAt;
    }
    showEditModal.value = false;
    editingPostId.value = null;
    editCaption.value = '';
    toast.success('Post mis à jour');
  } catch (e) {
    console.error(e);
    toast.error("Impossible de modifier le post");
  }
};

const onEditFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    toast.info('Upload en cours...');
    const form = new FormData();
    form.append('file', file);
    let res: any;
    if (file.type.startsWith('video/')) {
      res = await apiFetch('/photos/media/video', { method: 'POST', body: form });
    } else {
      res = await apiFetch('/photos/media/image', { method: 'POST', body: form });
    }
    if (res?.url) {
      editUploadedUrl.value = res.url;
      toast.success('Upload réussi');
    } else {
      throw new Error('No url');
    }
  } catch (err) {
    console.error(err);
    toast.error('Erreur lors de l\'upload');
  }
};

// Timelapse
const showTimelapseModal = ref(false);
const timelapseIndex = ref(0);
const timelapseAutoPlay = ref(false);
const timelapseSpeed = ref(1);
const timelapseSpeeds = [0.5, 1, 2, 3];
let timelapseInterval: NodeJS.Timeout | null = null;

const primaryPhotos = computed(() => {
  return photos.value
    .filter((p: any) => p.isPrimary)
    .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
});

const getTimelapseDelay = () => Math.round(1500 / timelapseSpeed.value);

const toggleTimelapsePlay = () => {
  if (timelapseAutoPlay.value) {
    timelapseAutoPlay.value = false;
    if (timelapseInterval) {
      clearInterval(timelapseInterval);
      timelapseInterval = null;
    }
  } else {
    timelapseAutoPlay.value = true;
    timelapseIndex.value = 0;
    startTimelapseInterval();
  }
};

// Timelapse media error handler to aid debugging in UI
// (Removed debug handlers: timelapse errors/logs are no longer tracked in UI)

const startTimelapseInterval = () => {
  if (timelapseInterval) clearInterval(timelapseInterval);
  timelapseInterval = setInterval(() => {
    if (timelapseIndex.value < primaryPhotos.value.length - 1) {
      timelapseIndex.value++;
    } else {
      timelapseAutoPlay.value = false;
      if (timelapseInterval) {
        clearInterval(timelapseInterval);
        timelapseInterval = null;
      }
    }
  }, getTimelapseDelay());
};

// Restart interval when speed changes during playback
watch(timelapseSpeed, () => {
  if (timelapseAutoPlay.value) startTimelapseInterval();
});

watch(showTimelapseModal, (val) => {
  if (!val) {
    timelapseAutoPlay.value = false;
    if (timelapseInterval) {
      clearInterval(timelapseInterval);
      timelapseInterval = null;
    }
    timelapseIndex.value = 0;
    timelapseSpeed.value = 1;
  }
});

const shareTimelapse = async () => {
  const text = `Ma transformation sur Athletiq ! ${primaryPhotos.value.length} photos`;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Mon timelapse Athletiq', text });
    } catch (error) {
      console.warn('Native share cancelled or failed:', error);
    }
  } else {
    toast.success('Partage non disponible sur cet appareil');
  }
};

const publishTimelapse = async () => {
  if (primaryPhotos.value.length < 2) return toast.error('Pas assez de photos pour timelapse');
  try {
    toast.info('Génération du timelapse, patiente...');
    const images = primaryPhotos.value.map((p: any) => p.photoUrl).filter(Boolean);
    const res: any = await apiFetch('/timelapse/generate', { method: 'POST', body: { images } });
    const url = res?.url || res?.secure_url || res?.secureUrl || res?.secure_url;
    if (!url) throw new Error('No URL');
    const created: any = await createPost({ type: 'TIMELAPSE', data: { timelapseUrl: url, photoCount: images.length } });
    const newPost = {
      id: created.id,
      type: 'TIMELAPSE',
      data: { timelapseUrl: url, photoCount: images.length },
      reactions: 0,
      createdAt: created.createdAt || new Date().toISOString(),
      user: {
        id: authStore.user?.id,
        firstName: authStore.user?.firstName,
        lastName: authStore.user?.lastName,
        username: authStore.user?.username,
        avatarUrl: authStore.user?.avatarUrl,
      },
    };
    posts.value.unshift(newPost);
    toast.success('Timelapse publié sur ton fil');
    showTimelapseModal.value = false;
  } catch (e) {
    console.error(e);
    toast.error('Impossible de publier le timelapse');
  }
};

// Before/After
const showBeforeAfterModal = ref(false);
const beforePhotoIndex = ref(0);
const afterPhotoIndex = ref(0);
const sliderPosition = ref(50);
const isDragging = ref(false);
const sliderContainer = ref<HTMLElement | null>(null);
const sliderContainerWidth = ref(400);

const openBeforeAfter = () => {
  if (primaryPhotos.value.length < 2) return;
  beforePhotoIndex.value = 0;
  afterPhotoIndex.value = primaryPhotos.value.length - 1;
  sliderPosition.value = 50;
  showBeforeAfterModal.value = true;
  nextTick(() => {
    if (sliderContainer.value) sliderContainerWidth.value = sliderContainer.value.offsetWidth;
  });
};

const getSliderPercent = (clientX: number) => {
  if (!sliderContainer.value) return 50;
  const rect = sliderContainer.value.getBoundingClientRect();
  const x = clientX - rect.left;
  return Math.max(0, Math.min(100, (x / rect.width) * 100));
};

const startSliderDrag = (e: MouseEvent) => {
  isDragging.value = true;
  sliderPosition.value = getSliderPercent(e.clientX);
};
const onSliderDrag = (e: MouseEvent) => {
  if (isDragging.value) sliderPosition.value = getSliderPercent(e.clientX);
};
const stopSliderDrag = () => {
  isDragging.value = false;
};
const startSliderTouch = (e: TouchEvent) => {
  isDragging.value = true;
  sliderPosition.value = getSliderPercent(e.touches[0].clientX);
};
const onSliderTouch = (e: TouchEvent) => {
  if (isDragging.value) sliderPosition.value = getSliderPercent(e.touches[0].clientX);
};

const shareBeforeAfter = async () => {
  const before = primaryPhotos.value[beforePhotoIndex.value];
  const after = primaryPhotos.value[afterPhotoIndex.value];
  const text = `Ma transformation Athletiq ! Du ${formatDate(before?.createdAt)} au ${formatDate(after?.createdAt)}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Avant / Apres - Athletiq', text });
    } catch (error) {
      console.warn('Native share cancelled or failed:', error);
    }
  } else {
    toast.success('Partage non disponible sur cet appareil');
  }
};

const publishBeforeAfter = async () => {
  if (primaryPhotos.value.length < 2) return toast.error('Pas assez de photos');
  const before = primaryPhotos.value[beforePhotoIndex.value];
  const after = primaryPhotos.value[afterPhotoIndex.value];
  try {
    const created: any = await createPost({ type: 'PHOTO', data: { beforeUrl: before.photoUrl, afterUrl: after.photoUrl } });
    const newPost = {
      id: created.id,
      type: 'PHOTO',
      data: { beforeUrl: before.photoUrl, afterUrl: after.photoUrl },
      reactions: 0,
      createdAt: created.createdAt || new Date().toISOString(),
      user: {
        id: authStore.user?.id,
        firstName: authStore.user?.firstName,
        lastName: authStore.user?.lastName,
        username: authStore.user?.username,
        avatarUrl: authStore.user?.avatarUrl,
      },
    };
    posts.value.unshift(newPost);
    toast.success('Avant / Après publié');
    showBeforeAfterModal.value = false;
  } catch (e) {
    console.error(e);
    toast.error('Impossible de publier');
  }
};

const publishPhoto = async (photo: any) => {
  try {
    const created: any = await createPost({ type: 'PHOTO', data: { photoUrl: photo.photoUrl } });
    const newPost = {
      id: created.id,
      type: 'PHOTO',
      data: { photoUrl: photo.photoUrl },
      reactions: 0,
      createdAt: created.createdAt || new Date().toISOString(),
      user: {
        id: authStore.user?.id,
        firstName: authStore.user?.firstName,
        lastName: authStore.user?.lastName,
        username: authStore.user?.username,
        avatarUrl: authStore.user?.avatarUrl,
      },
    };
    posts.value.unshift(newPost);
    toast.success('Photo publiée');
  } catch (e) {
    console.error(e);
    toast.error('Impossible de publier la photo');
  }
};

// Delete a post (owner-only)
const deletePostAction = async (postId: number) => {
  try {
    await deletePost(postId);
    posts.value = posts.value.filter((p) => p.id !== postId);
    toast.success('Post supprimé');
  } catch (e) {
    console.error(e);
    toast.error("Impossible de supprimer le post");
  }
};

// Username setup
const showUsernameSetup = ref(false);
const usernameInput = ref('');
const usernameError = ref('');
const usernameAvailable = ref<boolean | null>(null);
const usernameLoading = ref(false);
let usernameCheckTimeout: NodeJS.Timeout | null = null;

watch(usernameInput, (val) => {
  usernameError.value = '';
  usernameAvailable.value = null;
  const cleaned = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
  if (cleaned !== val) usernameInput.value = cleaned;
  if (cleaned.length < 3) {
    if (cleaned.length > 0) usernameError.value = '3 caracteres minimum';
    return;
  }
  if (cleaned.length > 20) {
    usernameError.value = '20 caracteres maximum';
    return;
  }
  if (usernameCheckTimeout) clearTimeout(usernameCheckTimeout);
  usernameCheckTimeout = setTimeout(async () => {
    usernameLoading.value = true;
    try {
      const res = (await checkUsername(cleaned)) as any;
      usernameAvailable.value = res?.available === true;
      if (!usernameAvailable.value) usernameError.value = 'Pseudo deja pris';
    } catch {
      usernameError.value = 'Erreur de verification';
    } finally {
      usernameLoading.value = false;
    }
  }, 500);
});

const saveUsername = async () => {
  if (!usernameAvailable.value || usernameLoading.value) return;
  usernameLoading.value = true;
  try {
    await updateProfile({ username: usernameInput.value });
    showUsernameSetup.value = false;
    // Cache username for offline
    if (process.client) localStorage.setItem('athletiq_username', usernameInput.value);
    // Reload profile
    profileData.value = await getProfile(usernameInput.value);
    toast.success('Pseudo enregistre !');
  } catch (err: any) {
    usernameError.value = err?.data?.error || 'Erreur lors de la sauvegarde';
  } finally {
    usernameLoading.value = false;
  }
};

const qrUrl = computed(() => {
  const username = profileData.value?.username || (authStore.user as any)?.username || '';
  return `https://athletiq.fr/profile/${username}`;
});

const shareQr = async () => {
  const text = `Ajoute-moi sur Athletiq ! ${qrUrl.value}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Mon profil Athletiq', text, url: qrUrl.value });
    } catch (error) {
      console.warn('Native share cancelled or failed:', error);
    }
  } else {
    try {
      await navigator.clipboard.writeText(qrUrl.value);
      toast.success('Lien copie !');
    } catch {
      toast.error('Erreur', 'Impossible de copier le lien');
    }
  }
};

// Share a specific post (uses Web Share API when available, fallback to clipboard)
const postUrlFor = (post: any) => `https://athletiq.fr/post/${post.id}`;
const sharePost = async (post: any) => {
  const url = postUrlFor(post);
  const text = `Regarde ma publication sur Athletiq: ${url}`;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Ma publication Athletiq', text, url });
    } catch (e) {
      console.warn('Native share cancelled or failed:', e);
    }
  } else {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Lien copié !');
    } catch (e) {
      toast.error('Impossible de copier le lien');
    }
  }
  openMenuPostId.value = null;
};

const togglePostMenu = (postId: number) => {
  openMenuPostId.value = openMenuPostId.value === postId ? null : postId;
};

// Determine requested username from route reactively
const requestedUsername = computed(() => {
  const p = route.path || '';
  const parts = p.split('/').filter(Boolean);
  return parts.length >= 2 ? parts[1] : '';
});

// Which user is currently being displayed (visited profile or own user)
const displayedUser = computed(() => {
  if (profileData.value) return profileData.value;
  // If route targets own profile (no username or username === my username), show auth user as fallback
  const myUsername = (authStore.user as any)?.username || '';
  if (!requestedUsername.value || requestedUsername.value === myUsername)
    return (authStore.user as any) || null;
  // Otherwise, don't show a fallback to avoid displaying wrong user's data while loading
  return null;
});

const isOwnProfile = computed(() => {
  if (!profileData.value) {
    // While loading, consider it own profile only if the route targets own username or no username
    const myUsername = (authStore.user as any)?.username || '';
    return !requestedUsername.value || requestedUsername.value === myUsername;
  }
  return (
    (authStore.user as any)?.id === profileData.value?.id ||
    (authStore.user as any)?.username === profileData.value?.username
  );
});

// Load requests when viewing own profile
import { onMounted } from 'vue';

onMounted(() => {
  if (isOwnProfile.value) loadRequests();
});

const initials = computed(() => {
  const f = (displayedUser.value?.firstName || '').charAt(0) || '';
  const l = (displayedUser.value?.lastName || '').charAt(0) || '';
  return (f + l).toUpperCase() || '?';
});

const timeAgo = (dateStr: string) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "a l'instant";
  if (diffMin < 60) return `il y a ${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `il y a ${diffD}j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const getPostText = (post: any) => {
  // Avoid posting automatic default phrases for media posts.
  // Show only explicit text/caption when present; keep workout/pr messages.
  if (post.type === 'WORKOUT_COMPLETED')
    return `A termine ${post.data?.workoutName || 'un workout'}`;
  if (post.type === 'PR_ACHIEVED')
    return `Nouveau record ! ${post.data?.exerciseName} ${post.data?.weight}kg`;
  return post.data?.text || post.data?.caption || '';
};

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
    await authStore.uploadAvatar(file);
  } finally {
    avatarUploading.value = false;
    input.value = '';
  }
};

// Social actions for visited profiles
const sendFriendRequestAction = async () => {
  if (!profileData.value?.id) return;
  try {
    await sendFriendRequest(profileData.value.id);
    profileData.value.requestPending = true;
    toast.success('Demande envoyée');
  } catch (err: any) {
    toast.error(err?.data?.error || "Erreur lors de l'envoi de la demande");
  }
};

const removeFriendAction = async () => {
  if (!profileData.value?.id) return;
  try {
    await removeFriend(profileData.value.id);
    profileData.value.isFriend = false;
    toast.success('Ami supprimé');
  } catch (err: any) {
    toast.error(err?.data?.error || 'Erreur lors de la suppression');
  }
};

// Helper: derive requested username from current route path (supports /profile and /profile/:username)
const route = useRoute();
const getRequestedUsernameFromRoute = () => {
  try {
    const p = route.path || '';
    if (!p) return '';
    const parts = p.split('/').filter(Boolean);
    // parts = ['profile'] or ['profile','username']
    return parts.length >= 2 ? parts[1] : '';
  } catch {
    return '';
  }
};

const loadProfileFor = async (requestedUsername?: string) => {
  // Clear previous profile data immediately to avoid showing stale visited profiles
  profileData.value = null;
  photos.value = [];
  posts.value = [];
  workoutsList.value = [];
  gymBrosList.value = [];
  streakData.value = null;
  pageLoading.value = true;
  // Try cached username first (for offline)
  const cachedUsername = process.client ? localStorage.getItem('athletiq_username') : null;

  // Fetch own profile (to know current user's username)
  let myProfile: any = null;
  try {
    myProfile = (await getMyProfile()) as any;
    if (myProfile?.username && process.client)
      localStorage.setItem('athletiq_username', myProfile.username);
  } catch (error) {
    console.warn('Failed to fetch own profile:', error);
  }

  const ownUsername =
    myProfile?.username || (authStore.user as any)?.username || cachedUsername || '';

  // If no requestedUsername provided, show own profile or username setup
  const usernameToLoad = requestedUsername || ownUsername;

  if (!usernameToLoad) {
    const { isOnline } = useOfflineStorage();
    showUsernameSetup.value = isOnline.value;
    profileData.value = { stats: { workoutCount: 0, streak: 0 } };
    pageLoading.value = false;
    return;
  }

  // If requested username matches own username, hide setup
  showUsernameSetup.value = usernameToLoad === ownUsername ? false : showUsernameSetup.value;

  try {
    profileData.value = await getProfile(usernameToLoad);
  } catch (err) {
    // If fetching failed and it's own username, fallback to cached/myProfile
    if (usernameToLoad === ownUsername && myProfile) {
      profileData.value = {
        ...myProfile,
        username: ownUsername,
        stats: { workoutCount: 0, streak: 0 },
      };
    } else {
      // Not found or offline
      profileData.value = { stats: { workoutCount: 0, streak: 0 } };
    }
  } finally {
    pageLoading.value = false;
  }
  gymBrosCount.value = profileData.value?.friends?.length || 0;
  posts.value = profileData.value?.posts || [];

  // Photos stay local for the owner because the gallery is not exposed on the public profile route
  if (isOwnProfile.value) {
    try {
      photos.value = await getRecentPhotos(30);
    } catch {
      photos.value = [];
    }
  } else {
    // Photos should never be shown for other users (gallery is private to the owner)
    photos.value = [];
  }

  // Load workouts for photo upload selector if needed
  if (!workoutStore.workouts.length) {
    workoutStore.fetchWorkouts().catch(() => {});
  }
};

// Load on mount for current route
onMounted(async () => {
  const requested = getRequestedUsernameFromRoute();
  await loadProfileFor(requested);
});

// React to route changes (client navigation)
watch(
  () => route.path,
  async (newPath, oldPath) => {
    const requested = getRequestedUsernameFromRoute();
    await loadProfileFor(requested);
  }
);

// (profile loading and reactive updates handled in loadProfileFor and lifecycle hooks)
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
