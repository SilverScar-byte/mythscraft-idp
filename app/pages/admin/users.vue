<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'admin'
})
</script>

<template>
  <div>
    <p class="text-xs uppercase tracking-[0.18em] text-white/40">
      Administration
    </p>

    <h1 class="mt-2 text-2xl font-semibold">
      User Management
    </h1>

    <p class="mt-2 text-sm text-white/40">
      Manage organization users, roles, positions, and factions.
    </p>
  </div>
</template>