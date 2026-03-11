<template>
  <div class="card-glass flex flex-col items-center">
    <!-- Toggle Homme / Femme -->
    <div class="flex items-center gap-1 mb-4 bg-primary-100 dark:bg-primary-800 rounded-full p-1">
      <button
        @click="gender = 'male'"
        :class="gender === 'male' ? 'bg-gradient-primary text-white shadow-md' : 'text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100'"
        class="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300"
      >
        Homme
      </button>
      <button
        @click="gender = 'female'"
        :class="gender === 'female' ? 'bg-gradient-primary text-white shadow-md' : 'text-primary-500 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-100'"
        class="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300"
      >
        Femme
      </button>
    </div>

    <!-- Légende -->
    <div v-if="muscleRecovery.length > 0" class="flex flex-wrap justify-center gap-3 mb-4 text-xs">
      <div class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full bg-green-500"></span>
        <span class="text-primary-600 dark:text-primary-400">Récupéré</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
        <span class="text-primary-600 dark:text-primary-400">En cours</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full bg-red-500"></span>
        <span class="text-primary-600 dark:text-primary-400">Fatigué</span>
      </div>
    </div>

    <!-- Figure -->
    <div class="h-64 md:h-80 flex items-center justify-center">
      <Transition name="body-figure" mode="out-in">
        <!-- MALE -->
        <svg v-if="gender === 'male'" key="male" viewBox="0 0 300 520" xmlns="http://www.w3.org/2000/svg" class="h-full w-auto drop-shadow-lg">
          <defs>
            <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#e8ddd0"/>
              <stop offset="100%" stop-color="#d4c4b0"/>
            </linearGradient>
            <linearGradient id="shadow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#d4c4b0"/>
              <stop offset="100%" stop-color="#b8a48f"/>
            </linearGradient>
          </defs>

          <!-- Tete -->
          <ellipse cx="150" cy="38" rx="24" ry="28" fill="url(#skin)"/>
          <path d="M130 48 Q140 64 150 66 Q160 64 170 48" fill="#d4c4b0"/>

          <!-- Cou -->
          <path d="M138 60 L136 82 L164 82 L162 60Z" fill="url(#shadow)"/>
          <line x1="142" y1="62" x2="138" y2="80" stroke="#c4b4a0" stroke-width="1" opacity="0.4"/>
          <line x1="158" y1="62" x2="162" y2="80" stroke="#c4b4a0" stroke-width="1" opacity="0.4"/>

          <!-- Trapezes (SHOULDERS) -->
          <g :opacity="getOverlayOpacity('SHOULDERS')">
            <path d="M136 78 Q120 76 100 88 L108 96 Q124 86 138 84Z" :fill="getColor('SHOULDERS')"/>
            <path d="M164 78 Q180 76 200 88 L192 96 Q176 86 162 84Z" :fill="getColor('SHOULDERS')"/>
          </g>
          <path d="M136 78 Q120 76 100 88 L108 96 Q124 86 138 84Z" fill="url(#shadow)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>
          <path d="M164 78 Q180 76 200 88 L192 96 Q176 86 162 84Z" fill="url(#shadow)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>

          <!-- Deltoides (SHOULDERS) -->
          <g :opacity="getOverlayOpacity('SHOULDERS')">
            <path d="M100 88 Q82 92 76 110 Q74 122 80 132 Q88 128 96 116 Q102 104 108 96Z" :fill="getColor('SHOULDERS')"/>
            <path d="M200 88 Q218 92 224 110 Q226 122 220 132 Q212 128 204 116 Q198 104 192 96Z" :fill="getColor('SHOULDERS')"/>
          </g>
          <path d="M100 88 Q82 92 76 110 Q74 122 80 132 Q88 128 96 116 Q102 104 108 96Z" fill="url(#skin)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>
          <path d="M88 100 Q86 110 84 118" fill="none" stroke="#c4b4a0" stroke-width="1.2" opacity="0.35"/>
          <path d="M200 88 Q218 92 224 110 Q226 122 220 132 Q212 128 204 116 Q198 104 192 96Z" fill="url(#skin)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>
          <path d="M212 100 Q214 110 216 118" fill="none" stroke="#c4b4a0" stroke-width="1.2" opacity="0.35"/>

          <!-- Pectoraux (CHEST) -->
          <g :opacity="getOverlayOpacity('CHEST')">
            <path d="M108 96 Q104 104 100 120 Q98 132 106 142 L148 146 L148 96 Q130 88 108 96Z" :fill="getColor('CHEST')"/>
            <path d="M192 96 Q196 104 200 120 Q202 132 194 142 L152 146 L152 96 Q170 88 192 96Z" :fill="getColor('CHEST')"/>
          </g>
          <path d="M108 96 Q104 104 100 120 Q98 132 106 142 L148 146 L148 96 Q130 88 108 96Z" fill="url(#skin)" :opacity="1 - getOverlayOpacity('CHEST') * 0.6"/>
          <path d="M108 108 Q120 120 140 124 Q146 124 148 122" fill="none" stroke="#c4b4a0" stroke-width="1.5" opacity="0.35"/>
          <path d="M192 96 Q196 104 200 120 Q202 132 194 142 L152 146 L152 96 Q170 88 192 96Z" fill="url(#skin)" :opacity="1 - getOverlayOpacity('CHEST') * 0.6"/>
          <path d="M192 108 Q180 120 160 124 Q154 124 152 122" fill="none" stroke="#c4b4a0" stroke-width="1.5" opacity="0.35"/>
          <line x1="150" y1="94" x2="150" y2="146" stroke="#c4b4a0" stroke-width="1.5" opacity="0.3"/>

          <!-- Serratus -->
          <path d="M100 130 Q104 136 108 142" fill="none" stroke="#c4b4a0" stroke-width="1" opacity="0.3"/>
          <path d="M98 138 Q104 144 108 148" fill="none" stroke="#c4b4a0" stroke-width="1" opacity="0.3"/>
          <path d="M200 130 Q196 136 192 142" fill="none" stroke="#c4b4a0" stroke-width="1" opacity="0.3"/>
          <path d="M202 138 Q196 144 192 148" fill="none" stroke="#c4b4a0" stroke-width="1" opacity="0.3"/>

          <!-- Biceps (BICEPS) -->
          <g :opacity="getOverlayOpacity('BICEPS')">
            <path d="M80 132 Q72 146 70 164 Q68 178 74 186 L90 182 Q88 168 86 154 Q86 140 88 132Z" :fill="getColor('BICEPS')"/>
            <path d="M220 132 Q228 146 230 164 Q232 178 226 186 L210 182 Q212 168 214 154 Q214 140 212 132Z" :fill="getColor('BICEPS')"/>
          </g>
          <path d="M80 132 Q72 146 70 164 Q68 178 74 186 L90 182 Q88 168 86 154 Q86 140 88 132Z" fill="url(#skin)" :opacity="1 - getOverlayOpacity('BICEPS') * 0.6"/>
          <path d="M78 148 Q76 160 76 170" fill="none" stroke="#c4b4a0" stroke-width="1.2" opacity="0.35"/>
          <path d="M220 132 Q228 146 230 164 Q232 178 226 186 L210 182 Q212 168 214 154 Q214 140 212 132Z" fill="url(#skin)" :opacity="1 - getOverlayOpacity('BICEPS') * 0.6"/>
          <path d="M222 148 Q224 160 224 170" fill="none" stroke="#c4b4a0" stroke-width="1.2" opacity="0.35"/>

          <!-- Avant-bras -->
          <path d="M74 186 Q68 204 62 226 Q58 240 60 250 L82 246 Q82 234 84 220 Q86 204 90 182Z" fill="url(#shadow)"/>
          <path d="M76 200 Q78 212 80 224" fill="none" stroke="#c4b4a0" stroke-width="1" opacity="0.3"/>
          <path d="M226 186 Q232 204 238 226 Q242 240 240 250 L218 246 Q218 234 216 220 Q214 204 210 182Z" fill="url(#shadow)"/>
          <path d="M224 200 Q222 212 220 224" fill="none" stroke="#c4b4a0" stroke-width="1" opacity="0.3"/>

          <!-- Obliques (ABS) -->
          <path d="M106 142 Q100 158 98 174 L112 178 Q112 162 112 150Z" fill="url(#shadow)"/>
          <path d="M194 142 Q200 158 202 174 L188 178 Q188 162 188 150Z" fill="url(#shadow)"/>

          <!-- Abdominaux (ABS) -->
          <g :opacity="getOverlayOpacity('ABS')">
            <path d="M112 146 L112 230 Q120 240 150 244 Q180 240 188 230 L188 146 L152 148 L148 148Z" :fill="getColor('ABS')"/>
          </g>
          <path d="M112 146 L112 230 Q120 240 150 244 Q180 240 188 230 L188 146 L152 148 L148 148Z" fill="url(#skin)" :opacity="1 - getOverlayOpacity('ABS') * 0.6"/>
          <line x1="150" y1="146" x2="150" y2="240" stroke="#c4b4a0" stroke-width="1.8" opacity="0.35"/>
          <path d="M118 164 Q134 168 150 166 Q166 168 182 164" fill="none" stroke="#c4b4a0" stroke-width="1.3" opacity="0.3"/>
          <path d="M118 184 Q134 188 150 186 Q166 188 182 184" fill="none" stroke="#c4b4a0" stroke-width="1.3" opacity="0.3"/>
          <path d="M120 204 Q134 208 150 206 Q166 208 180 204" fill="none" stroke="#c4b4a0" stroke-width="1.3" opacity="0.3"/>
          <path d="M124 222 Q136 226 150 224 Q164 226 176 222" fill="none" stroke="#c4b4a0" stroke-width="1.2" opacity="0.25"/>
          <path d="M112 210 Q120 238 132 252" fill="none" stroke="#c4b4a0" stroke-width="1.5" opacity="0.3"/>
          <path d="M188 210 Q180 238 168 252" fill="none" stroke="#c4b4a0" stroke-width="1.5" opacity="0.3"/>

          <!-- Hanches (GLUTES) -->
          <g :opacity="getOverlayOpacity('GLUTES')">
            <path d="M98 174 Q96 200 100 230 Q106 248 130 256 L112 230 L112 178Z" :fill="getColor('GLUTES')"/>
            <path d="M202 174 Q204 200 200 230 Q194 248 170 256 L188 230 L188 178Z" :fill="getColor('GLUTES')"/>
          </g>
          <path d="M98 174 Q96 200 100 230 Q106 248 130 256 L112 230 L112 178Z" fill="url(#shadow)" :opacity="1 - getOverlayOpacity('GLUTES') * 0.6"/>
          <path d="M202 174 Q204 200 200 230 Q194 248 170 256 L188 230 L188 178Z" fill="url(#shadow)" :opacity="1 - getOverlayOpacity('GLUTES') * 0.6"/>

          <!-- Quadriceps (QUADS) -->
          <g :opacity="getOverlayOpacity('QUADS')">
            <path d="M130 256 Q126 280 124 310 Q122 340 126 370 L148 374 L148 256Z" :fill="getColor('QUADS')"/>
            <path d="M100 240 Q96 270 98 310 Q100 340 108 370 L126 374 L126 370 Q122 340 124 310 Q126 280 130 256Z" :fill="getColor('QUADS')"/>
            <path d="M170 256 Q174 280 176 310 Q178 340 174 370 L152 374 L152 256Z" :fill="getColor('QUADS')"/>
            <path d="M200 240 Q204 270 202 310 Q200 340 192 370 L174 374 L174 370 Q178 340 176 310 Q174 280 170 256Z" :fill="getColor('QUADS')"/>
          </g>
          <path d="M130 256 Q126 280 124 310 Q122 340 126 370 L148 374 L148 256Z" fill="url(#skin)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M100 240 Q96 270 98 310 Q100 340 108 370 L126 374 L126 370 Q122 340 124 310 Q126 280 130 256Z" fill="url(#shadow)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M148 256 Q152 290 152 320 Q152 350 146 374 L148 374Z" fill="url(#shadow)" opacity="0.3"/>
          <path d="M124 270 Q130 290 130 310 Q128 340 126 370" fill="none" stroke="#c4b4a0" stroke-width="1.2" opacity="0.3"/>
          <path d="M140 260 Q140 300 142 340 Q144 360 146 374" fill="none" stroke="#c4b4a0" stroke-width="1" opacity="0.25"/>
          <path d="M170 256 Q174 280 176 310 Q178 340 174 370 L152 374 L152 256Z" fill="url(#skin)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M200 240 Q204 270 202 310 Q200 340 192 370 L174 374 L174 370 Q178 340 176 310 Q174 280 170 256Z" fill="url(#shadow)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M152 256 Q148 290 148 320 Q148 350 154 374 L152 374Z" fill="url(#shadow)" opacity="0.3"/>
          <path d="M176 270 Q170 290 170 310 Q172 340 174 370" fill="none" stroke="#c4b4a0" stroke-width="1.2" opacity="0.3"/>
          <path d="M160 260 Q160 300 158 340 Q156 360 154 374" fill="none" stroke="#c4b4a0" stroke-width="1" opacity="0.25"/>

          <!-- Genoux -->
          <ellipse cx="130" cy="378" rx="18" ry="10" fill="url(#shadow)" opacity="0.5"/>
          <ellipse cx="170" cy="378" rx="18" ry="10" fill="url(#shadow)" opacity="0.5"/>

          <!-- Mollets (CALVES) -->
          <g :opacity="getOverlayOpacity('CALVES')">
            <path d="M108 386 Q106 410 108 440 Q110 460 116 480 L140 480 Q138 460 136 440 Q134 410 138 386Z" :fill="getColor('CALVES')"/>
            <path d="M192 386 Q194 410 192 440 Q190 460 184 480 L160 480 Q162 460 164 440 Q166 410 162 386Z" :fill="getColor('CALVES')"/>
          </g>
          <path d="M108 386 Q106 410 108 440 Q110 460 116 480 L140 480 Q138 460 136 440 Q134 410 138 386Z" fill="url(#skin)" :opacity="1 - getOverlayOpacity('CALVES') * 0.6"/>
          <path d="M112 400 Q110 420 112 444" fill="none" stroke="#c4b4a0" stroke-width="1" opacity="0.25"/>
          <path d="M192 386 Q194 410 192 440 Q190 460 184 480 L160 480 Q162 460 164 440 Q166 410 162 386Z" fill="url(#skin)" :opacity="1 - getOverlayOpacity('CALVES') * 0.6"/>
          <path d="M188 400 Q190 420 188 444" fill="none" stroke="#c4b4a0" stroke-width="1" opacity="0.25"/>

          <!-- Pieds -->
          <path d="M116 480 Q108 490 104 496 Q100 502 108 504 L140 502 Q144 498 140 492 L140 480Z" fill="url(#shadow)"/>
          <path d="M184 480 Q192 490 196 496 Q200 502 192 504 L160 502 Q156 498 160 492 L160 480Z" fill="url(#shadow)"/>

          <!-- Mains -->
          <path d="M60 250 Q54 260 52 268 Q50 274 56 276 L76 272 Q80 264 82 256 L82 246Z" fill="url(#shadow)"/>
          <path d="M240 250 Q246 260 248 268 Q250 274 244 276 L224 272 Q220 264 218 256 L218 246Z" fill="url(#shadow)"/>
        </svg>

        <!-- FEMALE -->
        <svg v-else key="female" viewBox="0 0 300 520" xmlns="http://www.w3.org/2000/svg" class="h-full w-auto drop-shadow-lg">
          <defs>
            <linearGradient id="fskin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#e8ddd0"/>
              <stop offset="100%" stop-color="#d4c4b0"/>
            </linearGradient>
            <linearGradient id="fshadow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#d4c4b0"/>
              <stop offset="100%" stop-color="#b8a48f"/>
            </linearGradient>
          </defs>

          <!-- Tete -->
          <ellipse cx="150" cy="36" rx="22" ry="26" fill="url(#fskin)"/>
          <path d="M132 46 Q142 62 150 64 Q158 62 168 46" fill="#d4c4b0"/>

          <!-- Cou -->
          <path d="M140 58 L138 78 L162 78 L160 58Z" fill="url(#fshadow)"/>

          <!-- Trapezes (SHOULDERS) -->
          <g :opacity="getOverlayOpacity('SHOULDERS')">
            <path d="M138 74 Q124 74 108 84 L114 90 Q128 82 140 80Z" :fill="getColor('SHOULDERS')"/>
            <path d="M162 74 Q176 74 192 84 L186 90 Q172 82 160 80Z" :fill="getColor('SHOULDERS')"/>
          </g>
          <path d="M138 74 Q124 74 108 84 L114 90 Q128 82 140 80Z" fill="url(#fshadow)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>
          <path d="M162 74 Q176 74 192 84 L186 90 Q172 82 160 80Z" fill="url(#fshadow)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>

          <!-- Deltoides (SHOULDERS) -->
          <g :opacity="getOverlayOpacity('SHOULDERS')">
            <path d="M108 84 Q92 88 86 104 Q84 114 88 124 Q94 120 100 112 Q106 100 114 90Z" :fill="getColor('SHOULDERS')"/>
            <path d="M192 84 Q208 88 214 104 Q216 114 212 124 Q206 120 200 112 Q194 100 186 90Z" :fill="getColor('SHOULDERS')"/>
          </g>
          <path d="M108 84 Q92 88 86 104 Q84 114 88 124 Q94 120 100 112 Q106 100 114 90Z" fill="url(#fskin)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>
          <path d="M96 96 Q94 106 94 114" fill="none" stroke="#c4b4a0" stroke-width="1" opacity="0.3"/>
          <path d="M192 84 Q208 88 214 104 Q216 114 212 124 Q206 120 200 112 Q194 100 186 90Z" fill="url(#fskin)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>
          <path d="M204 96 Q206 106 206 114" fill="none" stroke="#c4b4a0" stroke-width="1" opacity="0.3"/>

          <!-- Poitrine (CHEST) -->
          <g :opacity="getOverlayOpacity('CHEST')">
            <path d="M114 90 Q108 100 106 116 Q106 130 114 138 L148 140 L148 90 Q132 84 114 90Z" :fill="getColor('CHEST')"/>
            <path d="M186 90 Q192 100 194 116 Q194 130 186 138 L152 140 L152 90 Q168 84 186 90Z" :fill="getColor('CHEST')"/>
          </g>
          <path d="M114 90 Q108 100 106 116 Q106 130 114 138 L148 140 L148 90 Q132 84 114 90Z" fill="url(#fskin)" :opacity="1 - getOverlayOpacity('CHEST') * 0.6"/>
          <path d="M114 108 Q126 118 140 120 Q146 120 148 118" fill="none" stroke="#c4b4a0" stroke-width="1.2" opacity="0.25"/>
          <path d="M186 90 Q192 100 194 116 Q194 130 186 138 L152 140 L152 90 Q168 84 186 90Z" fill="url(#fskin)" :opacity="1 - getOverlayOpacity('CHEST') * 0.6"/>
          <path d="M186 108 Q174 118 160 120 Q154 120 152 118" fill="none" stroke="#c4b4a0" stroke-width="1.2" opacity="0.25"/>
          <line x1="150" y1="88" x2="150" y2="140" stroke="#c4b4a0" stroke-width="1.2" opacity="0.2"/>

          <!-- Biceps (BICEPS) -->
          <g :opacity="getOverlayOpacity('BICEPS')">
            <path d="M88 124 Q82 138 80 154 Q78 166 82 174 L96 170 Q94 158 94 146 Q94 134 96 126Z" :fill="getColor('BICEPS')"/>
            <path d="M212 124 Q218 138 220 154 Q222 166 218 174 L204 170 Q206 158 206 146 Q206 134 204 126Z" :fill="getColor('BICEPS')"/>
          </g>
          <path d="M88 124 Q82 138 80 154 Q78 166 82 174 L96 170 Q94 158 94 146 Q94 134 96 126Z" fill="url(#fskin)" :opacity="1 - getOverlayOpacity('BICEPS') * 0.6"/>
          <path d="M212 124 Q218 138 220 154 Q222 166 218 174 L204 170 Q206 158 206 146 Q206 134 204 126Z" fill="url(#fskin)" :opacity="1 - getOverlayOpacity('BICEPS') * 0.6"/>

          <!-- Avant-bras -->
          <path d="M82 174 Q78 190 74 210 Q70 226 72 236 L90 232 Q90 222 90 208 Q92 194 96 170Z" fill="url(#fshadow)"/>
          <path d="M218 174 Q222 190 226 210 Q230 226 228 236 L210 232 Q210 222 210 208 Q208 194 204 170Z" fill="url(#fshadow)"/>

          <!-- Taille -->
          <path d="M106 130 Q100 150 98 168 L116 172 Q114 156 114 144Z" fill="url(#fshadow)"/>
          <path d="M194 130 Q200 150 202 168 L184 172 Q186 156 186 144Z" fill="url(#fshadow)"/>

          <!-- Abdominaux (ABS) -->
          <g :opacity="getOverlayOpacity('ABS')">
            <path d="M116 140 L116 224 Q126 236 150 240 Q174 236 184 224 L184 140 L152 142 L148 142Z" :fill="getColor('ABS')"/>
          </g>
          <path d="M116 140 L116 224 Q126 236 150 240 Q174 236 184 224 L184 140 L152 142 L148 142Z" fill="url(#fskin)" :opacity="1 - getOverlayOpacity('ABS') * 0.6"/>
          <line x1="150" y1="140" x2="150" y2="236" stroke="#c4b4a0" stroke-width="1.4" opacity="0.25"/>
          <path d="M122 160 Q136 164 150 162 Q164 164 178 160" fill="none" stroke="#c4b4a0" stroke-width="1.1" opacity="0.2"/>
          <path d="M122 178 Q136 182 150 180 Q164 182 178 178" fill="none" stroke="#c4b4a0" stroke-width="1.1" opacity="0.2"/>
          <path d="M124 196 Q136 200 150 198 Q164 200 176 196" fill="none" stroke="#c4b4a0" stroke-width="1.1" opacity="0.2"/>
          <path d="M116 204 Q124 232 138 250" fill="none" stroke="#c4b4a0" stroke-width="1.2" opacity="0.2"/>
          <path d="M184 204 Q176 232 162 250" fill="none" stroke="#c4b4a0" stroke-width="1.2" opacity="0.2"/>

          <!-- Hanches (GLUTES) -->
          <g :opacity="getOverlayOpacity('GLUTES')">
            <path d="M98 168 Q92 194 94 226 Q98 248 136 260 L116 224 L116 172Z" :fill="getColor('GLUTES')"/>
            <path d="M202 168 Q208 194 206 226 Q202 248 164 260 L184 224 L184 172Z" :fill="getColor('GLUTES')"/>
          </g>
          <path d="M98 168 Q92 194 94 226 Q98 248 136 260 L116 224 L116 172Z" fill="url(#fshadow)" :opacity="1 - getOverlayOpacity('GLUTES') * 0.6"/>
          <path d="M202 168 Q208 194 206 226 Q202 248 164 260 L184 224 L184 172Z" fill="url(#fshadow)" :opacity="1 - getOverlayOpacity('GLUTES') * 0.6"/>

          <!-- Quadriceps (QUADS) -->
          <g :opacity="getOverlayOpacity('QUADS')">
            <path d="M136 260 Q130 284 128 314 Q126 344 130 372 L148 376 L148 260Z" :fill="getColor('QUADS')"/>
            <path d="M94 238 Q90 270 94 314 Q98 344 108 372 L130 376 L130 372 Q126 344 128 314 Q130 284 136 260Z" :fill="getColor('QUADS')"/>
            <path d="M164 260 Q170 284 172 314 Q174 344 170 372 L152 376 L152 260Z" :fill="getColor('QUADS')"/>
            <path d="M206 238 Q210 270 206 314 Q202 344 192 372 L170 376 L170 372 Q174 344 172 314 Q170 284 164 260Z" :fill="getColor('QUADS')"/>
          </g>
          <path d="M136 260 Q130 284 128 314 Q126 344 130 372 L148 376 L148 260Z" fill="url(#fskin)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M94 238 Q90 270 94 314 Q98 344 108 372 L130 376 L130 372 Q126 344 128 314 Q130 284 136 260Z" fill="url(#fshadow)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M128 274 Q132 294 132 314 Q130 344 130 372" fill="none" stroke="#c4b4a0" stroke-width="1" opacity="0.2"/>
          <path d="M164 260 Q170 284 172 314 Q174 344 170 372 L152 376 L152 260Z" fill="url(#fskin)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M206 238 Q210 270 206 314 Q202 344 192 372 L170 376 L170 372 Q174 344 172 314 Q170 284 164 260Z" fill="url(#fshadow)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M172 274 Q168 294 168 314 Q170 344 170 372" fill="none" stroke="#c4b4a0" stroke-width="1" opacity="0.2"/>

          <!-- Genoux -->
          <ellipse cx="132" cy="380" rx="16" ry="9" fill="url(#fshadow)" opacity="0.4"/>
          <ellipse cx="168" cy="380" rx="16" ry="9" fill="url(#fshadow)" opacity="0.4"/>

          <!-- Mollets (CALVES) -->
          <g :opacity="getOverlayOpacity('CALVES')">
            <path d="M108 388 Q106 412 108 440 Q110 458 116 478 L140 478 Q138 458 136 440 Q134 412 138 388Z" :fill="getColor('CALVES')"/>
            <path d="M192 388 Q194 412 192 440 Q190 458 184 478 L160 478 Q162 458 164 440 Q166 412 162 388Z" :fill="getColor('CALVES')"/>
          </g>
          <path d="M108 388 Q106 412 108 440 Q110 458 116 478 L140 478 Q138 458 136 440 Q134 412 138 388Z" fill="url(#fskin)" :opacity="1 - getOverlayOpacity('CALVES') * 0.6"/>
          <path d="M114 400 Q112 420 114 444" fill="none" stroke="#c4b4a0" stroke-width="1" opacity="0.2"/>
          <path d="M192 388 Q194 412 192 440 Q190 458 184 478 L160 478 Q162 458 164 440 Q166 412 162 388Z" fill="url(#fskin)" :opacity="1 - getOverlayOpacity('CALVES') * 0.6"/>
          <path d="M186 400 Q188 420 186 444" fill="none" stroke="#c4b4a0" stroke-width="1" opacity="0.2"/>

          <!-- Pieds -->
          <path d="M116 478 Q108 488 104 494 Q100 500 108 502 L140 500 Q144 496 140 490 L140 478Z" fill="url(#fshadow)"/>
          <path d="M184 478 Q192 488 196 494 Q200 500 192 502 L160 500 Q156 496 160 490 L160 478Z" fill="url(#fshadow)"/>

          <!-- Mains -->
          <path d="M72 236 Q66 246 64 254 Q62 260 68 262 L86 258 Q88 250 90 242 L90 232Z" fill="url(#fshadow)"/>
          <path d="M228 236 Q234 246 236 254 Q238 260 232 262 L214 258 Q212 250 210 242 L210 232Z" fill="url(#fshadow)"/>
        </svg>
      </Transition>
    </div>

    <!-- Détail muscles -->
    <div v-if="muscleRecovery.length > 0" class="w-full mt-4 space-y-2">
      <div v-for="m in muscleRecovery.slice(0, 6)" :key="m.muscle" class="flex items-center gap-3">
        <span class="text-xs text-primary-500 dark:text-primary-400 w-24 truncate">{{ muscleLabel(m.muscle) }}</span>
        <div class="flex-1 h-2 bg-primary-100 dark:bg-primary-800 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="barClass(m.score)"
            :style="{ width: `${m.score}%` }"
          ></div>
        </div>
        <span class="text-xs font-semibold text-primary-700 dark:text-primary-300 w-10 text-right">{{ m.score }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MuscleRecoveryItem {
  muscle: string
  score: number
  daysSince: number
  lastVolume: number
}

const props = defineProps<{
  muscleRecovery: MuscleRecoveryItem[]
}>()

const gender = ref<'male' | 'female'>('male')

// Map recovery data by muscle name for O(1) lookup
const recoveryMap = computed(() => {
  const map: Record<string, number> = {}
  for (const m of props.muscleRecovery) {
    map[m.muscle] = m.score
  }
  // Also map LEGS to QUADS if QUADS not present
  if (map['LEGS'] !== undefined && map['QUADS'] === undefined) {
    map['QUADS'] = map['LEGS']
  }
  if (map['HAMSTRINGS'] !== undefined && map['GLUTES'] === undefined) {
    map['GLUTES'] = map['HAMSTRINGS']
  }
  return map
})

const getColor = (muscle: string): string => {
  const score = recoveryMap.value[muscle]
  if (score === undefined) return 'transparent'
  if (score >= 85) return '#22c55e'  // green-500
  if (score >= 60) return '#d4c4b0'  // brand gold
  if (score >= 30) return '#eab308'  // yellow-500
  return '#ef4444'                    // red-500
}

const getOverlayOpacity = (muscle: string): number => {
  const score = recoveryMap.value[muscle]
  if (score === undefined) return 0
  return 0.55
}

const barClass = (score: number): string => {
  if (score >= 85) return 'bg-green-500'
  if (score >= 60) return 'bg-[#d4c4b0]'
  if (score >= 30) return 'bg-yellow-500'
  return 'bg-red-500'
}

const muscleLabel = (muscle: string) => {
  const labels: Record<string, string> = {
    CHEST: 'Pectoraux', BACK: 'Dos', SHOULDERS: 'Epaules', BICEPS: 'Biceps',
    TRICEPS: 'Triceps', ABS: 'Abdos', LEGS: 'Jambes', QUADS: 'Quadriceps',
    HAMSTRINGS: 'Ischio-jambiers', GLUTES: 'Fessiers', CALVES: 'Mollets', CARDIO: 'Cardio',
  }
  return labels[muscle] || muscle
}
</script>

<style scoped>
.body-figure-enter-active,
.body-figure-leave-active {
  transition: all 0.3s ease;
}
.body-figure-enter-from,
.body-figure-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
