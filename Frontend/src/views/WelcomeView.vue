<script setup>
import { useRouter } from 'vue-router'
import { useBookingStore } from '../stores/booking'

const store = useBookingStore()
const router = useRouter()
</script>

<template>
  <div>
    <section class="hero-arc relative overflow-hidden bg-blue-800 px-7 py-14 md:px-14 md:py-20" style="background: #264ab3">
      <img
        loading="lazy"
        class="hero-image absolute inset-0 w-full h-full object-cover opacity-75"
        src="https://images.pexels.com/photos/12029295/pexels-photo-12029295.jpeg?auto=compress&cs=tinysrgb&w=1600"
        alt="Misty green mountain landscape"
      >
      <div class="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/85 to-blue-800/15"></div>
      <div class="relative max-w-2xl text-white">
        <p class="inline-block rounded-full bg-lime-400 px-3 py-1 text-xs font-extrabold tracking-wider text-blue-950" style="background: #a8dc2f; color: #18202a">CARAGA AGRI-TOURISM ·</p>
        <h1 class="mt-5 font-['Fraunces'] font-bold leading-tight" style="font-size: 36px">A gentler way to discover Caraga.</h1>
        <p class="mt-4 max-w-xl text-lg text-blue-50" style="color: #eff6ff">Browse relaxing farm stays, hands-on experiences, and local culture across Caraga. Create a free account to save and book your trip.</p>

        <div class="mt-7 flex flex-wrap gap-3">
          <button type="button" class="rounded-xl px-6 py-3 font-extrabold" style="background: #a8dc2f; color: #18202a" @click="router.push('/register')">Create your free account</button>
          <button type="button" class="rounded-xl border border-white/70 px-6 py-3 font-extrabold text-white hover:bg-white/10" @click="router.push('/login')">Sign in</button>
        </div>
      </div>
    </section>

    <section class="px-7 py-10 md:px-14">
      <div class="flex items-end justify-between gap-5">
        <div>
          <p class="text-xs font-extrabold uppercase tracking-widest text-lime-700" style="color: #6f9d10">Browse as a guest</p>
          <h2 class="mt-2 font-['Fraunces'] font-bold text-blue-950" style="font-size: 24px">Sample experiences to explore</h2>
        </div>
        <button type="button" class="text-sm font-bold text-blue-800 hover:underline" @click="router.push('/register')">Register to plan a trip</button>
      </div>

      <div class="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <article v-for="d in store.destinations" :key="d.id" class="flex flex-col overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
          <img loading="lazy" class="h-40 w-full object-cover" :src="d.img" :alt="d.name">
          <div class="flex flex-1 flex-col p-5">
            <p class="text-xs font-extrabold uppercase text-lime-700" style="color: #6f9d10">{{ d.category }}</p>
            <h3 class="mt-1 font-bold text-lg text-blue-950">{{ d.name }}</h3>
            <p class="mt-2 text-sm text-slate-600">{{ d.overview }}</p>
            <div class="mt-auto pt-4 flex items-center justify-between gap-3">
              <span class="text-sm font-bold text-slate-500">{{ d.price }}</span>
              <button type="button" class="text-sm font-extrabold text-blue-800" @click="router.push('/register')">Register to view <span aria-hidden="true">→</span></button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="mx-7 mb-10 rounded-3xl bg-lime-100 p-7 text-center md:mx-14" style="background: #ecfccb">
      <h2 class="font-['Fraunces'] font-bold text-blue-950" style="font-size: 24px">Ready to plan your Caraga escape?</h2>
      <p class="mx-auto mt-3 max-w-xl text-slate-700" style="color: #334155">Registration is free and keeps your saved destinations and demo bookings in one place.</p>
      <button type="button" class="mt-5 rounded-xl px-6 py-3 font-extrabold" style="background: #264ab3; color: #fff" @click="router.push('/register')">Register now</button>
    </section>
  </div>
</template>
