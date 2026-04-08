<template>
  <div class="min-h-screen geometric-bg">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <NuxtLink to="/dashboard">
              <AppLogo />
            </NuxtLink>
          </div>
          <NavActions />
        </div>
      </div>
    </nav>

    <div class="pt-20 md:pt-28 px-4 md:px-6 pb-28 lg:pb-20 max-w-lg mx-auto">
      <!-- Loading -->
      <div v-if="pageLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-200 dark:border-primary-700 border-t-sand-500"></div>
      </div>

      <template v-else>
      <!-- Username setup prompt (first visit) -->
      <div v-if="showUsernameSetup" class="card-glass !p-6 text-center mb-6 fade-in">
        <Icon name="lucide:at-sign" class="w-12 h-12 mx-auto mb-3 text-sand-500" />
        <h2 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-2">Choisis ton pseudo</h2>
        <p class="text-sm text-primary-500 dark:text-primary-400 mb-4">C'est ton identifiant unique sur Athletiq</p>
        <form @submit.prevent="saveUsername" class="space-y-3">
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 text-sm">@</span>
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
          <p v-if="usernameAvailable === true" class="text-xs text-green-500">Pseudo disponible</p>
          <button type="submit" :disabled="!usernameAvailable || usernameLoading" class="btn-primary w-full py-3 disabled:opacity-50">
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
              <div class="w-full h-full flex items-center justify-center" :class="displayedUser?.avatarUrl ? '' : 'bg-gradient-primary'">
                <img v-if="displayedUser?.avatarUrl" :src="displayedUser.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
                <span v-else class="text-white text-3xl font-bold">{{ initials }}</span>
              </div>
            </div>
            <!-- Upload overlay (only for own profile) -->
            <label v-if="isOwnProfile" class="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 rounded-2xl cursor-pointer transition-colors group">
              <Icon name="lucide:camera" class="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              <input type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" :disabled="avatarUploading" />
            </label>
            <div v-if="avatarUploading" class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
              <div class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>

          <!-- Username + privacy badge -->
          <div class="flex items-center justify-center gap-2">
            <h1 v-if="profileData?.username" class="text-2xl font-bold text-primary-900 dark:text-primary-100">@{{ profileData.username }}</h1>
            <h1 v-else class="text-2xl font-bold text-primary-900 dark:text-primary-100">{{ displayedUser?.firstName || displayedUser?.email }}</h1>
            <span v-if="profileData?.isPublic === false" class="inline-flex items-center gap-1 text-xs text-primary-400 dark:text-primary-500">
              <Icon name="lucide:lock" class="w-3.5 h-3.5" />
              Privé
            </span>
          </div>
          <p v-if="profileData?.bio" class="text-sm text-primary-500 dark:text-primary-400 mt-1">{{ profileData.bio }}</p>
        </div>

        <!-- Stats Row -->
        <div class="flex justify-center gap-8 mb-6 slide-up">
          <NuxtLink to="/workouts" class="text-center hover:opacity-70 transition-opacity cursor-pointer">
            <div class="flex items-center justify-center gap-1.5">
              <span class="text-lg font-bold text-primary-900 dark:text-primary-100">{{ profileData?.stats?.workoutCount ?? 0 }}</span>
              <Icon name="lucide:dumbbell" class="w-4 h-4 text-primary-400 dark:text-primary-500" />
            </div>
            <p class="text-[11px] text-primary-500 dark:text-primary-400">Workouts</p>
          </NuxtLink>
          <NuxtLink to="/friends" class="text-center hover:opacity-70 transition-opacity cursor-pointer">
            <div class="flex items-center justify-center gap-1.5">
              <span class="text-lg font-bold text-primary-900 dark:text-primary-100">{{ gymBrosCount }}</span>
              <Icon name="lucide:users" class="w-4 h-4 text-primary-400 dark:text-primary-500" />
            </div>
            <p class="text-[11px] text-primary-500 dark:text-primary-400">Gym Bros</p>
          </NuxtLink>
          <NuxtLink to="/streak" class="text-center hover:opacity-70 transition-opacity cursor-pointer">
            <div class="flex items-center justify-center gap-1.5">
              <span class="text-lg font-bold text-primary-900 dark:text-primary-100">{{ profileData?.stats?.streak ?? 0 }}</span>
              <Icon name="lucide:flame" class="w-4 h-4" :class="(profileData?.stats?.streak ?? 0) > 0 ? 'text-orange-500' : 'text-primary-400 dark:text-primary-500'" />
            </div>
            <p class="text-[11px] text-primary-500 dark:text-primary-400">Streak</p>
          </NuxtLink>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center gap-2 mb-8 slide-up">
          <template v-if="isOwnProfile">
            <NuxtLink to="/edit-profile" class="btn-glass px-5 py-2.5 text-sm font-medium inline-flex items-center gap-2">
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
            <NuxtLink to="/settings" class="btn-glass px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2" title="Parametres">
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
              <NuxtLink :to="`/workouts?user=${profileData?.username || profileData?.id}`" class="btn-glass px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2">
                <Icon name="lucide:dumbbell" class="w-4 h-4" />
                Workouts
              </NuxtLink>
              <NuxtLink :to="`/friends?user=${profileData?.username || profileData?.id}`" class="btn-glass px-4 py-2.5 text-sm font-medium inline-flex items-center gap-2" :class="{ 'opacity-50 cursor-not-allowed': !profileData?.isPublic && !profileData?.isFriend }">
                <Icon name="lucide:users" class="w-4 h-4" />
                Gym Bros
              </NuxtLink>
            </div>
          </template>
        </div>

        <!-- Tab Bar (Posts par defaut) -->
        <div class="flex justify-center mb-6">
          <div class="flex space-x-1 bg-white/50 dark:bg-primary-900/50 backdrop-blur-lg rounded-xl p-1">
            <button
              @click="activeTab = 'posts'"
              :class="[
                'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
                activeTab === 'posts'
                  ? 'bg-gradient-primary text-white shadow-sm'
                  : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100'
              ]"
            >
              <Icon name="lucide:activity" class="w-4 h-4 inline-block mr-1 -mt-0.5" />
              Posts
            </button>
            <button
              @click="activeTab = 'photos'"
              :class="[
                'px-5 py-2 rounded-lg text-sm font-semibold transition-all',
                activeTab === 'photos'
                  ? 'bg-gradient-primary text-white shadow-sm'
                  : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100'
              ]"
            >
              <Icon name="lucide:image" class="w-4 h-4 inline-block mr-1 -mt-0.5" />
              Photos
            </button>
          </div>
        </div>

        <!-- Posts List (par defaut) -->
        <div v-if="activeTab === 'posts'" class="space-y-4 slide-up">
          <div v-if="posts.length > 0">
            <div v-for="post in posts" :key="post.id" class="card-glass !p-4">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0" :class="authStore.user?.avatarUrl ? '' : 'bg-gradient-primary flex items-center justify-center'">
                  <img v-if="authStore.user?.avatarUrl" :src="authStore.user.avatarUrl" alt="" class="w-full h-full object-cover" />
                  <span v-else class="text-white text-xs font-bold">{{ initials }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-primary-900 dark:text-primary-100 truncate">@{{ profileData?.username || 'moi' }}</p>
                  <p class="text-xs text-primary-400 dark:text-primary-500">{{ timeAgo(post.createdAt) }}</p>
                </div>
              </div>
              <p class="text-sm text-primary-700 dark:text-primary-300">{{ getPostText(post) }}</p>
              <div v-if="post.reactions" class="mt-3 flex items-center gap-1.5">
                <span class="text-sm">&#128293;</span>
                <span class="text-xs text-primary-500 dark:text-primary-400">{{ post.reactions }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-16">
            <Icon name="lucide:activity" class="w-16 h-16 mx-auto mb-4 text-primary-300 dark:text-primary-600" />
            <p class="text-primary-500 dark:text-primary-400 text-sm">Aucun post pour le moment</p>
            <p class="text-primary-400 dark:text-primary-500 text-xs mt-1">Tes activites apparaitront ici</p>
          </div>
        </div>

        <!-- Photos Tab -->
        <div v-if="activeTab === 'photos'" class="slide-up space-y-4">
          <!-- Timelapse + Avant/Apres buttons -->
          <div v-if="primaryPhotos.length >= 2" class="flex gap-2">
            <button @click="showTimelapseModal = true" class="btn-glass px-3 py-2 text-xs font-medium inline-flex items-center gap-1.5 flex-1 justify-center">
              <Icon name="lucide:film" class="w-3.5 h-3.5" />
              Timelapse
            </button>
            <button @click="openBeforeAfter" class="btn-glass px-3 py-2 text-xs font-medium inline-flex items-center gap-1.5 flex-1 justify-center">
              <Icon name="lucide:git-compare" class="w-3.5 h-3.5" />
              Avant / Apres
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
              <img :src="photo.photoUrl" :alt="`Photo`" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
              <span v-if="photo.isPrimary" class="absolute top-1 left-1 text-yellow-400 text-xs">&#9733;</span>
            </div>
          </div>

          <!-- Empty state (no photos at all) -->
          <div v-if="photos.length === 0" class="text-center py-8">
            <p class="text-primary-400 dark:text-primary-500 text-xs">Prends des photos apres tes workouts pour suivre ta transformation</p>
          </div>
        </div>
      </template>
      </template>
    </div>

    <!-- QR Code Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showQrModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click="showQrModal = false">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <div class="relative bg-white dark:bg-primary-900 rounded-2xl p-6 max-w-sm w-full text-center shadow-xl" @click.stop>
            <button
              @click="showQrModal = false"
              class="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-primary-400 hover:text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors"
            >
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
            <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4">Mon QR Code</h3>
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
            <p class="text-base font-semibold text-primary-900 dark:text-primary-100">@{{ profileData?.username }}</p>
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
        <div v-if="selectedPhoto" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click="selectedPhoto = null">
          <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <img
            :src="selectedPhoto.photoUrl"
            class="relative max-w-full max-h-[90vh] rounded-2xl object-contain"
            @click.stop
          />
          <button @click="selectedPhoto = null" class="absolute top-6 right-6 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-colors">
            <Icon name="lucide:x" class="w-6 h-6" />
          </button>
        </div>
      </Transition>
    </Teleport>

    <!-- Upload Photo Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showUploadModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click="showUploadModal = false">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div class="relative bg-white dark:bg-primary-900 rounded-2xl p-6 max-w-sm w-full shadow-xl" @click.stop>
            <button @click="showUploadModal = false" class="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-primary-400 hover:text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-800 transition-colors">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
            <h3 class="text-lg font-bold text-primary-900 dark:text-primary-100 mb-4">Ajouter une photo</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1.5">Workout associe</label>
                <select v-model="uploadWorkoutId" class="w-full px-3 py-2.5 rounded-xl border border-primary-200 dark:border-primary-700 bg-white/60 dark:bg-primary-800/60 text-sm text-primary-900 dark:text-primary-100 focus:outline-none focus:ring-2 focus:ring-sand-500/50">
                  <option :value="null" disabled>Selectionner...</option>
                  <option v-for="w in completedWorkouts" :key="w.id" :value="w.id">
                    {{ w.name }} — {{ formatDate(w.completedAt || w.createdAt) }}
                  </option>
                </select>
              </div>
              <label class="flex items-center gap-2 text-sm text-primary-700 dark:text-primary-300 cursor-pointer">
                <input type="checkbox" v-model="uploadIsPrimary" class="w-4 h-4 rounded border-primary-300 dark:border-primary-600 text-sand-600 focus:ring-sand-600" />
                Photo principale (timelapse)
              </label>
              <label class="btn-primary w-full cursor-pointer inline-flex items-center justify-center gap-2">
                <Icon name="lucide:camera" class="w-4 h-4" />
                <span>{{ uploadingPhoto ? 'Upload...' : 'Choisir une photo' }}</span>
                <input type="file" accept="image/*" class="hidden" @change="handlePhotoUpload" :disabled="!uploadWorkoutId || uploadingPhoto" />
              </label>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Timelapse Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showTimelapseModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click="showTimelapseModal = false">
          <div class="absolute inset-0 bg-black/90"></div>
          <div class="relative max-w-lg w-full" @click.stop>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-white font-bold text-lg">Timelapse</h3>
              <div class="flex items-center gap-2">
                <button @click="shareTimelapse" class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors" title="Partager">
                  <Icon name="lucide:share-2" class="w-5 h-5" />
                </button>
                <button @click="showTimelapseModal = false" class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors">
                  <Icon name="lucide:x" class="w-5 h-5" />
                </button>
              </div>
            </div>
            <div class="relative aspect-[3/4] rounded-2xl overflow-hidden bg-black">
              <Transition name="fade" mode="out-in">
                <img :key="timelapseIndex" :src="primaryPhotos[timelapseIndex]?.photoUrl" class="w-full h-full object-cover" />
              </Transition>
              <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span class="bg-black/60 text-white text-xs px-2 py-1 rounded-lg">{{ formatDate(primaryPhotos[timelapseIndex]?.createdAt) }}</span>
                <span class="bg-black/60 text-white text-xs px-2 py-1 rounded-lg">{{ timelapseIndex + 1 }} / {{ primaryPhotos.length }}</span>
              </div>
            </div>
            <div class="flex items-center justify-center gap-3 mt-4">
              <button @click="timelapseIndex = Math.max(0, timelapseIndex - 1)" :disabled="timelapseIndex === 0" class="w-10 h-10 bg-white/20 hover:bg-white/30 disabled:opacity-30 rounded-xl flex items-center justify-center text-white transition-colors">
                <Icon name="lucide:chevron-left" class="w-5 h-5" />
              </button>
              <button @click="toggleTimelapsePlay" class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors">
                <Icon :name="timelapseAutoPlay ? 'lucide:pause' : 'lucide:play'" class="w-5 h-5" />
              </button>
              <button @click="timelapseIndex = Math.min(primaryPhotos.length - 1, timelapseIndex + 1)" :disabled="timelapseIndex >= primaryPhotos.length - 1" class="w-10 h-10 bg-white/20 hover:bg-white/30 disabled:opacity-30 rounded-xl flex items-center justify-center text-white transition-colors">
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
                  timelapseSpeed === speed ? 'bg-white/30 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'
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
        <div v-if="showBeforeAfterModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4" @click="showBeforeAfterModal = false">
          <div class="absolute inset-0 bg-black/90"></div>
          <div class="relative max-w-md w-full" @click.stop>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-white font-bold text-lg">Avant / Apres</h3>
              <div class="flex items-center gap-2">
                <button @click="shareBeforeAfter" class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors" title="Partager">
                  <Icon name="lucide:share-2" class="w-5 h-5" />
                </button>
                <button @click="showBeforeAfterModal = false" class="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-colors">
                  <Icon name="lucide:x" class="w-5 h-5" />
                </button>
              </div>
            </div>
            <!-- Photo selectors -->
            <div class="flex gap-3 mb-4">
              <select v-model="beforePhotoIndex" class="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none">
                <option v-for="(p, i) in primaryPhotos" :key="'b'+p.id" :value="i" class="text-black">{{ formatDate(p.createdAt) }}</option>
              </select>
              <select v-model="afterPhotoIndex" class="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none">
                <option v-for="(p, i) in primaryPhotos" :key="'a'+p.id" :value="i" class="text-black">{{ formatDate(p.createdAt) }}</option>
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
              <img :src="primaryPhotos[afterPhotoIndex]?.photoUrl" class="absolute inset-0 w-full h-full object-cover" />
              <!-- Before photo (clipped) -->
              <div class="absolute inset-0 overflow-hidden" :style="{ width: sliderPosition + '%' }">
                <img :src="primaryPhotos[beforePhotoIndex]?.photoUrl" class="absolute inset-0 w-full h-full object-cover" :style="{ minWidth: sliderContainerWidth + 'px' }" />
              </div>
              <!-- Slider line -->
              <div class="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg" :style="{ left: sliderPosition + '%' }">
                <div class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <Icon name="lucide:move-horizontal" class="w-4 h-4 text-primary-900" />
                </div>
              </div>
              <!-- Labels -->
              <span class="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">Avant</span>
              <span class="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">Apres</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <MobileBottomNav active-path="/profile" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useSocialApi } from '~/composables/useSocialApi'
import { useBodyApi } from '~/composables/useBodyApi'

definePageMeta({
  layout: false,
  middleware: 'auth'
})

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const authStore = useAuthStore()
const { getMyProfile, getProfile, updateProfile, checkUsername, getFeed, getFriends, sendFriendRequest, removeFriend } = useSocialApi()
const bodyApi = useBodyApi()
const { getRecentPhotos } = bodyApi
const toast = useToast()
const workoutStore = useWorkoutStore()

const pageLoading = ref(true)
const activeTab = ref<'photos' | 'posts'>('posts')
const profileData = ref<any>(null)
const photos = ref<any[]>([])
const posts = ref<any[]>([])
const selectedPhoto = ref<any>(null)
const avatarUploading = ref(false)
const showQrModal = ref(false)
const gymBrosCount = ref(0)

// Photo upload
const showUploadModal = ref(false)
const uploadWorkoutId = ref<number | null>(null)
const uploadIsPrimary = ref(false)
const uploadingPhoto = ref(false)
const completedWorkouts = computed(() => {
  return (workoutStore.workouts || []).filter((w: any) => w.completedAt)
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

const handlePhotoUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file || !uploadWorkoutId.value) return
  if (!file.type.startsWith('image/')) { toast.error('Le fichier doit etre une image'); input.value = ''; return }
  if (file.size > 5 * 1024 * 1024) { toast.error('La photo ne doit pas depasser 5 Mo'); input.value = ''; return }
  uploadingPhoto.value = true
  try {
    await bodyApi.uploadPhoto(uploadWorkoutId.value, file, uploadIsPrimary.value)
    toast.success('Photo ajoutee !')
    showUploadModal.value = false
    uploadWorkoutId.value = null
    uploadIsPrimary.value = false
    // Reload photos
    photos.value = await getRecentPhotos(50)
  } catch {
    toast.error('Erreur lors de l\'upload')
  } finally {
    uploadingPhoto.value = false
    input.value = ''
  }
}

// Timelapse
const showTimelapseModal = ref(false)
const timelapseIndex = ref(0)
const timelapseAutoPlay = ref(false)
const timelapseSpeed = ref(1)
const timelapseSpeeds = [0.5, 1, 2, 3]
let timelapseInterval: NodeJS.Timeout | null = null

const primaryPhotos = computed(() => {
  return photos.value.filter((p: any) => p.isPrimary).sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
})

const getTimelapseDelay = () => Math.round(1500 / timelapseSpeed.value)

const toggleTimelapsePlay = () => {
  if (timelapseAutoPlay.value) {
    timelapseAutoPlay.value = false
    if (timelapseInterval) { clearInterval(timelapseInterval); timelapseInterval = null }
  } else {
    timelapseAutoPlay.value = true
    timelapseIndex.value = 0
    startTimelapseInterval()
  }
}

const startTimelapseInterval = () => {
  if (timelapseInterval) clearInterval(timelapseInterval)
  timelapseInterval = setInterval(() => {
    if (timelapseIndex.value < primaryPhotos.value.length - 1) {
      timelapseIndex.value++
    } else {
      timelapseAutoPlay.value = false
      if (timelapseInterval) { clearInterval(timelapseInterval); timelapseInterval = null }
    }
  }, getTimelapseDelay())
}

// Restart interval when speed changes during playback
watch(timelapseSpeed, () => {
  if (timelapseAutoPlay.value) startTimelapseInterval()
})

watch(showTimelapseModal, (val) => {
  if (!val) {
    timelapseAutoPlay.value = false
    if (timelapseInterval) { clearInterval(timelapseInterval); timelapseInterval = null }
    timelapseIndex.value = 0
    timelapseSpeed.value = 1
  }
})

const shareTimelapse = async () => {
  const text = `Ma transformation sur Athletiq ! ${primaryPhotos.value.length} photos`
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Mon timelapse Athletiq', text })
    } catch (error) {
      console.warn('Native share cancelled or failed:', error)
    }
  } else {
    toast.success('Partage non disponible sur cet appareil')
  }
}

