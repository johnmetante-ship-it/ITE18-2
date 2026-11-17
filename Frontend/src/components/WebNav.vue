<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

function signOut() {
  auth.logout()
  router.push('/welcome')
}
</script>

<template>
  <div class="flex items-center justify-between px-7 py-4 border-b border-slate-100">
    <button type="button" class="font-extrabold text-2xl text-blue-800" @click="router.push(auth.isRegistered ? '/home' : '/welcome')">
      AgriSuroy Booking
    </button>

    <nav v-if="auth.isRegistered" class="flex gap-5 text-sm font-bold text-slate-600" aria-label="Primary navigation">
      <button type="button" class="hover:text-blue-800" @click="router.push('/home')">Home</button>
      <button type="button" class="hover:text-blue-800" @click="router.push('/explore')">Explore</button>
      <button type="button" class="hover:text-blue-800" @click="router.push('/dashboard')">My trips</button>
      <button type="button" class="hover:text-blue-800" @click="router.push('/profile')">Profile</button>
    </nav>

    <nav v-else class="flex items-center gap-4 text-sm font-bold text-slate-600" aria-label="Guest navigation">
      <button type="button" class="hover:text-blue-800" @click="router.push('/login')">Sign in</button>
      <button type="button" class="rounded-full px-4 py-2 font-extrabold" style="background: #264ab3; color: #fff" @click="router.push('/register')">Register</button>
    </nav>
  </div>
</template>
