<script setup lang="ts">
defineProps<{
  position: string | null
}>()
</script>

<template>
  <div
    class="rounded-2xl border border-white/10
           bg-white/[0.03] p-6"
  >
    <p class="text-xs uppercase tracking-wider text-white/40">
      Your Position
    </p>

    <p class="mt-2 text-lg font-medium text-white">
      {{ position || 'No position assigned' }}
    </p>
  </div>
</template>