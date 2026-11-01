<script setup>
import { useBookingStore } from '../stores/booking'

const store = useBookingStore()
</script>

<template>
  <div
    class="toast fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-3 text-sm font-bold text-white"
    :class="{ show: store.toastVisible }"
    role="status"
    aria-live="polite"
  >{{ store.toastMsg }}</div>
</template>
