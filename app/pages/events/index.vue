<script setup lang="ts">
import MonthCalendar from '~/components/events/MonthCalendar.vue'
import EventCard from '~/components/events/EventCard.vue'
import EventDetails from '~/components/events/EventDetails.vue'
import EventModal from '~/components/events/EventModal.vue'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth'
})

type Event = {
  id: string
  name: string
  description: string | null
  status: 'PLANNING' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  start_date: string | null
  end_date: string | null
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'
  venue: string | null
  event_type: string | null
  is_featured: boolean
}

const activeView = ref<'calendar' | 'table'>('calendar')
const showEventModal = ref(false)

const selectedEvent = ref<Event | null>(null)

function selectEvent(event: Event) {
  selectedEvent.value = event
}

const supabase = useSupabaseClient()

const { data: events, error, refresh } = await useAsyncData<Event[]>(
  'events',
  async () => {
    const { data, error } = await supabase
      .from('events')
      .select(`
        id,
        name,
        description,
        status,
        start_date,
        end_date,
        priority,
        venue,
        event_type,
        is_featured
      `)
      .order('start_date', { ascending: true })

    if (error) {
      throw error
    }

    return (data ?? []) as Event[]
  }
)

if (error.value) {
  console.error('Events error:', error.value)
}
</script>

<template>
  <section>
    <!-- Header -->
    <div class="relative">
      <div>
        <h1 class="text-3xl font-semibold tracking-tight text-white">
          Events
        </h1>

        <p class="mt-2 text-sm text-white/45">
          Plan, organize, and manage all MythsCraft events.
        </p>
      </div>

      <button
        class="absolute right-0 top-14 rounded-xl border border-white/10
              bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white
              transition hover:bg-white/[0.1]"
        @click="showEventModal = true"
      >
        + New Event
      </button>
    </div>

    <!-- View Switcher -->
    <div class="mt-6 flex gap-2">
      <button
        class="rounded-xl px-5 py-2.5 text-sm transition"
        :class="
          activeView === 'calendar'
            ? 'bg-white/10 text-white'
            : 'text-white/40 hover:text-white'
        "
        @click="activeView = 'calendar'"
      >
        Calendar
      </button>

      <button
        class="rounded-xl px-5 py-2.5 text-sm transition"
        :class="
          activeView === 'table'
            ? 'bg-white/10 text-white'
            : 'text-white/40 hover:text-white'
        "
        @click="activeView = 'table'"
      >
        Table
      </button>
    </div>

    <!-- Temporary View -->
    <div
      class="mt-5 min-h-[400px] rounded-2xl border border-white/10
             bg-white/[0.02] p-8"
    >
      <div
        v-if="activeView === 'calendar'"
        class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]"
      >
        <!-- Left Side -->
        <div class="min-w-0">
          <MonthCalendar
            :events="events ?? []"
            @select-event="selectEvent"
          />

          <!-- Event List -->
          <div class="mt-8">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-lg font-medium text-white">
                Events
              </h2>

              <span class="text-xs text-white/35">
                {{ events?.length ?? 0 }} events
              </span>
            </div>

            <div class="space-y-3">
              <EventCard
                v-for="event in events ?? []"
                :key="event.id"
                :event="event"
                @select="selectEvent(event)"
              />

              <p
                v-if="!events?.length"
                class="py-8 text-center text-sm text-white/35"
              >
                No events yet.
              </p>
            </div>
          </div>
        </div>

        <!-- Right Side -->
        <div class="mt-[55px]">
          <EventDetails
            v-if="selectedEvent"
            :event="selectedEvent"
          />

          <div
            v-else
            class="flex min-h-[300px] items-center justify-center
                  rounded-2xl border border-white/10 bg-white/[0.02]
                  p-8 text-center"
          >
            <p class="text-sm text-white/35">
              Select an event to view its details.
            </p>
          </div>
        </div>
      </div>

      <p v-else class="text-sm text-white/40">
        Event table will go here.
      </p>
    </div>

    <EventModal
      :show="showEventModal"
      @close="showEventModal = false"
      @created="refresh"
    />

  </section>
</template>