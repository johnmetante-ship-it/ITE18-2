<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const navItems = [
  { label: 'Home', path: '/home' },
  { label: 'Explore', path: '/explore' },
  { label: 'Marketplace', path: '/marketplace' },
  { label: 'My trips', path: '/dashboard' },
  { label: 'Profile', path: '/profile' },
]

function isActive(path) {
  if (path === '/home' || path === '/explore' || path === '/profile') {
    return route.path === path
  }
  return route.path.startsWith(path)
}

function signOut() {
  auth.logout()
  router.push('/welcome')
}
</script>

<template>
  <div class="flex items-center justify-between gap-5 px-7 py-4 border-b border-slate-100">
    <button type="button" class="shrink-0 font-extrabold text-2xl text-blue-800" @click="router.push(auth.isRegistered ? '/home' : '/welcome')">
      AgriSuroy Booking
    </button>

    <template v-if="auth.isRegistered">
      <nav class="flex flex-1 justify-center gap-2 text-sm font-bold" aria-label="Primary navigation">
        <button
          v-for="item in navItems"
          :key="item.path"
          type="button"
          class="rounded-full px-4 py-2 transition-colors"
          :class="isActive(item.path) ? 'text-white' : 'text-slate-600 hover:text-blue-800'"
          :style="isActive(item.path) ? 'background: #264ab3' : ''"
          @click="router.push(item.path)"
        >{{ item.label }}</button>
      </nav>

      <div class="flex shrink-0 items-center gap-3">
        <span class="hidden lg:inline text-sm font-bold text-slate-500">Hi, {{ auth.user.name.split(' ')[0] }}</span>
        <button type="button" class="text-sm font-bold text-slate-600 hover:underline" @click="signOut">Sign out</button>
      </div>
    </template>

    <template v-else>
      <div class="flex-1"></div>
      <nav class="flex shrink-0 items-center gap-4 text-sm font-bold text-slate-600" aria-label="Guest navigation">
        <button type="button" class="hover:text-blue-800" @click="router.push('/marketplace')">Marketplace</button>
        <button type="button" class="hover:text-blue-800" @click="router.push('/login')">Sign in</button>
        <button type="button" class="rounded-full px-4 py-2 font-extrabold" style="background: #264ab3; color: #fff" @click="router.push('/register')">Register</button>
      </nav>
    </template>
  </div>
</template>
