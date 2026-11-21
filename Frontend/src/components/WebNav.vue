<script setup>
import { ref } from 'vue'
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

const signOutConfirmation = ref(false)

function signOut() {
  auth.logout()
  router.push('/welcome')
}

function confirmSignOut() {
  auth.logout()
  signOutConfirmation.value = false
  router.push('/welcome')
}
</script>

<template>
  <div class="flex items-center justify-between gap-5 px-7 py-4 border-b border-slate-100">
    <button type="button" class="shrink-0 text-left" @click="router.push(auth.isRegistered ? '/home' : '/welcome')">
      <span class="flex items-center gap-1.5 text-[10px] font-extrabold tracking-wide" style="color: #264ab3">
        <span class="grid h-5 w-5 place-items-center rounded-full bg-lime-400 text-[10px] text-blue-800">T</span>
        TARPHA CORP.
      </span>
      <span class="mt-1 block text-2xl font-extrabold text-blue-800">AgriSuroy Booking</span>
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
        <button type="button" class="text-sm font-bold text-slate-600 hover:underline" @click="signOutConfirmation = true">Sign out</button>
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

  <div v-if="signOutConfirmation" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-5" role="dialog" aria-modal="true" aria-labelledby="desktop-signout-title">
    <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
      <h3 id="desktop-signout-title" class="font-['Fraunces'] text-xl font-bold text-blue-950">Sign out of your account?</h3>
      <p class="mt-3 text-sm leading-relaxed text-slate-600">You can sign back in later with the same demo account details.</p>
      <div class="mt-6 flex justify-end gap-3">
        <button type="button" class="rounded-xl border border-slate-200 px-4 py-3 font-extrabold text-slate-600" @click="signOutConfirmation = false">Cancel</button>
        <button type="button" class="rounded-xl px-4 py-3 font-extrabold text-white" style="background: #264ab3" @click="confirmSignOut">Sign out</button>
      </div>
    </div>
  </div>
</template>
