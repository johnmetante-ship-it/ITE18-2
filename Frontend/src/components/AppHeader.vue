<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'

const auth = useAuthStore()
const store = useBookingStore()
const router = useRouter()

function signOut() {
  auth.logout()
  router.push('/welcome')
}
</script>

<template>
  <header class="w-full bg-white border-b border-slate-100">
    <div class="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
      <button
        type="button"
        class="flex items-center gap-2 text-left"
        @click="router.push(auth.isRegistered ? '/home' : '/welcome')"
        aria-label="Return to AgriSuroy home"
      >
        <span class="w-7 h-7 rounded-full bg-lime-400 text-blue-800 grid place-items-center font-extrabold">T</span>
        <span class="text-sm font-extrabold tracking-tight" style="color: #264ab3">TARPHA CORP.</span>
      </button>

      <div class="flex items-center rounded-full bg-slate-100 p-1" aria-label="Preview mode">
        <button
          type="button"
          class="rounded-full px-4 py-2 text-sm font-bold"
          :class="store.mode === 'desktop' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600'"
          :aria-pressed="store.mode === 'desktop'"
          @click="store.setMode('desktop')"
        >Web</button>
        <button
          type="button"
          class="rounded-full px-4 py-2 text-sm font-bold"
          :class="store.mode === 'mobile' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600'"
          :aria-pressed="store.mode === 'mobile'"
          @click="store.setMode('mobile')"
        >Mobile App</button>
      </div>

      <div v-if="store.mode === 'desktop'" class="flex items-center gap-3">
        <template v-if="auth.isRegistered">
          <span class="hidden md:inline text-sm font-bold text-slate-500">Hi, {{ auth.user.name.split(' ')[0] }}</span>
          <button type="button" class="text-sm font-bold text-blue-800 hover:underline" @click="router.push('/dashboard')">My trip ideas</button>
          <button type="button" class="text-sm font-bold text-slate-600 hover:underline" @click="signOut">Sign out</button>
        </template>
        <template v-else>
          <button type="button" class="text-sm font-bold text-blue-800 hover:underline" @click="router.push('/login')">Sign in</button>
          <button type="button" class="rounded-full px-4 py-2 text-sm font-extrabold" style="background: #264ab3; color: #fff" @click="router.push('/register')">Register</button>
        </template>
      </div>
    </div>
  </header>
</template>
