<script setup lang="ts">
import { ref } from 'vue'

const showPassword = ref(false)
const rememberMe = ref(false)
</script>

<template>
  <main
    class="login-background relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-12"
  >

    <!-- Decorative Background Vectors -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">

      <!-- Left flowing shapes -->
      <svg
        class="vector-drift-left absolute -left-20 top-0 h-full w-[55%]"
        viewBox="0 0 800 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 80
            C180 160 120 310 330 390
            C510 460 420 610 620 690
            C420 760 300 880 160 1000
            L0 1000 Z"
          fill="#6f3449"
          opacity="0.38"
        />

        <path
          d="M0 260
            C160 330 190 450 380 500
            C500 535 530 620 460 720
            C330 850 160 860 0 920 Z"
          fill="#8a415d"
          opacity="0.18"
        />

        <path
          d="M0 620
            C180 540 310 590 360 720
            C410 850 250 920 180 1000
            L0 1000 Z"
          fill="#b56a7e"
          opacity="0.14"
        />
      </svg>


      <!-- Right flowing shapes -->
      <svg
        class="vector-drift-right absolute -right-20 top-0 h-full w-[55%]"
        viewBox="0 0 800 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M800 100
            C600 160 650 300 470 380
            C290 460 390 590 170 670
            C340 760 470 870 600 1000
            L800 1000 Z"
          fill="#879943"
          opacity="0.35"
        />

        <path
          d="M800 280
            C650 330 610 450 430 510
            C300 560 280 650 350 740
            C480 850 640 870 800 920 Z"
          fill="#a1b84d"
          opacity="0.18"
        />

        <path
          d="M800 650
            C620 560 490 600 440 730
            C390 850 550 930 620 1000
            L800 1000 Z"
          fill="#c1d56a"
          opacity="0.13"
        />
      </svg>

    </div>

    <!-- Geometric Accents -->
    <div class="absolute inset-0">

      <!-- Top-left large ring -->
      <div
        class="ring-float-one absolute -left-40 -top-52
                h-[520px] w-[520px] rounded-full
                border border-rose-200/25"
      ></div>

      <!-- Bottom-left ring -->
      <div
        class="ring-float-two absolute -bottom-60 -left-32
                h-[520px] w-[520px] rounded-full
                border border-rose-200/20"
      ></div>

      <!-- Bottom-right large ring -->
      <div
        class="ring-float-three absolute -bottom-64 -right-20
                h-[600px] w-[600px] rounded-full
                border border-lime-200/30"
      ></div>


      <!-- Left dot grid -->
      <div class="dots-breathe-left absolute left-[16%] top-[24%] grid grid-cols-4 gap-4 opacity-40">
        <template v-for="n in 16" :key="`left-dot-${n}`">
          <span class="h-1 w-1 rounded-full bg-rose-200"></span>
        </template>
      </div>

      <!-- Right dot grid -->
      <div class="dots-breathe-right absolute right-[7%] top-[18%] grid grid-cols-4 gap-4 opacity-40">
        <template v-for="n in 20" :key="`right-dot-${n}`">
          <span class="h-1 w-1 rounded-full bg-lime-200"></span>
        </template>
      </div>


      <!-- Decorative vertical lines -->
      <div
        class="absolute left-[8%] top-[8%]
              h-44 w-px bg-rose-200/30"
      ></div>

      <div
        class="absolute right-[8%] top-[28%]
              h-52 w-px bg-lime-200/35"
      ></div>


        <!-- Sparkles -->

        <!-- Sparkle 1: Upper-left -->
        <div
        class="sparkle-one absolute left-[8%] top-[19%]
                rotate-45 text-xl text-rose-200/70"
        >
        ✦
        </div>

        <!-- Sparkle 2: Lower-left -->
        <div
        class="sparkle-two absolute left-[24%] top-[67%]
                rotate-45 text-xl text-rose-200/50"
        >
        ✦
        </div>

        <!-- Sparkle 3: Upper-right -->
        <div
        class="sparkle-three absolute right-[9%] top-[21%]
                rotate-45 text-xl text-lime-200/70"
        >
        ✦
        </div>

    </div>

    <div class="relative z-10 w-full max-w-md">

      <!-- Branding -->
      <div class="mb-8 text-center">

        <!-- Logo Placeholder -->
        <div class="mx-auto mb-5 flex h-20 w-20 items-center justify-center">
          <div
            class="flex h-full w-full items-center justify-center
                  rounded-2xl border border-white/20
                  bg-white/5 backdrop-blur-md"
          >
            <span class="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
              Logo
            </span>
          </div>
        </div>

        <h1 class="text-2xl font-semibold tracking-[0.28em] text-white">
          MYTHSCRAFT
        </h1>

        <p class="mt-2 text-xs tracking-[0.22em] text-white/55">
          Intelligent Productions
        </p>
      </div>


      <!-- Login Card -->
      <form @submit.prevent>
        <div
          class="rounded-2xl border border-white/20
                bg-black/20 p-7
                shadow-2xl shadow-black/20
                backdrop-blur-xl"
        >
          <!-- Heading -->
          <div class="mb-7 text-center">
            <h2 class="text-xl font-semibold text-white">
              Welcome back
            </h2>

            <p class="mt-1 text-sm text-slate-400">
              Sign in to your account
            </p>
          </div>


          <!-- Email -->
          <div class="mb-5">
            <label
              for="email"
              class="mb-2 block text-sm font-medium text-white/70"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              class="w-full rounded-xl
                    border border-white/10
                    bg-white/[0.06]
                    px-4 py-3
                    text-sm font-medium
                    tracking-wide text-[#f2f0e8]
                    outline-none
                    placeholder:font-normal
                    placeholder:tracking-normal
                    placeholder:text-white/35
                    transition-all duration-300
                    hover:border-white/20
                    hover:bg-white/[0.08]
                    focus:border-[#a9bc58]/60
                    focus:bg-white/[0.09]
                    focus:shadow-[0_0_0_3px_rgba(169,188,88,0.08)]"
            >
          </div>


          <!-- Password -->
          <div>
            <label
              for="password"
              class="mb-2 block text-sm font-medium text-white/70"
            >
              Password
            </label>

            <div class="relative">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="w-full rounded-xl
                      border border-white/10
                      bg-white/[0.06]
                      px-4 py-3 pr-16
                      text-sm font-medium
                      tracking-wide text-[#f2f0e8]
                      outline-none
                      placeholder:font-normal
                      placeholder:tracking-normal
                      placeholder:text-white/35
                      transition-all duration-300
                      hover:border-white/20
                      hover:bg-white/[0.08]
                      focus:border-[#a9bc58]/60
                      focus:bg-white/[0.09]
                      focus:shadow-[0_0_0_3px_rgba(169,188,88,0.08)]"
              >

              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2
                      text-xs font-medium text-white/40
                      transition-colors duration-300
                      hover:text-[#c1d56a]"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>


          <!-- Remember / Forgot -->
          <div class="mt-5 flex items-center justify-between gap-4">

            <label
              class="flex cursor-pointer items-center gap-2 text-sm text-slate-400"
            >
              <input
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 accent-[#91a94b]"
              >

              Remember me
            </label>

            <button
              type="button"
              class="text-sm font-medium text-lime-300 hover:text-lime-200"
            >
              Forgot Password?
            </button>

          </div>
        </div>


        <!-- Separate Login Button -->
        <button
          type="submit"
          class="group relative mt-4 flex w-full items-center justify-center
                rounded-2xl border border-lime-100/50
                bg-gradient-to-r from-[#708238] via-[#91a94b] to-[#b4ca67]
                px-5 py-4
                text-sm font-semibold text-[#202516]
                shadow-lg shadow-black/20
                transition-all duration-300
                hover:brightness-110
                hover:shadow-xl hover:shadow-lime-900/20
                active:scale-[0.99]"
        >
          <span>Sign In</span>

          <span
            class="absolute right-7 text-lg
                  transition-transform duration-300
                  group-hover:translate-x-1"
          >
            →
          </span>
        </button>
      </form>


      <!-- Footer -->
      <p class="mt-8 text-center text-xs text-slate-600">
        © 2026 MythsCraft
      </p>

    </div>
  </main>
</template>