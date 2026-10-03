<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const isSidebarOpen = ref(false)
const isSidebarCollapsed = ref(false)
const isProfileOpen = ref(false)

const profile = ref<{
  display_name: string
  role: string
  faction: string | null
  position: string | null
} | null>(null)

const loadProfile = async () => {
  if (!user.value) {
    profile.value = null
    return
  }


  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, role, faction, position')
    .eq('id', user.value.sub)
    .single()

  if (error) {
    console.error('Failed to load profile:', error)
    profile.value = null
    return
  }

  profile.value = data
}

watch(
  user,
  async (currentUser) => {
    if (currentUser) {
      await loadProfile()
    } else {
      profile.value = null
    }
  },
  { immediate: true }
)

const displayName = computed(() => {
  return profile.value?.display_name ?? 'User'
})

const displayRole = computed(() => {
  if (!profile.value?.role) {
    return ''
  }

  return (
    profile.value.role.charAt(0) +
    profile.value.role.slice(1).toLowerCase()
  )
})

const displayFaction = computed(() => {
  if (!profile.value?.faction) {
    return ''
  }

  return profile.value.faction
    .split('_')
    .map((word) => {
      return word.charAt(0) + word.slice(1).toLowerCase()
    })
    .join(' & ')
})

const userInitial = computed(() => {
  return displayName.value.charAt(0).toUpperCase()
})
</script>

