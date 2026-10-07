<script setup lang="ts">
type Event = {
  id: string
  name: string
  description: string | null
  status: string
  start_date: string | null
  end_date: string | null
  priority: string
  venue: string | null
  event_type: string | null
  is_featured: boolean
}

defineProps<{
  event: Event
}>()

const emit = defineEmits<{
  edit: []
}>()

function formatDate(date: string | null) {
  if (!date) return 'TBD'

  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

function priorityClass(priority: string) {
  switch (priority) {
    case 'CRITICAL':
      return 'border-red-500/40 bg-red-500/15 text-red-200'
    case 'HIGH':
      return 'border-orange-500/40 bg-orange-500/15 text-orange-200'
    case 'LOW':
      return 'border-green-500/40 bg-green-500/15 text-green-200'
    default:
      return 'border-blue-500/40 bg-blue-500/15 text-blue-200'
  }
}
</script>

<template>
  <aside
    class="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
  >
    <span
      v-if="event.is_featured"
      class="inline-flex rounded-full bg-amber-300 px-3 py-1
             text-xs font-semibold text-black"
    >
      ★ MAIN EVENT
    </span>

    <h2 class="mt-4 text-2xl font-semibold text-white">
      {{ event.name }}
    </h2>

    <div class="mt-4 flex flex-wrap gap-2">
      <span
        class="rounded-full border border-white/10 bg-white/[0.06]
               px-3 py-1 text-xs text-white/80"
      >
        {{ event.status }}
      </span>

      <span
        class="rounded-full border px-3 py-1 text-xs"
        :class="priorityClass(event.priority)"
      >
        {{ event.priority }}
      </span>
    </div>

    <p
      v-if="event.description"
      class="mt-6 text-sm leading-6 text-white/55"
    >
      {{ event.description }}
    </p>

    <div class="mt-6 border-t border-white/10 pt-5">
      <dl class="space-y-4 text-sm">
        <div class="grid grid-cols-[110px_1fr]">
          <dt class="text-white/40">Date</dt>
          <dd class="text-white/80">
            {{ formatDate(event.start_date) }}
          </dd>
        </div>

        <div class="grid grid-cols-[110px_1fr]">
          <dt class="text-white/40">Venue</dt>
          <dd class="text-white/80">
            {{ event.venue ?? 'TBD' }}
          </dd>
        </div>

        <div class="grid grid-cols-[110px_1fr]">
          <dt class="text-white/40">Event Type</dt>
          <dd class="text-white/80">
            {{ event.event_type ?? 'TBD' }}
          </dd>
        </div>

        <div class="grid grid-cols-[110px_1fr]">
          <dt class="text-white/40">Status</dt>
          <dd class="text-white/80">
            {{ event.status }}
          </dd>
        </div>

        <div class="grid grid-cols-[110px_1fr]">
          <dt class="text-white/40">Priority</dt>
          <dd class="text-white/80">
            {{ event.priority }}
          </dd>
        </div>
      </dl>
    </div>

    <div class="mt-6 grid grid-cols-2 gap-3">
      <button
        class="rounded-xl bg-amber-300 px-4 py-3
               text-sm font-semibold text-black
               transition hover:bg-amber-200"
      >
        Open Workspace →
      </button>

      <button
        class="rounded-xl border border-white/15 px-4 py-3
              text-sm text-white/70 transition
              hover:bg-white/[0.05] hover:text-white"
        @click="emit('edit')"
      >
        Edit Event
      </button>
    </div>
  </aside>
</template>