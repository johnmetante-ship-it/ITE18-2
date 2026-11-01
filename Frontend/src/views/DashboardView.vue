<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../stores/booking'

const store = useBookingStore()
const router = useRouter()

const upcoming = computed(() =>
  store.booked
    ? `${store.booked.destination} · ${store.booked.date} · ${store.booked.guests} · ${store.booked.activity} — Demo booking`
    : 'No upcoming demo bookings yet. Explore a destination to begin.'
)
</script>

<template>
  <div class="px-7 py-9 md:px-14">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-extrabold uppercase tracking-widest text-lime-700" style="color: #6f9d10">My trip space · Demo</p>
        <h2 class="mt-2 font-['Fraunces'] font-bold text-blue-950" style="font-size: 24px">Your Caraga itinerary</h2>
      </div>
      <button type="button" class="rounded-full border border-slate-200 p-2 text-blue-800" @click="router.push('/home')" aria-label="Back to home">
        <i data-lucide="arrow-left" class="w-5 h-5"></i>
      </button>
    </div>

    <div class="mt-7 grid gap-5 md:grid-cols-2">
      <section class="rounded-2xl p-6" style="background: #ecfccb">
        <h3 class="font-bold text-blue-950">Upcoming booking</h3>
        <div class="mt-4 rounded-xl bg-white p-4 text-sm text-slate-600">{{ upcoming }}</div>
      </section>
      <section class="rounded-2xl p-6" style="background: #eff6ff">
        <h3 class="font-bold text-blue-950">Saved destinations</h3>
        <div v-if="store.savedList.length" class="mt-4 space-y-2 text-sm text-slate-600">
          <div v-for="d in store.savedList" :key="d.id" class="rounded-lg bg-white px-3 py-2">{{ d.name }}</div>
        </div>
        <div v-else class="mt-4 text-sm text-slate-600">No saved destinations yet. Tap the heart on any sample listing.</div>
      </section>
    </div>

    <button type="button" class="mt-6 rounded-xl px-5 py-3 font-extrabold" style="background: #264ab3; color: #fff" @click="router.push('/explore')">Plan my trip</button>
  </div>
</template>