// Before/After
const showBeforeAfterModal = ref(false)
const beforePhotoIndex = ref(0)
const afterPhotoIndex = ref(0)
const sliderPosition = ref(50)
const isDragging = ref(false)
const sliderContainer = ref<HTMLElement | null>(null)
const sliderContainerWidth = ref(400)

const openBeforeAfter = () => {
  if (primaryPhotos.value.length < 2) return
  beforePhotoIndex.value = 0
  afterPhotoIndex.value = primaryPhotos.value.length - 1
  sliderPosition.value = 50
  showBeforeAfterModal.value = true
  nextTick(() => {
    if (sliderContainer.value) sliderContainerWidth.value = sliderContainer.value.offsetWidth
  })
}

const getSliderPercent = (clientX: number) => {
  if (!sliderContainer.value) return 50
  const rect = sliderContainer.value.getBoundingClientRect()
  const x = clientX - rect.left
  return Math.max(0, Math.min(100, (x / rect.width) * 100))
}

const startSliderDrag = (e: MouseEvent) => { isDragging.value = true; sliderPosition.value = getSliderPercent(e.clientX) }
const onSliderDrag = (e: MouseEvent) => { if (isDragging.value) sliderPosition.value = getSliderPercent(e.clientX) }
const stopSliderDrag = () => { isDragging.value = false }
const startSliderTouch = (e: TouchEvent) => { isDragging.value = true; sliderPosition.value = getSliderPercent(e.touches[0].clientX) }
const onSliderTouch = (e: TouchEvent) => { if (isDragging.value) sliderPosition.value = getSliderPercent(e.touches[0].clientX) }

