<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'

const auth = useAuthStore()
const store = useBookingStore()
const router = useRouter()

const form = reactive({ name: '', email: '', password: '' })
const error = ref('')

function submit() {
  if (!form.name.trim() || !form.email.trim() || !form.password) {
    error.value = 'Please fill in your name, email, and a password to continue.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    error.value = 'Please enter a valid email address.'
    return
  }
  error.value = ''
  auth.register({ name: form.name, email: form.email })
  store.toast(`Welcome to AgriSuroy, ${form.name.trim().split(' ')[0]}!`)
  router.push('/home')
}
</script>

<template>
  <div class="max-w-md mx-auto px-7 py-12">
    <button type="button" class="inline-flex items-center gap-2 text-sm font-bold text-blue-800" @click="router.push('/welcome')">
      <i data-lucide="arrow-left" class="w-5 h-5"></i>Back to browsing
    </button>

    <div class="mt-6 rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
      <div class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-lime-200 text-blue-900">
        <i data-lucide="sprout" class="w-7 h-7"></i>
      </div>
      <h1 class="mt-4 text-center font-['Fraunces'] font-bold text-blue-950" style="font-size: 26px">Create your free account</h1>
      <p class="mt-2 text-center text-sm text-slate-600">Save destinations and plan demo bookings across Caraga.</p>

      <form class="mt-7 space-y-4" @submit.prevent="submit">
        <div>
          <label class="mb-2 block font-bold text-sm" for="reg-name">Full name</label>
          <input id="reg-name" v-model="form.name" type="text" autocomplete="name" class="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="e.g. Maria Santos">
        </div>
        <div>
          <label class="mb-2 block font-bold text-sm" for="reg-email">Email address</label>
          <input id="reg-email" v-model="form.email" type="email" autocomplete="email" class="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="you@example.com">
        </div>
        <div>
          <label class="mb-2 block font-bold text-sm" for="reg-password">Password</label>
          <input id="reg-password" v-model="form.password" type="password" autocomplete="new-password" class="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Demo password">
        </div>
        <p v-if="error" class="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{{ error }}</p>
        <button type="submit" class="w-full rounded-xl px-5 py-3 font-extrabold" style="background: #264ab3; color: #fff">Create account</button>
      </form>

      <p class="mt-5 text-center text-sm text-slate-600">
        Already have an account?
        <button type="button" class="font-bold text-blue-800 hover:underline" @click="router.push('/login')">Sign in</button>
      </p>
    </div>
  </div>
</template>
