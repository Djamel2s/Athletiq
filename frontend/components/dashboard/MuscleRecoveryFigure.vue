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
      <div class="flex-1 min-w-0 space-y-2.5 bg-white/40 dark:bg-primary-800/40 rounded-2xl p-3 md:p-4 border border-primary-200/50 dark:border-primary-700/50">
        <h3 class="text-[10px] md:text-xs font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wider mb-3 truncate">Récupération</h3>
        <div v-for="m in displayBars" :key="m.muscle" class="flex items-center gap-2">
          <span class="text-[10px] md:text-xs text-primary-500 dark:text-primary-400 w-16 md:w-24 truncate flex-shrink-0">{{ muscleLabel(m.muscle) }}</span>
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

          <!-- Tete -->
          <ellipse cx="150" cy="36" rx="22" ry="26" fill="url(#skin-f)"/>
          <path d="M132 44 Q142 60 150 62 Q158 60 168 44" :fill="skinBase"/>
          <path d="M128 28 Q130 16 150 12 Q170 16 172 28" fill="none" :stroke="skinDark" stroke-width="2" opacity="0.3"/>

          <!-- Cou fin -->
          <path d="M141 58 L140 78 L160 78 L159 58Z" fill="url(#shadow-f)"/>

          <!-- Trapezes (SHOULDERS - étroits) -->
          <g :opacity="getOverlayOpacity('SHOULDERS')">
            <path d="M140 76 Q128 74 112 84 L117 91 Q130 83 142 81Z" :fill="getColor('SHOULDERS')"/>
            <path d="M160 76 Q172 74 188 84 L183 91 Q170 83 158 81Z" :fill="getColor('SHOULDERS')"/>
          </g>
          <path d="M140 76 Q128 74 112 84 L117 91 Q130 83 142 81Z" fill="url(#shadow-f)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>
          <path d="M160 76 Q172 74 188 84 L183 91 Q170 83 158 81Z" fill="url(#shadow-f)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>

          <!-- Deltoides (SHOULDERS - petits) -->
          <g :opacity="getOverlayOpacity('SHOULDERS')">
            <path d="M112 84 Q96 88 90 102 Q88 112 92 120 Q97 117 102 108 Q108 98 117 91Z" :fill="getColor('SHOULDERS')"/>
            <path d="M188 84 Q204 88 210 102 Q212 112 208 120 Q203 117 198 108 Q192 98 183 91Z" :fill="getColor('SHOULDERS')"/>
          </g>
          <path d="M112 84 Q96 88 90 102 Q88 112 92 120 Q97 117 102 108 Q108 98 117 91Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>
          <path d="M188 84 Q204 88 210 102 Q212 112 208 120 Q203 117 198 108 Q192 98 183 91Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('SHOULDERS') * 0.6"/>

          <!-- Poitrine / Seins (CHEST - ronds, volumineux) -->
          <g :opacity="getOverlayOpacity('CHEST')">
            <path d="M117 91 Q110 98 106 108 L106 116 Q106 138 120 148 L148 148 L148 91 Q134 86 117 91Z" :fill="getColor('CHEST')"/>
            <path d="M183 91 Q190 98 194 108 L194 116 Q194 138 180 148 L152 148 L152 91 Q166 86 183 91Z" :fill="getColor('CHEST')"/>
          </g>
          <path d="M117 91 Q110 98 106 108 L106 116 Q106 138 120 148 L148 148 L148 91 Q134 86 117 91Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('CHEST') * 0.6"/>
          <path d="M183 91 Q190 98 194 108 L194 116 Q194 138 180 148 L152 148 L152 91 Q166 86 183 91Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('CHEST') * 0.6"/>
          <!-- Seins - courbes rondes bien marquées -->
          <ellipse cx="127" cy="118" rx="20" ry="18" fill="url(#skin-f)" opacity="0.6"/>
          <ellipse cx="173" cy="118" rx="20" ry="18" fill="url(#skin-f)" opacity="0.6"/>
          <path d="M110 108 Q116 130 130 138 Q140 142 148 136" fill="none" :stroke="skinDetail" stroke-width="2" opacity="0.5"/>
          <path d="M190 108 Q184 130 170 138 Q160 142 152 136" fill="none" :stroke="skinDetail" stroke-width="2" opacity="0.5"/>
          <line x1="150" y1="90" x2="150" y2="148" :stroke="skinDetail" stroke-width="1" opacity="0.15"/>

          <!-- Biceps (BICEPS - fins) -->
          <g :opacity="getOverlayOpacity('BICEPS')">
            <path d="M92 120 Q86 134 84 150 Q82 162 86 170 L98 166 Q96 156 96 144 Q96 132 97 120Z" :fill="getColor('BICEPS')"/>
            <path d="M208 120 Q214 134 216 150 Q218 162 214 170 L202 166 Q204 156 204 144 Q204 132 203 120Z" :fill="getColor('BICEPS')"/>
          </g>
          <path d="M92 120 Q86 134 84 150 Q82 162 86 170 L98 166 Q96 156 96 144 Q96 132 97 120Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('BICEPS') * 0.6"/>
          <path d="M208 120 Q214 134 216 150 Q218 162 214 170 L202 166 Q204 156 204 144 Q204 132 203 120Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('BICEPS') * 0.6"/>

          <!-- Avant-bras fins -->
          <path d="M86 170 Q80 188 76 208 Q72 222 74 232 L90 228 Q90 220 92 208 Q94 192 98 166Z" fill="url(#shadow-f)"/>
          <path d="M214 170 Q220 188 224 208 Q228 222 226 232 L210 228 Q210 220 208 208 Q206 192 202 166Z" fill="url(#shadow-f)"/>

          <!-- Taille ULTRA fine (ABS - style Orangina/animé) -->
          <g :opacity="getOverlayOpacity('ABS')">
            <path d="M120 148 Q128 152 150 152 Q172 152 180 148 Q176 158 172 164 Q164 172 158 178 Q154 182 150 184 Q146 182 142 178 Q136 172 128 164 Q124 158 120 148Z" :fill="getColor('ABS')"/>
            <path d="M142 178 Q136 186 132 196 Q128 208 130 220 Q134 236 150 242 Q166 236 170 220 Q172 208 168 196 Q164 186 158 178 Q154 182 150 184 Q146 182 142 178Z" :fill="getColor('ABS')"/>
          </g>
          <path d="M120 148 Q128 152 150 152 Q172 152 180 148 Q176 158 172 164 Q164 172 158 178 Q154 182 150 184 Q146 182 142 178 Q136 172 128 164 Q124 158 120 148Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('ABS') * 0.6"/>
          <path d="M142 178 Q136 186 132 196 Q128 208 130 220 Q134 236 150 242 Q166 236 170 220 Q172 208 168 196 Q164 186 158 178 Q154 182 150 184 Q146 182 142 178Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('ABS') * 0.6"/>
          <line x1="150" y1="152" x2="150" y2="238" :stroke="skinDetail" stroke-width="1" opacity="0.15"/>
          <path d="M138 170 Q144 172 150 171 Q156 172 162 170" fill="none" :stroke="skinDetail" stroke-width="0.8" opacity="0.15"/>
          <path d="M136 192 Q142 195 150 194 Q158 195 164 192" fill="none" :stroke="skinDetail" stroke-width="0.8" opacity="0.15"/>
          <!-- Courbes taille cintrée -->
          <path d="M120 148 Q114 162 128 164" fill="none" :stroke="skinDetail" stroke-width="1.5" opacity="0.35"/>
          <path d="M180 148 Q186 162 172 164" fill="none" :stroke="skinDetail" stroke-width="1.5" opacity="0.35"/>

          <!-- Hanches + Fessiers (GLUTES) -->
          <g :opacity="getOverlayOpacity('GLUTES')">
            <path d="M128 164 Q116 174 106 192 Q98 210 98 228 Q100 248 110 258 Q120 266 138 262 L132 196 Q130 178 128 164Z" :fill="getColor('GLUTES')"/>
            <path d="M172 164 Q184 174 194 192 Q202 210 202 228 Q200 248 190 258 Q180 266 162 262 L168 196 Q170 178 172 164Z" :fill="getColor('GLUTES')"/>
          </g>
          <path d="M128 164 Q116 174 106 192 Q98 210 98 228 Q100 248 110 258 Q120 266 138 262 L132 196 Q130 178 128 164Z" fill="url(#shadow-f)" :opacity="1 - getOverlayOpacity('GLUTES') * 0.6"/>
          <path d="M172 164 Q184 174 194 192 Q202 210 202 228 Q200 248 190 258 Q180 266 162 262 L168 196 Q170 178 172 164Z" fill="url(#shadow-f)" :opacity="1 - getOverlayOpacity('GLUTES') * 0.6"/>
          <!-- Courbe fessiers -->
          <path d="M102 200 Q100 218 104 244" fill="none" :stroke="skinDetail" stroke-width="1.2" opacity="0.3"/>
          <path d="M198 200 Q200 218 196 244" fill="none" :stroke="skinDetail" stroke-width="1.2" opacity="0.3"/>

          <!-- Quadriceps (QUADS) -->
          <g :opacity="getOverlayOpacity('QUADS')">
            <path d="M138 262 Q134 284 132 312 Q130 340 134 370 L150 374 L150 262Z" :fill="getColor('QUADS')"/>
            <path d="M110 258 Q106 282 108 312 Q110 340 118 370 L134 374 L134 370 Q130 340 132 312 Q134 284 138 262Z" :fill="getColor('QUADS')"/>
            <path d="M162 262 Q166 284 168 312 Q170 340 166 370 L150 374 L150 262Z" :fill="getColor('QUADS')"/>
            <path d="M190 258 Q194 282 192 312 Q190 340 182 370 L166 374 L166 370 Q170 340 168 312 Q166 284 162 262Z" :fill="getColor('QUADS')"/>
          </g>
          <path d="M138 262 Q134 284 132 312 Q130 340 134 370 L150 374 L150 262Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M110 258 Q106 282 108 312 Q110 340 118 370 L134 374 L134 370 Q130 340 132 312 Q134 284 138 262Z" fill="url(#shadow-f)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M162 262 Q166 284 168 312 Q170 340 166 370 L150 374 L150 262Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M190 258 Q194 282 192 312 Q190 340 182 370 L166 374 L166 370 Q170 340 168 312 Q166 284 162 262Z" fill="url(#shadow-f)" :opacity="1 - getOverlayOpacity('QUADS') * 0.6"/>
          <path d="M132 284 Q136 304 136 324 Q134 350 134 370" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.2"/>
          <path d="M168 284 Q164 304 164 324 Q166 350 166 370" fill="none" :stroke="skinDetail" stroke-width="1" opacity="0.2"/>

          <!-- Genoux -->
          <ellipse cx="136" cy="378" rx="16" ry="9" fill="url(#shadow-f)" opacity="0.5"/>
          <ellipse cx="164" cy="378" rx="16" ry="9" fill="url(#shadow-f)" opacity="0.5"/>

          <!-- Mollets (CALVES - galbés) -->
          <g :opacity="getOverlayOpacity('CALVES')">
            <path d="M116 386 Q114 408 116 436 Q118 456 124 476 L144 476 Q142 456 140 436 Q138 408 142 386Z" :fill="getColor('CALVES')"/>
            <path d="M184 386 Q186 408 184 436 Q182 456 176 476 L156 476 Q158 456 160 436 Q162 408 158 386Z" :fill="getColor('CALVES')"/>
          </g>
          <path d="M116 386 Q114 408 116 436 Q118 456 124 476 L144 476 Q142 456 140 436 Q138 408 142 386Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('CALVES') * 0.6"/>
          <path d="M184 386 Q186 408 184 436 Q182 456 176 476 L156 476 Q158 456 160 436 Q162 408 158 386Z" fill="url(#skin-f)" :opacity="1 - getOverlayOpacity('CALVES') * 0.6"/>

          <!-- Pieds -->
          <path d="M124 476 Q116 486 114 492 Q112 498 118 500 L144 498 Q148 494 144 488 L144 476Z" fill="url(#shadow-f)"/>
          <path d="M176 476 Q184 486 186 492 Q188 498 182 500 L156 498 Q152 494 156 488 L156 476Z" fill="url(#shadow-f)"/>

          <!-- Mains -->
          <path d="M74 232 Q68 242 66 248 Q64 254 70 256 L86 252 Q90 246 90 238 L90 228Z" fill="url(#shadow-f)"/>
          <path d="M226 232 Q232 242 234 248 Q236 254 230 256 L214 252 Q210 246 210 238 L210 228Z" fill="url(#shadow-f)"/>
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

// Default muscles shown when no data (full energy)
const defaultMuscles = ['CHEST', 'BACK', 'SHOULDERS', 'QUADS', 'GLUTES', 'ABS', 'BICEPS', 'TRICEPS']
const displayBars = computed(() => {
  if (props.muscleRecovery.length > 0) return props.muscleRecovery.slice(0, 8)
  return defaultMuscles.map(muscle => ({ muscle, score: 100, daysSince: 0, lastVolume: 0 }))
})

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
