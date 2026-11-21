<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'

const auth = useAuthStore()
const store = useBookingStore()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const error = ref('')

function submit() {
  if (!form.email.trim() || !form.password) {
    error.value = 'Please enter your email address and password.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    error.value = 'Please enter a valid email address.'
    return
  }

  const result = auth.login({ email: form.email, password: form.password })
  if (!result.ok) {
    error.value = result.message
    return
  }

  error.value = ''
  store.toast('Welcome back!')
  router.push('/home')
}
</script>

<template>
  <div class="mx-auto max-w-5xl px-5 py-5 lg:h-[calc(100vh-110px)] lg:overflow-hidden lg:px-8">
    <button type="button" class="inline-flex items-center gap-2 text-sm font-bold text-blue-800" @click="router.push('/welcome')">
      <i data-lucide="arrow-left" class="w-5 h-5"></i>Back to browsing
    </button>

    <section class="mt-4 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm lg:grid lg:h-[calc(100%-44px)] lg:min-h-[420px] lg:grid-cols-[360px_minmax(0,1fr)]">
      <aside class="relative overflow-hidden bg-blue-800 p-7 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div class="grid h-14 w-14 place-items-center rounded-full bg-blue-950 text-white">
            <i data-lucide="user" class="w-7 h-7"></i>
          </div>
          <h1 class="mt-5 font-['Fraunces'] font-bold" style="font-size: 30px">Welcome back</h1>
          <p class="mt-3 max-w-xs text-sm leading-6 text-blue-100">Sign in to continue planning your next Caraga adventure.</p>
        </div>
        <p class="hidden text-xs font-bold uppercase tracking-widest text-blue-200 lg:block">Explore · Plan · Book</p>
      </aside>

      <div class="flex flex-col justify-center p-6 lg:p-10">
        <form class="space-y-4" @submit.prevent="submit">
          <div>
            <label class="mb-2 block text-sm font-bold" for="login-email">Email address</label>
            <input id="login-email" v-model="form.email" type="email" autocomplete="email" class="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="you@example.com">
          </div>
          <div>
            <label class="mb-2 block text-sm font-bold" for="login-password">Password</label>
            <input id="login-password" v-model="form.password" type="password" autocomplete="current-password" class="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Enter your password">
          </div>
          <p v-if="error" class="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{{ error }}</p>
          <button type="submit" class="w-full rounded-xl px-5 py-3 font-extrabold" style="background: #264ab3; color: #fff">Sign in</button>
        </form>

        <p class="mt-5 text-center text-sm text-slate-600">
          New to AgriSuroy?
          <button type="button" class="font-bold text-blue-800 hover:underline" @click="router.push('/register')">Create an account</button>
        </p>
      </div>
    </section>
  </div>
</template>
