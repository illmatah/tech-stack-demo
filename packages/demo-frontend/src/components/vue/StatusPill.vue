<template>
  <div
    :class="[
      'bg-white border border-slate-200 flex gap-2 items-center px-4 py-2',
      'rounded-full shadow-sm text-slate-600 text-sm'
    ]"
  >
    <span class="h-2 rounded-full w-2" :class="dotClass" />
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'


  const props = defineProps<{
    label: string
    status?: 'online' | 'idle' | 'offline'
  }>()

  const dotClass = computed(() => {
    switch (props.status) {
      case 'online':
        return 'bg-emerald-500'
      case 'idle':
        return 'bg-amber-400'
      default:
        return 'bg-slate-300'
    }
  })
</script>