<template>
  <div class="min-h-screen bg-[#111315] text-white">

    <!-- =========================
         SIDEBAR
         ========================= -->
    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-64 flex-col
             border-r border-white/10 bg-[#17191c]
             transition-all duration-300
             lg:translate-x-0"
      :class="[
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
      ]"
    >

      <!-- Branding -->
      <div
        class="flex h-24 shrink-0 items-center transition-all duration-300"
        :class="
          isSidebarCollapsed
            ? 'justify-center px-3'
            : 'gap-3 px-6'
        "
      >
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center
                 rounded-xl border border-white/10 bg-white/5"
        >
          <span
            class="text-[8px] uppercase tracking-wider text-white/40"
          >
            Logo
          </span>
        </div>

        <div
          v-if="!isSidebarCollapsed"
          class="min-w-0"
        >
          <h1
            class="whitespace-nowrap text-sm font-semibold
                   tracking-[0.18em]"
          >
            MYTHSCRAFT
          </h1>

          <p
            class="mt-1 whitespace-nowrap text-[10px]
                   tracking-wider text-white/40"
          >
            Intelligent Productions
          </p>
        </div>
      </div>


      <!-- Desktop Sidebar Toggle -->
      <button
        type="button"
        class="absolute -right-3 top-20 hidden h-7 w-7
               items-center justify-center rounded-full
               border border-white/10 bg-[#222529]
               text-xs text-white/60 shadow-lg
               transition-all duration-200
               hover:border-white/20 hover:bg-[#2a2d31]
               hover:text-white
               lg:flex"
        :aria-label="
          isSidebarCollapsed
            ? 'Expand sidebar'
            : 'Collapse sidebar'
        "
        @click="isSidebarCollapsed = !isSidebarCollapsed"
      >
        {{ isSidebarCollapsed ? '›' : '‹' }}
      </button>


      <!-- Main Navigation -->
      <nav
        class="flex-1 transition-all duration-300"
        :class="isSidebarCollapsed ? 'px-3' : 'px-4'"
      >

        <!-- Workspace -->
        <div class="mb-2 min-h-5">
          <p
            v-if="!isSidebarCollapsed"
            class="px-3 text-[10px] font-semibold uppercase
                   tracking-[0.2em] text-white/30"
          >
            Workspace
          </p>
        </div>

        <div class="space-y-1">

          <!-- Dashboard -->
          <NuxtLink
            to="/dashboard"
            class="sidebar-link"
            :class="{ 'justify-center': isSidebarCollapsed }"
            :title="isSidebarCollapsed ? 'Dashboard' : undefined"
          >
            <span class="shrink-0">⌂</span>

            <span v-if="!isSidebarCollapsed">
              Dashboard
            </span>
          </NuxtLink>


          <!-- Events -->
          <NuxtLink
            to="/events"
            class="sidebar-link"
            :class="{ 'justify-center': isSidebarCollapsed }"
            :title="isSidebarCollapsed ? 'Events' : undefined"
          >
            <span class="shrink-0">◇</span>

            <span v-if="!isSidebarCollapsed">
              Events
            </span>
          </NuxtLink>


          <!-- Documents -->
          <NuxtLink
            to="/documents"
            class="sidebar-link"
            :class="{ 'justify-center': isSidebarCollapsed }"
            :title="isSidebarCollapsed ? 'Documents' : undefined"
          >
            <span class="shrink-0">▤</span>

            <span v-if="!isSidebarCollapsed">
              Documents
            </span>
          </NuxtLink>


          <!-- Search -->
          <NuxtLink
            to="/search"
            class="sidebar-link"
            :class="{ 'justify-center': isSidebarCollapsed }"
            :title="isSidebarCollapsed ? 'Search' : undefined"
          >
            <span class="shrink-0">⌕</span>

            <span v-if="!isSidebarCollapsed">
              Search
            </span>
          </NuxtLink>

        </div>


        <!-- Admin Navigation -->
        <div
          class="mt-8 border-t border-white/10 pt-6"
        >

          <div class="mb-2 min-h-5">
            <p
              v-if="!isSidebarCollapsed"
              class="px-3 text-[10px] font-semibold uppercase
                     tracking-[0.2em] text-white/30"
            >
              Admin
            </p>
          </div>

          <div class="space-y-1">

            <!-- Users -->
            <NuxtLink
              to="/admin/users"
              class="sidebar-link"
              :class="{ 'justify-center': isSidebarCollapsed }"
              :title="isSidebarCollapsed ? 'Users' : undefined"
            >
              <span class="shrink-0">♙</span>

              <span v-if="!isSidebarCollapsed">
                Users
              </span>
            </NuxtLink>


            <!-- System -->
            <NuxtLink
              to="/admin/system"
              class="sidebar-link"
              :class="{ 'justify-center': isSidebarCollapsed }"
              :title="isSidebarCollapsed ? 'System' : undefined"
            >
              <span class="shrink-0">⚙</span>

              <span v-if="!isSidebarCollapsed">
                System
              </span>
            </NuxtLink>


            <!-- Audit -->
            <NuxtLink
              to="/admin/audit"
              class="sidebar-link"
              :class="{ 'justify-center': isSidebarCollapsed }"
              :title="isSidebarCollapsed ? 'Audit' : undefined"
            >
              <span class="shrink-0">◎</span>

              <span v-if="!isSidebarCollapsed">
                Audit
              </span>
            </NuxtLink>


            <!-- Settings -->
            <NuxtLink
              to="/admin/settings"
              class="sidebar-link"
              :class="{ 'justify-center': isSidebarCollapsed }"
              :title="isSidebarCollapsed ? 'Settings' : undefined"
            >
              <span class="shrink-0">⚙</span>

              <span v-if="!isSidebarCollapsed">
                Settings
              </span>
            </NuxtLink>

          </div>
        </div>

      </nav>
    </aside>


    <!-- =========================
         MOBILE SIDEBAR OVERLAY
         ========================= -->
    <button
      v-if="isSidebarOpen"
      type="button"
      aria-label="Close sidebar"
      class="fixed inset-0 z-30 bg-black/60 lg:hidden"
      @click="isSidebarOpen = false"
    />


    <!-- =========================
         MAIN AREA
         ========================= -->
    <div
      class="min-h-screen transition-all duration-300"
      :class="
        isSidebarCollapsed
          ? 'lg:pl-20'
          : 'lg:pl-64'
      "
    >

      <!-- Mobile Menu Button -->
      <button
        type="button"
        class="fixed left-5 top-5 z-30 flex h-11 w-11
               items-center justify-center rounded-xl
               border border-white/10 bg-[#1b1e21]/90
               text-lg backdrop-blur-md
               lg:hidden"
        aria-label="Open sidebar"
        @click="isSidebarOpen = true"
      >
        ☰
      </button>


      <!-- =========================
           FLOATING PROFILE
           ========================= -->
      <div class="fixed right-6 top-6 z-30">

        <!-- Profile Button -->
        <button
          type="button"
          class="flex items-center gap-3 rounded-2xl
                 border border-white/10 bg-[#1b1e21]/90
                 px-3 py-2 shadow-xl shadow-black/20
                 backdrop-blur-xl transition
                 hover:border-white/20"
          @click="isProfileOpen = !isProfileOpen"
        >
          <div
            class="flex h-9 w-9 items-center justify-center
                   rounded-xl bg-white/10
                   text-sm font-semibold"
          >
            {{ userInitial }}
          </div>

          <div class="hidden text-left sm:block">
            <p class="text-xs font-medium">
              {{ displayName }}
            </p>

            <p class="text-[10px] text-white/40">
              {{ displayRole }}
            </p>
          </div>

          <span
            class="hidden text-xs text-white/40 sm:block"
          >
            ▾
          </span>
        </button>


        <!-- Profile Dropdown -->
        <div
          v-if="isProfileOpen"
          class="absolute right-0 mt-3 w-56 overflow-hidden
                 rounded-2xl border border-white/10
                 bg-[#1b1e21]/95 p-2
                 shadow-2xl shadow-black/30
                 backdrop-blur-xl"
        >

        <!-- Profile Information -->
          <div
            class="border-b border-white/10 px-3 py-3"
          >
            <p class="text-sm font-medium">
              {{ displayName }}
            </p>

            <p class="mt-1 text-xs text-white/40">
              {{ displayFaction }}
            </p>
          </div>


          <!-- Profile Actions -->
          <div class="py-2">
            <button class="profile-link">
              My Profile
            </button>

            <button class="profile-link">
              Account Settings
            </button>

            <button class="profile-link">
              Preferences
            </button>
          </div>


          <!-- Sign Out -->
          <div class="border-t border-white/10 pt-2">
            <button
              class="profile-link text-red-300
                     hover:bg-red-400/10"
            >
              Sign Out
            </button>
          </div>

        </div>
      </div>


      <!-- =========================
           PAGE CONTENT
           ========================= -->
      <main
        class="min-h-screen px-6 pb-10 pt-24
               sm:px-8
               lg:px-10 lg:pt-10"
      >
        <slot />
      </main>

    </div>
  </div>
</template>