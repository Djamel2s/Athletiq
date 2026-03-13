<template>
  <div class="card-glass">
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

    <!-- Layout: barres à gauche + figure à droite -->
    <div class="flex items-center gap-4 md:gap-6">
      <!-- Barres de récupération (gauche) -->
      <div v-if="muscleRecovery.length > 0" class="flex-1 min-w-0 space-y-2.5 bg-white/40 dark:bg-primary-800/40 rounded-2xl p-3 md:p-4 border border-primary-200/50 dark:border-primary-700/50">
        <h3 class="text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wider mb-3">Récupération</h3>
        <div v-for="m in muscleRecovery.slice(0, 8)" :key="m.muscle" class="flex items-center gap-2">
          <span class="text-[10px] md:text-xs text-primary-500 dark:text-primary-400 w-20 md:w-24 truncate">{{ muscleLabel(m.muscle) }}</span>
          <div class="flex-1 h-2 bg-primary-100 dark:bg-primary-800 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="barClass(m.score)"
              :style="{ width: `${m.score}%` }"
            ></div>
          </div>
          <span class="text-[10px] md:text-xs font-semibold text-primary-700 dark:text-primary-300 w-8 text-right">{{ m.score }}%</span>
        </div>
      </div>

      <!-- Figure (droite) -->
      <div class="h-64 md:h-80 flex items-center justify-center flex-shrink-0">
        <!-- Male SVG -->
        <svg v-if="!isFemale" viewBox="0 0 300 520" xmlns="http://www.w3.org/2000/svg" class="h-full w-auto drop-shadow-lg">
          <defs>
            <linearGradient id="skin-m" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" :stop-color="skinLight"/>
              <stop offset="100%" :stop-color="skinBase"/>
            </linearGradient>
            <linearGradient id="shadow-m" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" :stop-color="skinBase"/>
              <stop offset="100%" :stop-color="skinDark"/>
            </linearGradient>
          </defs>

          <!-- Tete -->
          <ellipse cx="150" cy="38" rx="24" ry="28" fill="url(#skin-m)"/>
          <path d="M130 48 Q140 64 150 66 Q160 64 170 48" :fill="skinBase"/>

          <!-- Cou -->
          <path d="M138 60 L136 82 L164 82 L162 60Z" fill="url(#shadow-m)"/>
          <line x1="142" y1="62" x2="138" y2="80" :stroke="skinDetail" stroke-width="1" opacity="0.4"/>
          <line x1="158" y1="62" x2="162" y2="80" :stroke="skinDetail" stroke-width="1" opacity="0.4"/>

          <!-- Trapezes (SHOULDERS) -->
          <g :opacity="getOverlayOpacity('SHOULDERS')">
            <path d="M136 78 Q120 76 100 88 L108 96 Q124 86 138 84Z" :fill="getColor('SHOULDERS')"/>
            <path d="M164 78 Q180 76 200 88 L192 96 Q176 86 162 84Z" :fill="getColor('SHOULDERS')"/>
          </g>
          <path d="M136 78 Q120 76 100 88 L108 96 Q124 86 138 84Z" fill="url(#shadow-m)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>
          <path d="M164 78 Q180 76 200 88 L192 96 Q176 86 162 84Z" fill="url(#shadow-m)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>

          <!-- Deltoides (SHOULDERS) -->
          <g :opacity="getOverlayOpacity('SHOULDERS')">
            <path d="M100 88 Q82 92 76 110 Q74 122 80 132 Q88 128 96 116 Q102 104 108 96Z" :fill="getColor('SHOULDERS')"/>
            <path d="M200 88 Q218 92 224 110 Q226 122 220 132 Q212 128 204 116 Q198 104 192 96Z" :fill="getColor('SHOULDERS')"/>
          </g>
          <path d="M100 88 Q82 92 76 110 Q74 122 80 132 Q88 128 96 116 Q102 104 108 96Z" fill="url(#skin-m)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>
          <path d="M88 100 Q86 110 84 118" fill="none" :stroke="skinDetail" stroke-width="1.2" opacity="0.35"/>
          <path d="M200 88 Q218 92 224 110 Q226 122 220 132 Q212 128 204 116 Q198 104 192 96Z" fill="url(#skin-m)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>
          <path d="M212 100 Q214 110 216 118" fill="none" :stroke="skinDetail" stroke-width="1.2" opacity="0.35"/>

          <!-- Pectoraux (CHEST) -->
          <g :opacity="getOverlayOpacity('CHEST')">
            <path d="M108 96 Q104 104 100 120 Q98 132 106 142 L148 146 L148 96 Q130 88 108 96Z" :fill="getColor('CHEST')"/>
            <path d="M192 96 Q196 104 200 120 Q202 132 194 142 L152 146 L152 96 Q170 88 192 96Z" :fill="getColor('CHEST')"/>
          </g>
          <path d="M108 96 Q104 104 100 120 Q98 132 106 142 L148 146 L148 96 Q130 88 108 96Z" fill="url(#skin-m)" :opacity="1 - getOverlayOpacity('CHEST') * 0.6"/>
          <path d="M108 108 Q120 120 140 124 Q146 124 148 122" fill="none" :stroke="skinDetail" stroke-width="1.5" opacity="0.35"/>
          <path d="M192 96 Q196 104 200 120 Q202 132 194 142 L152 146 L152 96 Q170 88 192 96Z" fill="url(#skin-m)" :opacity="1 - getOverlayOpacity('CHEST') * 0.6"/>
          <path d="M192 108 Q180 120 160 124 Q154 124 152 122" fill="none" :stroke="skinDetail" stroke-width="1.5" opacity="0.35"/>
          <line x1="150" y1="94" x2="150" y2="146" :stroke="skinDetail" stroke-width="1.5" opacity="0.3"/>

          <!-- Serratus -->
          <path d="M100 130 Q104 136 108 142" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.3"/>
          <path d="M98 138 Q104 144 108 148" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.3"/>
          <path d="M200 130 Q196 136 192 142" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.3"/>
          <path d="M202 138 Q196 144 192 148" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.3"/>

          <!-- Biceps (BICEPS) -->
          <g :opacity="getOverlayOpacity('BICEPS')">
            <path d="M80 132 Q72 146 70 164 Q68 178 74 186 L90 182 Q88 168 86 154 Q86 140 88 132Z" :fill="getColor('BICEPS')"/>
            <path d="M220 132 Q228 146 230 164 Q232 178 226 186 L210 182 Q212 168 214 154 Q214 140 212 132Z" :fill="getColor('BICEPS')"/>
          </g>
          <path d="M80 132 Q72 146 70 164 Q68 178 74 186 L90 182 Q88 168 86 154 Q86 140 88 132Z" fill="url(#skin-m)" :opacity="1 - getOverlayOpacity('BICEPS') * 0.6"/>
          <path d="M78 148 Q76 160 76 170" fill="none" :stroke="skinDetail" stroke-width="1.2" opacity="0.35"/>
          <path d="M220 132 Q228 146 230 164 Q232 178 226 186 L210 182 Q212 168 214 154 Q214 140 212 132Z" fill="url(#skin-m)" :opacity="1 - getOverlayOpacity('BICEPS') * 0.6"/>
          <path d="M222 148 Q224 160 224 170" fill="none" :stroke="skinDetail" stroke-width="1.2" opacity="0.35"/>

          <!-- Avant-bras -->
          <path d="M74 186 Q68 204 62 226 Q58 240 60 250 L82 246 Q82 234 84 220 Q86 204 90 182Z" fill="url(#shadow-m)"/>
          <path d="M76 200 Q78 212 80 224" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.3"/>
          <path d="M226 186 Q232 204 238 226 Q242 240 240 250 L218 246 Q218 234 216 220 Q214 204 210 182Z" fill="url(#shadow-m)"/>
          <path d="M224 200 Q222 212 220 224" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.3"/>

          <!-- Obliques (ABS) -->
          <path d="M106 142 Q100 158 98 174 L112 178 Q112 162 112 150Z" fill="url(#shadow-m)"/>
          <path d="M194 142 Q200 158 202 174 L188 178 Q188 162 188 150Z" fill="url(#shadow-m)"/>

          <!-- Abdominaux (ABS) -->
          <g :opacity="getOverlayOpacity('ABS')">
            <path d="M112 146 L112 230 Q120 240 150 244 Q180 240 188 230 L188 146 L152 148 L148 148Z" :fill="getColor('ABS')"/>
          </g>
          <path d="M112 146 L112 230 Q120 240 150 244 Q180 240 188 230 L188 146 L152 148 L148 148Z" fill="url(#skin-m)" :opacity="1 - getOverlayOpacity('ABS') * 0.6"/>
          <line x1="150" y1="146" x2="150" y2="240" :stroke="skinDetail" stroke-width="1.8" opacity="0.35"/>
          <path d="M118 164 Q134 168 150 166 Q166 168 182 164" fill="none" :stroke="skinDetail" stroke-width="1.3" opacity="0.3"/>
          <path d="M118 184 Q134 188 150 186 Q166 188 182 184" fill="none" :stroke="skinDetail" stroke-width="1.3" opacity="0.3"/>
          <path d="M120 204 Q134 208 150 206 Q166 208 180 204" fill="none" :stroke="skinDetail" stroke-width="1.3" opacity="0.3"/>
          <path d="M124 222 Q136 226 150 224 Q164 226 176 222" fill="none" :stroke="skinDetail" stroke-width="1.2" opacity="0.25"/>
          <path d="M112 210 Q120 238 132 252" fill="none" :stroke="skinDetail" stroke-width="1.5" opacity="0.3"/>
          <path d="M188 210 Q180 238 168 252" fill="none" :stroke="skinDetail" stroke-width="1.5" opacity="0.3"/>

          <!-- Hanches (GLUTES) -->
          <g :opacity="getOverlayOpacity('GLUTES')">
            <path d="M98 174 Q96 200 100 230 Q106 248 130 256 L112 230 L112 178Z" :fill="getColor('GLUTES')"/>
            <path d="M202 174 Q204 200 200 230 Q194 248 170 256 L188 230 L188 178Z" :fill="getColor('GLUTES')"/>
          </g>
          <path d="M98 174 Q96 200 100 230 Q106 248 130 256 L112 230 L112 178Z" fill="url(#shadow-m)" :opacity="1 - getOverlayOpacity('GLUTES') * 0.6"/>
          <path d="M202 174 Q204 200 200 230 Q194 248 170 256 L188 230 L188 178Z" fill="url(#shadow-m)" :opacity="1 - getOverlayOpacity('GLUTES') * 0.6"/>

          <!-- Quadriceps (QUADS) -->
          <g :opacity="getOverlayOpacity('QUADS')">
            <path d="M130 256 Q126 280 124 310 Q122 340 126 370 L148 374 L148 256Z" :fill="getColor('QUADS')"/>
            <path d="M100 240 Q96 270 98 310 Q100 340 108 370 L126 374 L126 370 Q122 340 124 310 Q126 280 130 256Z" :fill="getColor('QUADS')"/>
            <path d="M170 256 Q174 280 176 310 Q178 340 174 370 L152 374 L152 256Z" :fill="getColor('QUADS')"/>
            <path d="M200 240 Q204 270 202 310 Q200 340 192 370 L174 374 L174 370 Q178 340 176 310 Q174 280 170 256Z" :fill="getColor('QUADS')"/>
          </g>
          <path d="M130 256 Q126 280 124 310 Q122 340 126 370 L148 374 L148 256Z" fill="url(#skin-m)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M100 240 Q96 270 98 310 Q100 340 108 370 L126 374 L126 370 Q122 340 124 310 Q126 280 130 256Z" fill="url(#shadow-m)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M124 270 Q130 290 130 310 Q128 340 126 370" fill="none" :stroke="skinDetail" stroke-width="1.2" opacity="0.3"/>
          <path d="M140 260 Q140 300 142 340 Q144 360 146 374" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.25"/>
          <path d="M170 256 Q174 280 176 310 Q178 340 174 370 L152 374 L152 256Z" fill="url(#skin-m)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M200 240 Q204 270 202 310 Q200 340 192 370 L174 374 L174 370 Q178 340 176 310 Q174 280 170 256Z" fill="url(#shadow-m)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M176 270 Q170 290 170 310 Q172 340 174 370" fill="none" :stroke="skinDetail" stroke-width="1.2" opacity="0.3"/>
          <path d="M160 260 Q160 300 158 340 Q156 360 154 374" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.25"/>

          <!-- Genoux -->
          <ellipse cx="130" cy="378" rx="18" ry="10" fill="url(#shadow-m)" opacity="0.5"/>
          <ellipse cx="170" cy="378" rx="18" ry="10" fill="url(#shadow-m)" opacity="0.5"/>

          <!-- Mollets (CALVES) -->
          <g :opacity="getOverlayOpacity('CALVES')">
            <path d="M108 386 Q106 410 108 440 Q110 460 116 480 L140 480 Q138 460 136 440 Q134 410 138 386Z" :fill="getColor('CALVES')"/>
            <path d="M192 386 Q194 410 192 440 Q190 460 184 480 L160 480 Q162 460 164 440 Q166 410 162 386Z" :fill="getColor('CALVES')"/>
          </g>
          <path d="M108 386 Q106 410 108 440 Q110 460 116 480 L140 480 Q138 460 136 440 Q134 410 138 386Z" fill="url(#skin-m)" :opacity="1 - getOverlayOpacity('CALVES') * 0.6"/>
          <path d="M112 400 Q110 420 112 444" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.25"/>
          <path d="M192 386 Q194 410 192 440 Q190 460 184 480 L160 480 Q162 460 164 440 Q166 410 162 386Z" fill="url(#skin-m)" :opacity="1 - getOverlayOpacity('CALVES') * 0.6"/>
          <path d="M188 400 Q190 420 188 444" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.25"/>

          <!-- Pieds -->
          <path d="M116 480 Q108 490 104 496 Q100 502 108 504 L140 502 Q144 498 140 492 L140 480Z" fill="url(#shadow-m)"/>
          <path d="M184 480 Q192 490 196 496 Q200 502 192 504 L160 502 Q156 498 160 492 L160 480Z" fill="url(#shadow-m)"/>

          <!-- Mains -->
          <path d="M60 250 Q54 260 52 268 Q50 274 56 276 L76 272 Q80 264 82 256 L82 246Z" fill="url(#shadow-m)"/>
          <path d="M240 250 Q246 260 248 268 Q250 274 244 276 L224 272 Q220 264 218 256 L218 246Z" fill="url(#shadow-m)"/>
        </svg>

        <!-- Female SVG -->
        <svg v-else viewBox="0 0 300 520" xmlns="http://www.w3.org/2000/svg" class="h-full w-auto drop-shadow-lg">
          <defs>
            <linearGradient id="skin-f" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" :stop-color="skinLight"/>
              <stop offset="100%" :stop-color="skinBase"/>
            </linearGradient>
            <linearGradient id="shadow-f" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" :stop-color="skinBase"/>
              <stop offset="100%" :stop-color="skinDark"/>
            </linearGradient>
          </defs>

          <!-- Tete (plus petite, plus ronde) -->
          <ellipse cx="150" cy="36" rx="22" ry="26" fill="url(#skin-f)"/>
          <path d="M132 44 Q142 60 150 62 Q158 60 168 44" :fill="skinBase"/>
          <!-- Cheveux hint -->
          <path d="M128 28 Q130 16 150 12 Q170 16 172 28" fill="none" :stroke="skinDark" stroke-width="2" opacity="0.3"/>

          <!-- Cou (plus fin) -->
          <path d="M140 58 L139 78 L161 78 L160 58Z" fill="url(#shadow-f)"/>

          <!-- Trapezes (SHOULDERS - plus étroits) -->
          <g :opacity="getOverlayOpacity('SHOULDERS')">
            <path d="M139 76 Q126 74 108 84 L114 92 Q128 84 141 82Z" :fill="getColor('SHOULDERS')"/>
            <path d="M161 76 Q174 74 192 84 L186 92 Q172 84 159 82Z" :fill="getColor('SHOULDERS')"/>
          </g>
          <path d="M139 76 Q126 74 108 84 L114 92 Q128 84 141 82Z" fill="url(#shadow-f)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>
          <path d="M161 76 Q174 74 192 84 L186 92 Q172 84 159 82Z" fill="url(#shadow-f)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>

          <!-- Deltoides (SHOULDERS - plus petits) -->
          <g :opacity="getOverlayOpacity('SHOULDERS')">
            <path d="M108 84 Q92 88 86 104 Q84 114 88 124 Q94 120 100 110 Q106 100 114 92Z" :fill="getColor('SHOULDERS')"/>
            <path d="M192 84 Q208 88 214 104 Q216 114 212 124 Q206 120 200 110 Q194 100 186 92Z" :fill="getColor('SHOULDERS')"/>
          </g>
          <path d="M108 84 Q92 88 86 104 Q84 114 88 124 Q94 120 100 110 Q106 100 114 92Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>
          <path d="M192 84 Q208 88 214 104 Q216 114 212 124 Q206 120 200 110 Q194 100 186 92Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>

          <!-- Poitrine (CHEST - formes féminines) -->
          <g :opacity="getOverlayOpacity('CHEST')">
            <path d="M114 92 Q108 100 104 116 Q102 130 110 140 L148 144 L148 92 Q134 86 114 92Z" :fill="getColor('CHEST')"/>
            <path d="M186 92 Q192 100 196 116 Q198 130 190 140 L152 144 L152 92 Q166 86 186 92Z" :fill="getColor('CHEST')"/>
          </g>
          <path d="M114 92 Q108 100 104 116 Q102 130 110 140 L148 144 L148 92 Q134 86 114 92Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('CHEST') * 0.6"/>
          <path d="M186 92 Q192 100 196 116 Q198 130 190 140 L152 144 L152 92 Q166 86 186 92Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('CHEST') * 0.6"/>
          <!-- Courbes poitrine -->
          <path d="M112 106 Q118 124 134 130 Q142 132 148 128" fill="none" :stroke="skinDetail" stroke-width="1.8" opacity="0.4"/>
          <path d="M188 106 Q182 124 166 130 Q158 132 152 128" fill="none" :stroke="skinDetail" stroke-width="1.8" opacity="0.4"/>
          <line x1="150" y1="90" x2="150" y2="144" :stroke="skinDetail" stroke-width="1.2" opacity="0.2"/>

          <!-- Biceps (BICEPS - plus fins) -->
          <g :opacity="getOverlayOpacity('BICEPS')">
            <path d="M88 124 Q82 138 80 154 Q78 168 82 176 L96 172 Q94 160 93 148 Q93 136 94 124Z" :fill="getColor('BICEPS')"/>
            <path d="M212 124 Q218 138 220 154 Q222 168 218 176 L204 172 Q206 160 207 148 Q207 136 206 124Z" :fill="getColor('BICEPS')"/>
          </g>
          <path d="M88 124 Q82 138 80 154 Q78 168 82 176 L96 172 Q94 160 93 148 Q93 136 94 124Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('BICEPS') * 0.6"/>
          <path d="M212 124 Q218 138 220 154 Q222 168 218 176 L204 172 Q206 160 207 148 Q207 136 206 124Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('BICEPS') * 0.6"/>

          <!-- Avant-bras (plus fins) -->
          <path d="M82 176 Q76 194 72 214 Q68 228 70 238 L88 234 Q88 224 90 212 Q92 196 96 172Z" fill="url(#shadow-f)"/>
          <path d="M218 176 Q224 194 228 214 Q232 228 230 238 L212 234 Q212 224 210 212 Q208 196 204 172Z" fill="url(#shadow-f)"/>

          <!-- Taille fine (ABS - cintrée) -->
          <g :opacity="getOverlayOpacity('ABS')">
            <path d="M118 144 Q114 160 112 180 Q110 200 114 220 Q122 238 150 244 Q178 238 186 220 Q190 200 188 180 Q186 160 182 144 L152 146 L148 146Z" :fill="getColor('ABS')"/>
          </g>
          <path d="M118 144 Q114 160 112 180 Q110 200 114 220 Q122 238 150 244 Q178 238 186 220 Q190 200 188 180 Q186 160 182 144 L152 146 L148 146Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('ABS') * 0.6"/>
          <line x1="150" y1="144" x2="150" y2="238" :stroke="skinDetail" stroke-width="1.2" opacity="0.2"/>
          <path d="M126 166 Q138 170 150 168 Q162 170 174 166" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.2"/>
          <path d="M124 186 Q138 190 150 188 Q162 190 176 186" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.2"/>
          <path d="M122 206 Q136 210 150 208 Q164 210 178 206" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.2"/>
          <!-- Courbe de la taille -->
          <path d="M110 140 Q104 166 106 180" fill="none" :stroke="skinDetail" stroke-width="1.5" opacity="0.3"/>
          <path d="M190 140 Q196 166 194 180" fill="none" :stroke="skinDetail" stroke-width="1.5" opacity="0.3"/>

          <!-- Hanches larges + Fessiers (GLUTES - plus prononcés) -->
          <g :opacity="getOverlayOpacity('GLUTES')">
            <path d="M106 180 Q96 200 92 224 Q90 242 100 258 Q112 270 134 264 L118 230 Q114 210 112 190Z" :fill="getColor('GLUTES')"/>
            <path d="M194 180 Q204 200 208 224 Q210 242 200 258 Q188 270 166 264 L182 230 Q186 210 188 190Z" :fill="getColor('GLUTES')"/>
          </g>
          <path d="M106 180 Q96 200 92 224 Q90 242 100 258 Q112 270 134 264 L118 230 Q114 210 112 190Z" fill="url(#shadow-f)" :opacity="1 - getOverlayOpacity('GLUTES') * 0.6"/>
          <path d="M194 180 Q204 200 208 224 Q210 242 200 258 Q188 270 166 264 L182 230 Q186 210 188 190Z" fill="url(#shadow-f)" :opacity="1 - getOverlayOpacity('GLUTES') * 0.6"/>
          <!-- Courbe fessiers -->
          <path d="M96 210 Q94 230 100 250" fill="none" :stroke="skinDetail" stroke-width="1.2" opacity="0.3"/>
          <path d="M204 210 Q206 230 200 250" fill="none" :stroke="skinDetail" stroke-width="1.2" opacity="0.3"/>

          <!-- Quadriceps (QUADS - plus fins, hanches plus larges) -->
          <g :opacity="getOverlayOpacity('QUADS')">
            <path d="M134 264 Q130 286 128 314 Q126 342 130 370 L148 374 L148 264Z" :fill="getColor('QUADS')"/>
            <path d="M100 258 Q96 280 98 314 Q100 342 110 370 L130 374 L130 370 Q126 342 128 314 Q130 286 134 264Z" :fill="getColor('QUADS')"/>
            <path d="M166 264 Q170 286 172 314 Q174 342 170 370 L152 374 L152 264Z" :fill="getColor('QUADS')"/>
            <path d="M200 258 Q204 280 202 314 Q200 342 190 370 L170 374 L170 370 Q174 342 172 314 Q170 286 166 264Z" :fill="getColor('QUADS')"/>
          </g>
          <path d="M134 264 Q130 286 128 314 Q126 342 130 370 L148 374 L148 264Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M100 258 Q96 280 98 314 Q100 342 110 370 L130 374 L130 370 Q126 342 128 314 Q130 286 134 264Z" fill="url(#shadow-f)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M166 264 Q170 286 172 314 Q174 342 170 370 L152 374 L152 264Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M200 258 Q204 280 202 314 Q200 342 190 370 L170 374 L170 370 Q174 342 172 314 Q170 286 166 264Z" fill="url(#shadow-f)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M128 280 Q132 300 132 320 Q130 348 130 370" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.25"/>
          <path d="M172 280 Q168 300 168 320 Q170 348 170 370" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.25"/>

          <!-- Genoux -->
          <ellipse cx="134" cy="378" rx="16" ry="9" fill="url(#shadow-f)" opacity="0.5"/>
          <ellipse cx="166" cy="378" rx="16" ry="9" fill="url(#shadow-f)" opacity="0.5"/>

          <!-- Mollets (CALVES - plus fins, galbés) -->
          <g :opacity="getOverlayOpacity('CALVES')">
            <path d="M114 386 Q112 408 114 436 Q116 456 122 476 L142 476 Q140 456 138 436 Q136 408 140 386Z" :fill="getColor('CALVES')"/>
            <path d="M186 386 Q188 408 186 436 Q184 456 178 476 L158 476 Q160 456 162 436 Q164 408 160 386Z" :fill="getColor('CALVES')"/>
          </g>
          <path d="M114 386 Q112 408 114 436 Q116 456 122 476 L142 476 Q140 456 138 436 Q136 408 140 386Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('CALVES') * 0.6"/>
          <path d="M186 386 Q188 408 186 436 Q184 456 178 476 L158 476 Q160 456 162 436 Q164 408 160 386Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('CALVES') * 0.6"/>
          <path d="M118 400 Q116 418 118 440" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.2"/>
          <path d="M182 400 Q184 418 182 440" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.2"/>

          <!-- Pieds (plus petits) -->
          <path d="M122 476 Q114 486 112 492 Q110 498 116 500 L142 498 Q146 494 142 488 L142 476Z" fill="url(#shadow-f)"/>
          <path d="M178 476 Q186 486 188 492 Q190 498 184 500 L158 498 Q154 494 158 488 L158 476Z" fill="url(#shadow-f)"/>

          <!-- Mains (plus petites) -->
          <path d="M70 238 Q64 248 62 254 Q60 260 66 262 L82 258 Q86 252 88 244 L88 234Z" fill="url(#shadow-f)"/>
          <path d="M230 238 Q236 248 238 254 Q240 260 234 262 L218 258 Q214 252 212 244 L212 234Z" fill="url(#shadow-f)"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

