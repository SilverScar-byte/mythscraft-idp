<script setup lang="ts">
import MonthCalendar from '~/components/events/MonthCalendar.vue'
import EventCard from '~/components/events/EventCard.vue'
import EventDetails from '~/components/events/EventDetails.vue'
import EventModal from '~/components/events/EventModal.vue'
import EventConfirmModal from '~/components/events/EventConfirmModal.vue'

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
  archived_at?: string | null
  previous_status?: 'PLANNING' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | null
}

const activeView = ref<'calendar' | 'table' | 'archived'>('calendar')
const showEventModal = ref(false)
const showArchiveModal = ref(false)
const isArchiving = ref(false)
const showRestoreModal = ref(false)
const isRestoring = ref(false)

const isRefreshing = ref(false)

async function refreshEvents() {
  isRefreshing.value = true

  await Promise.all([
    refresh(),
    refreshArchived()
  ])

  isRefreshing.value = false
}

const selectedEvent = ref<Event | null>(null)
const selectedArchivedEvent = ref<Event | null>(null)

function selectEvent(event: Event) {
  selectedEvent.value = event
}

function selectArchivedEvent(event: Event) {
  selectedArchivedEvent.value = event
}

function archiveEvent() {
  if (!selectedEvent.value) return

  showArchiveModal.value = true
}

async function confirmArchiveEvent() {
  if (!selectedEvent.value) return

  isArchiving.value = true

  const { error } = await supabase
    .from('events')
    .update({
      status: 'ARCHIVED',
      previous_status: selectedEvent.value.status,
      archived_at: new Date().toISOString()
    })
    .eq('id', selectedEvent.value.id)

  if (error) {
    console.error('Archive event error:', error)
    isArchiving.value = false
    return
  }

  isArchiving.value = false
  showArchiveModal.value = false
  selectedEvent.value = null

  await refresh()
}

function restoreEvent() {
  if (!selectedArchivedEvent.value) return
  showRestoreModal.value = true
}

async function confirmRestoreEvent() {
  if (!selectedArchivedEvent.value) return

  isRestoring.value = true

  const restoredStatus = selectedArchivedEvent.value.previous_status ?? 'PLANNING'

  const { error } = await supabase
    .from('events')
    .update({
      status: restoredStatus,
      previous_status: null,
      archived_at: null
    })
    .eq('id', selectedArchivedEvent.value.id)

  if (error) {
    console.error('Restore event error:', error)
    isRestoring.value = false
    return
  }

  isRestoring.value = false
  showRestoreModal.value = false
  selectedArchivedEvent.value = null

  await refresh()
  await refreshArchived()
  await refreshArchived()
}

const supabase = useSupabaseClient<any>()

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
        is_featured,
        archived_at,
        previous_status
      `)
      .neq('status', 'ARCHIVED')
      .order('start_date', { ascending: true })

    if (error) {
      throw error
    }

    return (data ?? []) as Event[]
  }
)

const {
  data: archivedEvents,
  error: archivedError,
  refresh: refreshArchived
} = await useAsyncData<Event[]>(
  'archived-events',
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
        is_featured,
        archived_at,
        previous_status
      `)
      .eq('status', 'ARCHIVED')
      .order('archived_at', { ascending: false })

    if (error) {
      throw error
    }

    return (data ?? []) as Event[]
  }
)

if (error.value) {
  console.error('Events error:', error.value)
}

if (archivedError.value) {
  console.error('Archived events error:', archivedError.value)
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
    <div class="mt-6 flex items-center gap-2">
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
          activeView === 'archived'
            ? 'bg-white/10 text-white'
            : 'text-white/40 hover:text-white'
        "
        @click="activeView = 'archived'"
      >
        Archived
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

              <div class="flex flex-col items-end gap-1">
                <button
                  class="rounded-xl border border-white/10 px-4 py-2
                        text-sm text-white/50 transition
                        hover:bg-white/[0.05] hover:text-white
                        disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="isRefreshing"
                  @click="refreshEvents"
                >
                  {{ isRefreshing ? 'Refreshing...' : '↻ Refresh' }}
                </button>

                <span class="text-xs text-white/35">
                  {{ archivedEvents?.length ?? 0 }} archived
                </span>
              </div>
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
        <div>
          <div class="mb-3 flex h-[42px] items-center justify-end">
            <button
              class="rounded-xl border border-white/10 px-4 py-2
                    text-sm text-white/50 transition
                    hover:bg-white/[0.05] hover:text-white
                    disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isRefreshing"
              @click="refreshEvents"
            >
              {{ isRefreshing ? 'Refreshing...' : '↻ Refresh' }}
            </button>
          </div>
          <EventDetails
            v-if="selectedEvent"
            :event="selectedEvent"
            @edit="showEventModal = true"
            @archive="archiveEvent"
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

      <p
        v-else-if="activeView === 'table'"
        class="text-sm text-white/40"
      >
        Event table will go here.
      </p>

      <div v-else>
        <div class="mb-4 flex items-start justify-between">
          <div>
            <h2 class="text-lg font-medium text-white">
              Archived Events
            </h2>

            <p class="mt-1 text-sm text-white/40">
              Events that are no longer active but remain preserved.
            </p>
          </div>

          <div class="flex flex-col items-center gap-1">
            <button
              class="rounded-xl border border-white/10 px-4 py-2
                    text-sm text-white/50 transition
                    hover:bg-white/[0.05] hover:text-white
                    disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isRefreshing"
              @click="refreshEvents"
            >
              {{ isRefreshing ? 'Refreshing...' : '↻ Refresh' }}
            </button>

            <span class="text-xs text-white/35">
              {{ archivedEvents?.length ?? 0 }} archived
            </span>
          </div>
        </div>

        <div
          class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]"
        >
          <!-- Archived Event List -->
          <div class="space-y-3">
            <EventCard
              v-for="event in archivedEvents"
              :key="event.id"
              :event="event"
              @select="selectArchivedEvent(event)"
            />
          </div>

          <!-- Archived Event Details -->
          <div>
            <EventDetails
              v-if="selectedArchivedEvent"
              :event="selectedArchivedEvent"
              @restore="restoreEvent"
            />

            <div
              v-else
              class="flex min-h-[250px] items-center justify-center
                    rounded-2xl border border-white/10 bg-white/[0.02]
                    p-8 text-center"
            >
              <p class="text-sm text-white/35">
                Select an archived event to view its details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EventModal
      :show="showEventModal"
      :event="selectedEvent"
      @close="showEventModal = false"
      @saved="refresh()"
    />

    <EventConfirmModal
      v-if="selectedEvent"
      :show="showArchiveModal"
      :title="`Archive ${selectedEvent.name}?`"
      message="This event will be removed from active event views, but its data and associated records will be preserved."
      confirm-text="Archive Event"
      loading-text="Archiving..."
      :loading="isArchiving"
      variant="danger"
      @close="showArchiveModal = false"
      @confirm="confirmArchiveEvent"
    />

    <EventConfirmModal
      v-if="selectedArchivedEvent"
      :show="showRestoreModal"
      :title="`Restore ${selectedArchivedEvent.name}?`"
      message="This event will be returned to active event views with its previous status."
      confirm-text="Restore Event"
      loading-text="Restoring..."
      :loading="isRestoring"
      variant="success"
      @close="showRestoreModal = false"
      @confirm="confirmRestoreEvent"
    />

  </section>
</template>