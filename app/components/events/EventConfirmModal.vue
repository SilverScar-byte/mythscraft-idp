<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
  message: string
  confirmText: string
  loadingText: string
  loading: boolean
  variant: 'danger' | 'success'
}>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()
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
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center
             bg-black/70 p-4 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div
        class="w-full max-w-md rounded-2xl border border-white/10
               bg-[#111111] p-6 shadow-2xl"
      >
        <h2 class="text-xl font-semibold text-white">
          {{ title }}
        </h2>

        <p class="mt-3 text-sm leading-6 text-white/50">
          {{ message }}
        </p>

        <div class="mt-6 flex justify-end gap-3">
          <button
            class="rounded-xl border border-white/15 px-4 py-2.5
                   text-sm text-white/70 transition
                   hover:bg-white/[0.05] hover:text-white"
            @click="emit('close')"
          >
            Cancel
          </button>

          <button
            class="rounded-xl px-4 py-2.5
                  text-sm font-semibold text-white transition
                  disabled:cursor-not-allowed disabled:opacity-50"
            :class="
              variant === 'danger'
                ? 'bg-red-500 hover:bg-red-400'
                : 'bg-emerald-600 hover:bg-emerald-500'
            "
            :disabled="loading"
            @click="emit('confirm')"
            >
            {{ loading ? loadingText : confirmText }}
         </button>
        </div>
      </div>
    </div>
  </Transition>
</template>