interface MuscleRecoveryItem {
  muscle: string
  score: number
  daysSince: number
  lastVolume: number
}

const props = defineProps<{
  muscleRecovery: MuscleRecoveryItem[]
}>()

const authStore = useAuthStore()
const { isRose, accentColors } = useTheme()

const isFemale = computed(() => authStore.user?.gender === 'female')

// Skin colors based on theme
const skinBase = computed(() => accentColors.value[500])
const skinLight = computed(() => {
  // Lighter version
  return isRose.value ? '#e8d0da' : '#e8ddd0'
})
const skinDark = computed(() => accentColors.value[600])
const skinDetail = computed(() => isRose.value ? '#c4a0b0' : '#c4b4a0')

// Map recovery data by muscle name for O(1) lookup
const recoveryMap = computed(() => {
  const map: Record<string, number> = {}
  for (const m of props.muscleRecovery) {
    map[m.muscle] = m.score
  }
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
  if (score >= 85) return '#22c55e'
  if (score >= 60) return accentColors.value[500]
  if (score >= 30) return '#eab308'
  return '#ef4444'
}

const getOverlayOpacity = (muscle: string): number => {
  const score = recoveryMap.value[muscle]
  if (score === undefined) return 0
  return 0.55
}

const barClass = (score: number): string => {
  if (score >= 85) return 'bg-green-500'
  if (score >= 60) return 'bg-sand-500'
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
