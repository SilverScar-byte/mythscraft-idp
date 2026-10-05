<script setup lang="ts">
defineProps<{
  show: boolean
}>()

const emit = defineEmits<{
  close: []
  created: []
}>()

const form = reactive({
  name: '',
  description: '',
  event_type: '',
  status: 'PLANNING',
  priority: 'NORMAL',
  start_date: '',
  end_date: '',
  venue: '',
  is_featured: false,
  planning_started_at: ''
})

const supabase = useSupabaseClient<any>()
const user = useSupabaseUser()

const isCreating = ref(false)
const createError = ref('')

async function createEvent() {
  createError.value = ''

  if (!form.name.trim()) {
    createError.value = 'Event name is required.'
    return
  }

  if (!user.value) {
    createError.value = 'You must be logged in to create an event.'
    return
  }

  isCreating.value = true

  console.log('Frontend user:', user.value)

  const { error } = await supabase
    .from('events')
    .insert({
      name: form.name.trim(),
      description: form.description.trim() || null,
      event_type: form.event_type.trim() || null,
      status: form.status,
      priority: form.priority,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      venue: form.venue.trim() || null,
      is_featured: form.is_featured,
      planning_started_at: form.planning_started_at || null,
      created_by: user.value.sub
    })

  isCreating.value = false

  if (error) {
    console.error('Create event error:', error)
    createError.value = error.message
    return
  }

  emit('created')
  emit('close')
}
</script>

<template>
  <Transition
    appear
    enter-active-class="transition-opacity duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <!-- Backdrop -->
    <div
        v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center
             bg-black/70 p-4 backdrop-blur-sm"
      @click.self="emit('close')"
    >
    <!-- Modal -->
    <div
      class="max-h-[90vh] w-full max-w-2xl overflow-y-auto
             rounded-2xl border border-white/10
             bg-[#111111] p-6 shadow-2xl"
    >
      <!-- Header -->
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-xl font-semibold text-white">
            Create New Event
          </h2>

          <p class="mt-1 text-sm text-white/40">
            Add a new event to the MythsCraft workspace.
          </p>
        </div>

        <button
          class="flex h-9 w-9 items-center justify-center
                 rounded-lg text-xl text-white/40
                 transition hover:bg-white/[0.06]
                 hover:text-white"
          @click="emit('close')"
        >
          ×
        </button>
      </div>

      <div class="mt-6 space-y-7">

        <!-- Basic Information -->
        <section>
          <h3 class="mb-4 text-sm font-medium text-white/70">
            Basic Information
          </h3>

          <div class="space-y-4">
            <div>
              <label class="mb-2 block text-xs text-white/40">
                Event Name *
              </label>

              <input
                v-model="form.name"
                type="text"
                placeholder="Enter event name"
                class="w-full rounded-xl border border-white/10
                       bg-white/[0.04] px-4 py-3 text-sm text-white
                       outline-none placeholder:text-white/25
                       focus:border-amber-300/50"
              >
            </div>

            <div>
              <label class="mb-2 block text-xs text-white/40">
                Description
              </label>

              <textarea
                v-model="form.description"
                rows="3"
                placeholder="Describe the event..."
                class="w-full resize-none rounded-xl
                       border border-white/10 bg-white/[0.04]
                       px-4 py-3 text-sm text-white outline-none
                       placeholder:text-white/25
                       focus:border-amber-300/50"
              />
            </div>

            <div>
              <label class="mb-2 block text-xs text-white/40">
                Event Type
              </label>

              <input
                v-model="form.event_type"
                type="text"
                placeholder="e.g. Gathering, Competition, Production"
                class="w-full rounded-xl border border-white/10
                       bg-white/[0.04] px-4 py-3 text-sm text-white
                       outline-none placeholder:text-white/25
                       focus:border-amber-300/50"
              >
            </div>
          </div>
        </section>

        <!-- Schedule -->
        <section>
          <h3 class="mb-4 text-sm font-medium text-white/70">
            Schedule & Venue
          </h3>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-2 block text-xs text-white/40">
                Start Date
              </label>

              <input
                v-model="form.start_date"
                type="date"
                class="w-full rounded-xl border border-white/10
                       bg-white/[0.04] px-4 py-3 text-sm text-white
                       outline-none focus:border-amber-300/50"
              >
            </div>

            <div>
              <label class="mb-2 block text-xs text-white/40">
                End Date
              </label>

              <input
                v-model="form.end_date"
                type="date"
                class="w-full rounded-xl border border-white/10
                       bg-white/[0.04] px-4 py-3 text-sm text-white
                       outline-none focus:border-amber-300/50"
              >
            </div>
          </div>

          <div class="mt-4">
            <label class="mb-2 block text-xs text-white/40">
              Venue
            </label>

            <input
              v-model="form.venue"
              type="text"
              placeholder="Venue or TBD"
              class="w-full rounded-xl border border-white/10
                     bg-white/[0.04] px-4 py-3 text-sm text-white
                     outline-none placeholder:text-white/25
                     focus:border-amber-300/50"
            >
          </div>

          <div class="mt-4">
            <label class="mb-2 block text-xs text-white/40">
              Planning Start Date
            </label>

            <input
              v-model="form.planning_started_at"
              type="date"
              class="w-full rounded-xl border border-white/10
                     bg-white/[0.04] px-4 py-3 text-sm text-white
                     outline-none focus:border-amber-300/50"
            >
          </div>
        </section>

        <!-- Settings -->
        <section>
          <h3 class="mb-4 text-sm font-medium text-white/70">
            Event Settings
          </h3>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-2 block text-xs text-white/40">
                Status *
              </label>

              <select
                v-model="form.status"
                class="w-full rounded-xl border border-white/10
                       bg-[#171717] px-4 py-3 text-sm text-white
                       outline-none focus:border-amber-300/50"
              >
                <option value="PLANNING">Planning</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label class="mb-2 block text-xs text-white/40">
                Priority *
              </label>

              <select
                v-model="form.priority"
                class="w-full rounded-xl border border-white/10
                       bg-[#171717] px-4 py-3 text-sm text-white
                       outline-none focus:border-amber-300/50"
              >
                <option value="LOW">Low</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <label
            class="mt-4 flex cursor-pointer items-center
                   justify-between rounded-xl border border-white/10
                   bg-white/[0.02] p-4"
          >
            <div>
              <p class="text-sm text-white/80">
                Featured / Main Event
              </p>

              <p class="mt-1 text-xs text-white/35">
                Give this event prominent placement.
              </p>
            </div>

            <input
              v-model="form.is_featured"
              type="checkbox"
              class="h-4 w-4"
            >
          </label>
        </section>
      </div>

      <p
        v-if="createError"
        class="mt-4 text-sm text-red-400"
        >
        {{ createError }}
     </p>

      <!-- Actions -->
      <div
        class="mt-7 flex justify-end gap-3
               border-t border-white/10 pt-5"
      >
        <button
          class="rounded-xl border border-white/10
                 px-5 py-2.5 text-sm text-white/60
                 transition hover:bg-white/[0.05]
                 hover:text-white"
          @click="emit('close')"
        >
          Cancel
        </button>

        <button
            :disabled="isCreating"
            class="rounded-xl bg-amber-300 px-5 py-2.5
                    text-sm font-semibold text-black
                    transition hover:bg-amber-200
                    disabled:cursor-not-allowed disabled:opacity-50"
            @click="createEvent"
            >
            {{ isCreating ? 'Creating...' : 'Create Event' }}
        </button>
      </div>
    </div>
  </div>
  </Transition>
</template>