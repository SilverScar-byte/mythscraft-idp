<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

type Profile = {
  display_name: string
  faction: string | null
  position: string | null
}

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { data: profile } = await useAsyncData<Profile | null>(
    'dashboard-profile',
    async () => {
        if (!user.value) {
            return null
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('display_name, faction, position')
            .eq('id', user.value.sub)
            .single()

        if (error) {
            throw error
        }

        return data as Profile
    }
)

const displayName = computed(() => {
    return profile.value?.display_name ?? 'User'
})

const displayFaction = computed(() => {
    if (!profile.value?.faction) {
        return ''
    }

    return profile.value.faction
        .split('_')
        .map((word: string) => {
            return word.charAt(0) + word.slice(1).toLowerCase()
        })
        .join(' & ')
})

const displayPosition = computed(() => {
  if (!profile.value?.position) {
    return ''
  }

  return profile.value.position
    .split('_')
    .map((word: string) => {
      return word.charAt(0) + word.slice(1).toLowerCase()
    })
    .join(' ')
})
</script>

<template>
    <section>
        <!-- Page Heading -->
        <div>
            <p class="text-sm text-white/40">
                {{ displayFaction }}
            </p>

            <p
              v-if="displayPosition"
              class="mt-1 text-xs text-white/30"
            >
              {{ displayPosition }}
            </p>

            <h1 class="mt-2 text-3xl font-semibold tracking-tight text-white">
                Good morning, {{ displayName }}.
            </h1>

            <p class="mt-2 max-w-xl text-sm leading-6 text-white/45">
                Welcome to your MythsCraft workspace.
            </p>
        </div>

        <!-- Dashboard Content -->

    </section>
</template>