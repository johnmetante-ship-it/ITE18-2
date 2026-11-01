<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../stores/booking'

const store = useBookingStore()
const router = useRouter()

const tab = ref('home')
const tabs = [
  { key: 'home', icon: 'house', label: 'Home' },
  { key: 'explore', icon: 'compass', label: 'Explore' },
  { key: 'bookings', icon: 'calendar-days', label: 'Bookings' },
  { key: 'profile', icon: 'circle-user-round', label: 'Profile' },
]

const featured = computed(() => store.destinations.slice(0, 3))

function openWebDetail(id) {
  store.setMode('desktop')
  router.push(`/detail/${id}`)
}

function goExplore() {
  store.setMode('desktop')
  router.push('/explore')
}

function reset() {
  store.reset()
  tab.value = 'home'
  store.toast('Demo reset')
}

onMounted(() => requestAnimationFrame(() => window.lucide?.createIcons?.()))
</script>

<template>
  <section class="mx-auto">
    <div class="phone">
      <div class="mobile-content">
        <div class="flex items-center justify-between p-5">
          <div>
            <p class="text-[10px] font-extrabold text-blue-800" style="color: #264ab3">TARPHA CORP.</p>
            <h2 class="text-lg font-extrabold text-blue-950">AgriSuroy</h2>
          </div>
          <button type="button" class="rounded-full bg-lime-200 p-2 text-blue-900" @click="router.push('/profile')" aria-label="Open profile">
            <i data-lucide="user" class="w-4 h-4"></i>
          </button>
        </div>

        <div v-show="tab === 'home'" class="px-5">
          <img loading="lazy" class="h-40 w-full rounded-3xl object-cover" src="https://images.pexels.com/photos/27138224/pexels-photo-27138224.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Rice field and mountain landscape">
          <p class="mt-4 font-['Fraunces'] text-2xl font-bold text-blue-950">Discover nature, one local story at a time.</p>
          <button class="mt-4 w-full rounded-xl py-3 font-extrabold" type="button" style="background: #264ab3; color: #fff" @click="goExplore">Explore destinations</button>
          <h3 class="mt-7 font-bold text-blue-950">Featured samples</h3>
          <div class="mt-3 space-y-3">
            <button v-for="d in featured" :key="d.id" class="w-full rounded-2xl border border-slate-100 p-3 text-left flex gap-3 shadow-sm" @click="openWebDetail(d.id)">
              <img :src="d.img" alt="" class="h-14 w-14 rounded-xl object-cover">
              <span>
                <b class="block text-sm text-blue-950">{{ d.name }}</b>
                <small class="text-slate-500">{{ d.category }} · Demo</small>
              </span>
            </button>
          </div>
        </div>

        <div v-show="tab === 'explore'" class="px-5">
          <h3 class="font-['Fraunces'] text-2xl font-bold text-blue-950">Explore Caraga</h3>
          <div class="mt-4 space-y-3">
            <button v-for="d in featured" :key="d.id" class="w-full rounded-2xl border border-slate-100 p-3 text-left flex gap-3 shadow-sm" @click="openWebDetail(d.id)">
              <img :src="d.img" alt="" class="h-14 w-14 rounded-xl object-cover">
              <span>
                <b class="block text-sm text-blue-950">{{ d.name }}</b>
                <small class="text-slate-500">{{ d.category }} · Demo</small>
              </span>
            </button>
          </div>
        </div>

        <div v-show="tab === 'bookings'" class="px-5">
          <h3 class="font-['Fraunces'] text-2xl font-bold text-blue-950">My bookings</h3>
          <div class="mt-4 rounded-2xl bg-lime-100 p-4 text-sm text-slate-700">
            {{ store.booked ? `${store.booked.destination} · ${store.booked.date} · ${store.booked.guests}` : 'No demo booking yet. Explore an experience to plan your trip.' }}
          </div>
          <button class="mt-4 w-full rounded-xl py-3 font-extrabold" type="button" style="background: #264ab3; color: #fff" @click="goExplore">Plan my trip</button>
        </div>

        <div v-show="tab === 'profile'" class="px-5">
          <h3 class="font-['Fraunces'] text-2xl font-bold text-blue-950">About AgriSuroy</h3>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">Relaxing farm stays, hands-on experiences, and cultural moments across Caraga. All listings in this prototype are demos.</p>
          <button class="mt-6 w-full rounded-xl py-3 font-extrabold" type="button" style="background: #a8dc2f; color: #18202a" @click="reset">Reset demo</button>
        </div>
      </div>

      <nav class="mobile-bottom" aria-label="Mobile app navigation">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="bottom-nav grid place-items-center gap-1 text-[10px] font-bold"
          :class="{ active: tab === t.key }"
          type="button"
          @click="tab = t.key"
        >
          <i :data-lucide="t.icon" class="w-5 h-5"></i>
          <span>{{ t.label }}</span>
        </button>
      </nav>
    </div>
  </section>
</template>
