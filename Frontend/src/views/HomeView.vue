<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../stores/booking'

const store = useBookingStore()
const router = useRouter()

const query = ref('')
const activity = ref('')
const date = ref('')

const featured = store.destinations.slice(0, 3)

function search() {
  store.searchQuery = query.value
  store.searchActivity = activity.value
  store.activeFilter = 'all'
  router.push('/explore')
}
</script>

<template>
  <div>
    <section class="hero-arc relative overflow-hidden bg-blue-800 px-7 py-12 md:px-14 md:py-16" style="background: #264ab3">
      <img
        loading="lazy"
        class="hero-image absolute inset-0 w-full h-full object-cover opacity-75"
        src="https://images.pexels.com/photos/12029295/pexels-photo-12029295.jpeg?auto=compress&cs=tinysrgb&w=1600"
        alt="Misty green mountain landscape"
      >
      <div class="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/85 to-blue-800/15"></div>
      <div class="relative max-w-2xl text-white">
        <p class="inline-block rounded-full bg-lime-400 px-3 py-1 text-xs font-extrabold tracking-wider text-blue-950" style="background: #a8dc2f; color: #18202a">CARAGA AGRI-TOURISM ·</p>
        <h1 class="mt-5 font-['Fraunces'] font-bold leading-tight" style="font-size: 32px">A gentler way to discover Caraga.</h1>
        <p class="mt-4 max-w-xl text-lg text-blue-50" style="color: #eff6ff">Discover Nature. Experience Culture.</p>

        <form class="mt-7 grid gap-3 rounded-2xl bg-white p-3 md:grid-cols-[1.3fr_1fr_1fr_auto]" @submit.prevent="search">
          <div>
            <label for="destination-search" class="sr-only">Search destination</label>
            <input id="destination-search" v-model="query" class="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-800" type="search" placeholder="Destination">
          </div>
          <div>
            <label for="activity-search" class="sr-only">Choose activity</label>
            <select id="activity-search" v-model="activity" class="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-800">
              <option value="">Any activity</option>
              <option>Farm Stay</option><option>Nature</option><option>Culture</option><option>Food</option><option>Adventure</option>
            </select>
          </div>
          <div>
            <label for="date-search" class="sr-only">Choose demo date</label>
            <input id="date-search" v-model="date" class="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-800" type="date">
          </div>
          <button class="rounded-xl px-5 py-3 font-extrabold" type="submit" style="background: #a8dc2f; color: #18202a">Explore destinations</button>
        </form>
      </div>
    </section>

    <section class="px-7 py-10 md:px-14">
      <div class="flex items-end justify-between gap-5">
        <div>
          <p class="text-xs font-extrabold uppercase tracking-widest text-lime-700" style="color: #6f9d10">Sample listings</p>
          <h2 class="mt-2 font-['Fraunces'] font-bold text-blue-950" style="font-size: 24px">Made for slow, meaningful travel</h2>
        </div>
        <button type="button" class="text-sm font-bold text-blue-800 hover:underline" @click="router.push('/explore')">See all experiences</button>
      </div>
      <div class="mt-6 grid gap-5 md:grid-cols-3">
        <article v-for="d in featured" :key="d.id" class="rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
          <img loading="lazy" class="h-40 w-full object-cover" :src="d.img" :alt="d.name">
          <div class="p-5">
            <p class="text-xs font-extrabold uppercase text-lime-700" style="color: #6f9d10">{{ d.category }}</p>
            <h3 class="mt-1 font-bold text-lg">{{ d.name }}</h3>
            <p class="mt-2 text-sm text-slate-600">{{ d.overview }}</p>
            <button type="button" class="mt-4 text-sm font-extrabold text-blue-800" @click="router.push(`/detail/${d.id}`)">View sample <span aria-hidden="true">→</span></button>
          </div>
        </article>
      </div>
    </section>

    <section class="mx-7 mb-10 grid gap-7 rounded-3xl bg-lime-100 p-7 md:mx-14 md:grid-cols-[.8fr_1.2fr]" style="background: #ecfccb">
      <div>
        <p class="text-xs font-extrabold uppercase tracking-widest text-blue-800" style="color: #264ab3">Our mission</p>
        <h2 class="mt-2 font-['Fraunces'] font-bold text-blue-950" style="font-size: 24px">Travel with a sense of place.</h2>
      </div>
      <p class="leading-relaxed text-slate-700" style="color: #334155">AgriSuroy connects travelers with relaxing farm stays, hands-on agricultural experiences, and local culture across Caraga—helping communities share what makes home special.</p>
    </section>
  </div>
</template>