const shareBeforeAfter = async () => {
  const before = primaryPhotos.value[beforePhotoIndex.value]
  const after = primaryPhotos.value[afterPhotoIndex.value]
  const text = `Ma transformation Athletiq ! Du ${formatDate(before?.createdAt)} au ${formatDate(after?.createdAt)}`
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Avant / Apres - Athletiq', text })
    } catch (error) {
      console.warn('Native share cancelled or failed:', error)
    }
  } else {
    toast.success('Partage non disponible sur cet appareil')
  }
}

// Username setup
const showUsernameSetup = ref(false)
const usernameInput = ref('')
const usernameError = ref('')
const usernameAvailable = ref<boolean | null>(null)
const usernameLoading = ref(false)
let usernameCheckTimeout: NodeJS.Timeout | null = null

watch(usernameInput, (val) => {
  usernameError.value = ''
  usernameAvailable.value = null
  const cleaned = val.toLowerCase().replace(/[^a-z0-9_]/g, '')
  if (cleaned !== val) usernameInput.value = cleaned
  if (cleaned.length < 3) {
    if (cleaned.length > 0) usernameError.value = '3 caracteres minimum'
    return
  }
  if (cleaned.length > 20) {
    usernameError.value = '20 caracteres maximum'
    return
  }
  if (usernameCheckTimeout) clearTimeout(usernameCheckTimeout)
  usernameCheckTimeout = setTimeout(async () => {
    usernameLoading.value = true
    try {
      const res = await checkUsername(cleaned) as any
      usernameAvailable.value = res?.available === true
      if (!usernameAvailable.value) usernameError.value = 'Pseudo deja pris'
    } catch {
      usernameError.value = 'Erreur de verification'
    } finally {
      usernameLoading.value = false
    }
  }, 500)
})

