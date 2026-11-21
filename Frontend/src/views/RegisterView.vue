<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'

const auth = useAuthStore()
const store = useBookingStore()
const router = useRouter()

const form = reactive({ name: '', email: '', password: '', phone: '', address: '', accountType: 'Personal' })
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
  auth.register({ name: form.name, email: form.email, phone: form.phone, address: form.address, accountType: form.accountType })
  store.toast(`Welcome to AgriSuroy, ${form.name.trim().split(' ')[0]}!`)
  router.push('/home')
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-5 py-5 lg:h-[calc(100vh-110px)] lg:overflow-hidden lg:px-8">
    <button type="button" class="inline-flex items-center gap-2 text-sm font-bold text-blue-800" @click="router.push('/welcome')">
      <i data-lucide="arrow-left" class="w-5 h-5"></i>Back to browsing
    </button>

    <section class="mt-4 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm lg:grid lg:h-[calc(100%-44px)] lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside class="relative overflow-hidden bg-blue-800 p-7 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <div class="grid h-14 w-14 place-items-center rounded-full bg-lime-300 text-blue-950">
            <i data-lucide="sprout" class="w-7 h-7"></i>
          </div>
          <h1 class="mt-5 font-['Fraunces'] font-bold" style="font-size: 30px">Create your free account</h1>
          <p class="mt-3 max-w-xs text-sm leading-6 text-blue-100">Save destinations and plan demo bookings across Caraga.</p>
        </div>
        <p class="hidden text-xs font-bold uppercase tracking-widest text-blue-200 lg:block">Discover · Experience · Connect</p>
      </aside>

      <div class="flex min-h-0 flex-col p-6 lg:p-7">
        <form class="grid min-h-0 gap-4 lg:grid-cols-2" @submit.prevent="submit">
          <div>
            <label class="mb-1.5 block text-sm font-bold" for="reg-name">Full name</label>
            <input id="reg-name" v-model="form.name" type="text" autocomplete="name" class="w-full rounded-xl border border-slate-200 px-4 py-2.5" placeholder="e.g. Maria Santos">
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-bold" for="reg-email">Email address</label>
            <input id="reg-email" v-model="form.email" type="email" autocomplete="email" class="w-full rounded-xl border border-slate-200 px-4 py-2.5" placeholder="you@example.com">
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-bold" for="reg-type">Account type</label>
            <select id="reg-type" v-model="form.accountType" class="w-full rounded-xl border border-slate-200 px-4 py-2.5">
              <option>Personal</option><option>Business / Corporation</option><option>Group / Organization</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-bold" for="reg-phone">Contact number</label>
            <input id="reg-phone" v-model="form.phone" type="tel" autocomplete="tel" class="w-full rounded-xl border border-slate-200 px-4 py-2.5" placeholder="+63 9XX XXX XXXX">
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-bold" for="reg-address">Address</label>
            <input id="reg-address" v-model="form.address" type="text" autocomplete="street-address" class="w-full rounded-xl border border-slate-200 px-4 py-2.5" placeholder="Barangay, City/Municipality, Province">
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-bold" for="reg-password">Password</label>
            <input id="reg-password" v-model="form.password" type="password" autocomplete="new-password" class="w-full rounded-xl border border-slate-200 px-4 py-2.5" placeholder="Demo password">
          </div>

          <div class="lg:col-span-2">
            <p v-if="error" class="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{{ error }}</p>
            <button type="submit" class="w-full rounded-xl px-5 py-3 font-extrabold" style="background: #264ab3; color: #fff">Create account</button>
          </div>
        </form>

        <p class="mt-5 text-center text-sm text-slate-600">
          Already have an account?
          <button type="button" class="font-bold text-blue-800 hover:underline" @click="router.push('/login')">Sign in</button>
        </p>
      </div>
    </section>
  </div>
</template>
