<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'

const auth = useAuthStore()
const store = useBookingStore()
const router = useRouter()

const form = reactive({ email: '' })
const error = ref('')

function submit() {
  if (!form.email.trim()) {
    error.value = 'Please enter your email address to sign in.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    error.value = 'Please enter a valid email address.'
    return
  }
  error.value = ''
  auth.login({ email: form.email })
  store.toast('Welcome back!')
  router.push('/home')
}
</script>

<template>
  <div class="max-w-md mx-auto px-7 py-12">
    <button type="button" class="inline-flex items-center gap-2 text-sm font-bold text-blue-800" @click="router.push('/welcome')">
      <i data-lucide="arrow-left" class="w-5 h-5"></i>Back to browsing
    </button>

    <div class="mt-6 rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
      <div class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blue-800 text-white">
        <i data-lucide="user" class="w-7 h-7"></i>
      </div>
      <h1 class="mt-4 text-center font-['Fraunces'] font-bold text-blue-950" style="font-size: 26px">Welcome back</h1>
      <p class="mt-2 text-center text-sm text-slate-600">Sign in to continue planning your Caraga trip.</p>

      <form class="mt-7 space-y-4" @submit.prevent="submit">
        <div>
          <label class="mb-2 block font-bold text-sm" for="login-email">Email address</label>
          <input id="login-email" v-model="form.email" type="email" autocomplete="email" class="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="you@example.com">
        </div>
        <p v-if="error" class="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{{ error }}</p>
        <button type="submit" class="w-full rounded-xl px-5 py-3 font-extrabold" style="background: #264ab3; color: #fff">Sign in</button>
      </form>

      <p class="mt-5 text-center text-sm text-slate-600">
        New to AgriSuroy?
        <button type="button" class="font-bold text-blue-800 hover:underline" @click="router.push('/register')">Create an account</button>
      </p>
    </div>
  </div>
</template>
