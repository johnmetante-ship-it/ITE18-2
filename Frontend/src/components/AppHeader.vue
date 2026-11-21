<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'

const auth = useAuthStore()
const store = useBookingStore()
const router = useRouter()
</script>

<template>
  <header class="w-full bg-white border-b border-slate-100">
    <div class="max-w-7xl mx-auto px-5 py-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
      <button
        type="button"
        class="flex items-center gap-2 text-left justify-self-start"
        @click="router.push(auth.isRegistered ? '/home' : '/welcome')"
        aria-label="Return to AgriSuroy home"
      >
        <span class="w-7 h-7 rounded-full bg-lime-400 text-blue-800 grid place-items-center font-extrabold">T</span>
        <span class="text-sm font-extrabold tracking-tight" style="color: #264ab3">TARPHA CORP.</span>
      </button>
    </div>
  </header>
</template>