const saveUsername = async () => {
  if (!usernameAvailable.value || usernameLoading.value) return
  usernameLoading.value = true
  try {
    await updateProfile({ username: usernameInput.value })
    showUsernameSetup.value = false
    // Cache username for offline
    if (process.client) localStorage.setItem('athletiq_username', usernameInput.value)
    // Reload profile
    profileData.value = await getProfile(usernameInput.value)
    toast.success('Pseudo enregistre !')
  } catch (err: any) {
    usernameError.value = err?.data?.error || 'Erreur lors de la sauvegarde'
  } finally {
    usernameLoading.value = false
  }
}

const qrUrl = computed(() => {
  const username = profileData.value?.username || (authStore.user as any)?.username || ''
  return `https://athletiq.fr/profile/${username}`
})

const shareQr = async () => {
  const text = `Ajoute-moi sur Athletiq ! ${qrUrl.value}`
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Mon profil Athletiq', text, url: qrUrl.value })
    } catch (error) {
      console.warn('Native share cancelled or failed:', error)
    }
  } else {
    try {
      await navigator.clipboard.writeText(qrUrl.value)
      toast.success('Lien copie !')
    } catch {
      toast.error('Erreur', 'Impossible de copier le lien')
    }
  }
}

// Which user is currently being displayed (visited profile or own user)
const displayedUser = computed(() => {
  return profileData.value ? profileData.value : (authStore.user as any) || null
})

