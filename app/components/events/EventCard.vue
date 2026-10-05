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
  select: []
}>()

function priorityClass(priority: string) {
  switch (priority) {
    case 'CRITICAL':
      return 'bg-red-500/15 text-red-300'
    case 'HIGH':
      return 'bg-orange-500/15 text-orange-300'
    case 'LOW':
      return 'bg-green-500/15 text-green-300'
    default:
      return 'bg-blue-500/15 text-blue-300'
  }
}
</script>

<template>
  <button
    class="w-full rounded-xl border border-white/10 bg-white/[0.02]
           p-4 text-left transition
           hover:border-white/20 hover:bg-white/[0.04]"
    @click="emit('select')"
  >
    <div class="flex items-start justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h3 class="font-medium text-white">
            {{ event.name }}
          </h3>

          <span
            v-if="event.is_featured"
            class="text-xs text-amber-300"
          >
            ★ Main Event
          </span>
        </div>

        <p class="mt-1 text-xs text-white/40">
          {{ event.start_date ?? 'Date TBD' }}
        </p>
      </div>

      <div class="flex gap-2">
        <span
          class="rounded-md bg-white/[0.06] px-2 py-1
                 text-[10px] font-medium text-white/60"
        >
          {{ event.status }}
        </span>

        <span
          class="rounded-md px-2 py-1 text-[10px] font-medium"
          :class="priorityClass(event.priority)"
        >
          {{ event.priority }}
        </span>
      </div>
    </div>

    <p
      v-if="event.description"
      class="mt-3 line-clamp-2 text-sm leading-5 text-white/45"
    >
      {{ event.description }}
    </p>
  </button>
</template>