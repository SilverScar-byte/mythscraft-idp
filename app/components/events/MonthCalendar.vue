<script setup lang="ts">
type CalendarEvent = {
  id: string
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  status: 'PLANNING' | 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'
  venue: string | null
  event_type: string | null
  is_featured: boolean
}

const props = defineProps<{
  events: CalendarEvent[]
}>()

const emit = defineEmits<{
  selectEvent: [event: CalendarEvent]
}>()

const today = new Date()

const currentMonth = ref(
  new Date(today.getFullYear(), today.getMonth(), 1)
)

const selectedDate = ref<string | null>(null)

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthLabel = computed(() => {
  return currentMonth.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

type CalendarDay = {
  date: Date
  dayNumber: number
  dateKey: string
  isCurrentMonth: boolean
  isToday: boolean
}

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const calendarDays = computed<CalendarDay[]>(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const startOffset = firstDay.getDay()

  const gridStart = new Date(year, month, 1 - startOffset)

  const days: CalendarDay[] = []

  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + i)

    days.push({
      date,
      dayNumber: date.getDate(),
      dateKey: toDateKey(date),
      isCurrentMonth: date.getMonth() === month,
      isToday: toDateKey(date) === toDateKey(today)
    })
  }

  return days
})

function previousMonth() {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() - 1,
    1
  )
}

function nextMonth() {
  currentMonth.value = new Date(
    currentMonth.value.getFullYear(),
    currentMonth.value.getMonth() + 1,
    1
  )
}

function goToToday() {
  currentMonth.value = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  )

  selectedDate.value = toDateKey(today)
}

function selectDay(day: CalendarDay) {
  selectedDate.value = day.dateKey
}

function eventsForDay(dateKey: string) {
  return props.events.filter((event) => {
    if (!event.start_date) {
      return false
    }

    const start = event.start_date
    const end = event.end_date ?? event.start_date

    return dateKey >= start && dateKey <= end
  })
}

function eventClasses(event: CalendarEvent) {
  switch (event.priority) {
    case 'CRITICAL':
      return 'border-red-500/50 bg-red-500/25 text-red-50'

    case 'HIGH':
      return 'border-orange-400/50 bg-orange-500/20 text-orange-50'

    case 'LOW':
      return 'border-green-400/40 bg-green-500/20 text-green-50'

    default:
      return 'border-blue-400/40 bg-blue-500/20 text-blue-50'
  }
}
</script>

<template>
  <div>
    <!-- Calendar Controls -->
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <button
          class="flex h-10 w-10 items-center justify-center rounded-xl
                 border border-white/10 text-lg text-white/70
                 transition hover:bg-white/[0.06] hover:text-white"
          @click="previousMonth"
        >
          ‹
        </button>

        <div
          class="flex min-w-[150px] items-center justify-center rounded-xl
                 border border-white/10 bg-white/[0.02] px-4 py-2.5
                 text-sm font-medium text-white"
        >
          {{ monthLabel }}
        </div>

        <button
          class="flex h-10 w-10 items-center justify-center rounded-xl
                 border border-white/10 text-lg text-white/70
                 transition hover:bg-white/[0.06] hover:text-white"
          @click="nextMonth"
        >
          ›
        </button>

        <button
          class="ml-1 rounded-xl border border-white/10 px-4 py-2.5
                 text-sm text-white/80 transition
                 hover:bg-white/[0.06] hover:text-white"
          @click="goToToday"
        >
          Today
        </button>
      </div>
    </div>

    <!-- Calendar -->
    <div
      class="overflow-hidden rounded-xl border border-white/10
             bg-black/10"
    >
      <!-- Weekday Header -->
      <div class="grid grid-cols-7 border-b border-white/10">
        <div
          v-for="weekday in weekdays"
          :key="weekday"
          class="py-3 text-center text-xs font-medium text-white/55"
        >
          {{ weekday }}
        </div>
      </div>

      <!-- Days -->
      <div class="grid grid-cols-7">
        <div
          v-for="day in calendarDays"
          :key="day.dateKey"
          class="relative min-h-[100px] cursor-pointer border-b border-r
                border-white/[0.07] p-2 text-left
                transition hover:bg-white/[0.025]"
          :class="{
            'bg-amber-400/[0.04] ring-1 ring-inset ring-amber-300/80':
              selectedDate === day.dateKey
          }"
          @click="selectDay(day)"
        >
          <!-- Date Number -->
          <div
            class="mb-2 flex h-6 w-6 items-center justify-center
                   rounded-full text-xs"
            :class="[
              day.isCurrentMonth
                ? 'text-white/80'
                : 'text-white/25',

              day.isToday
                ? 'bg-amber-300 font-semibold text-black'
                : ''
            ]"
          >
            {{ day.dayNumber }}
          </div>

          <!-- Events -->
          <div class="space-y-1">
            <button
              v-for="event in eventsForDay(day.dateKey).slice(0, 2)"
              :key="event.id"
              type="button"
              class="block w-full truncate rounded-md border
                     px-2 py-1 text-left text-[11px]
                     transition hover:brightness-125"
              :class="eventClasses(event)"
              @click.stop="emit('selectEvent', event)"
            >
              <span v-if="event.is_featured" class="mr-1">
                ★
              </span>

              {{ event.name }}
            </button>

            <p
              v-if="eventsForDay(day.dateKey).length > 2"
              class="px-1 text-[10px] text-white/35"
            >
              +{{ eventsForDay(day.dateKey).length - 2 }} more
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>