const isOwnProfile = computed(() => {
  if (!profileData.value) return true
  return (authStore.user as any)?.id === profileData.value?.id || (authStore.user as any)?.username === profileData.value?.username
})

const initials = computed(() => {
  const f = (displayedUser.value?.firstName || '').charAt(0) || ''
  const l = (displayedUser.value?.lastName || '').charAt(0) || ''
  return (f + l).toUpperCase() || '?'
})

const timeAgo = (dateStr: string) => {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return "a l'instant"
  if (diffMin < 60) return `il y a ${diffMin}min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `il y a ${diffH}h`
  const diffD = Math.floor(diffH / 24)
  if (diffD < 7) return `il y a ${diffD}j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const getPostText = (post: any) => {
  if (post.type === 'WORKOUT_COMPLETED') return `A termine ${post.data?.workoutName || 'un workout'}`
  if (post.type === 'PR_ACHIEVED') return `Nouveau record ! ${post.data?.exerciseName} ${post.data?.weight}kg`
  if (post.type === 'PHOTO') return 'A partage une photo'
  if (post.type === 'TEMPLATE_SHARED') return `A partage le template "${post.data?.templateName}"`
  return post.type
}

const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    toast.error('Erreur', 'Le fichier doit etre une image')
    input.value = ''
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.error('Erreur', 'La photo ne doit pas depasser 5 Mo')
    input.value = ''
    return
  }
  avatarUploading.value = true
  try {
    await authStore.uploadAvatar(file)
  } finally {
    avatarUploading.value = false
    input.value = ''
  }
}

// Social actions for visited profiles
const sendFriendRequestAction = async () => {
  if (!profileData.value?.id) return
  try {
    await sendFriendRequest(profileData.value.id)
    profileData.value.requestPending = true
    toast.success('Demande envoyée')
  } catch (err: any) {
    toast.error(err?.data?.error || 'Erreur lors de l\'envoi de la demande')
  }
}

const removeFriendAction = async () => {
  if (!profileData.value?.id) return
  try {
    await removeFriend(profileData.value.id)
    profileData.value.isFriend = false
    toast.success('Ami supprimé')
  } catch (err: any) {
    toast.error(err?.data?.error || 'Erreur lors de la suppression')
  }
}

// Helper: derive requested username from current route path (supports /profile and /profile/:username)
const route = useRoute()
const getRequestedUsernameFromRoute = () => {
  try {
    const p = route.path || ''
    if (!p) return ''
    const parts = p.split('/').filter(Boolean)
    // parts = ['profile'] or ['profile','username']
    return parts.length >= 2 ? parts[1] : ''
  } catch {
    return ''
  }
}

const loadProfileFor = async (requestedUsername?: string) => {
  pageLoading.value = true
  // Try cached username first (for offline)
  const cachedUsername = process.client ? localStorage.getItem('athletiq_username') : null

  // Fetch own profile (to know current user's username)
  let myProfile: any = null
  try {
    myProfile = await getMyProfile() as any
    if (myProfile?.username && process.client) localStorage.setItem('athletiq_username', myProfile.username)
  } catch (error) {
    console.warn('Failed to fetch own profile:', error)
  }

  const ownUsername = myProfile?.username || (authStore.user as any)?.username || cachedUsername || ''

  // If no requestedUsername provided, show own profile or username setup
  const usernameToLoad = requestedUsername || ownUsername

  if (!usernameToLoad) {
    const { isOnline } = useOfflineStorage()
    showUsernameSetup.value = isOnline.value
    profileData.value = { stats: { workoutCount: 0, streak: 0 } }
    pageLoading.value = false
    return
  }

  // If requested username matches own username, hide setup
  showUsernameSetup.value = usernameToLoad === ownUsername ? false : showUsernameSetup.value

  try {
    profileData.value = await getProfile(usernameToLoad)
  } catch (err) {
    // If fetching failed and it's own username, fallback to cached/myProfile
    if (usernameToLoad === ownUsername && myProfile) {
      profileData.value = { ...myProfile, username: ownUsername, stats: { workoutCount: 0, streak: 0 } }
    } else {
      // Not found or offline
      profileData.value = { stats: { workoutCount: 0, streak: 0 } }
    }
    } finally {
    pageLoading.value = false
  }
  // After loading profileData, refresh related lists (friends count, photos, posts)
  try {
    const data = await getFriends() as any
    const friendsList = data?.friends || data || []
    gymBrosCount.value = friendsList.length
  } catch {
    gymBrosCount.value = 0
  }

  try {
    photos.value = await getRecentPhotos(30)
  } catch {
    photos.value = []
  }

  try {
    const feedData = await getFeed(0) as any
    posts.value = (feedData?.posts || feedData || []).filter((p: any) => p.userId === profileData.value?.id)
  } catch {
    posts.value = []
  }

  // Load workouts for photo upload selector if needed
  if (!workoutStore.workouts.length) {
    workoutStore.fetchWorkouts().catch(() => {})
  }
}

// Load on mount for current route
onMounted(async () => {
  const requested = getRequestedUsernameFromRoute()
  await loadProfileFor(requested)
})

// React to route changes (client navigation)
watch(() => route.path, async (newPath, oldPath) => {
  const requested = getRequestedUsernameFromRoute()
  await loadProfileFor(requested)
})

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
