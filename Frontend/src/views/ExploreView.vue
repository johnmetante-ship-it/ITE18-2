<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../stores/booking'

const store = useBookingStore()
const router = useRouter()

const filters = ['all', 'Farm Stay', 'Nature', 'Culture', 'Food', 'Adventure']

const list = computed(() => {
  const q = store.searchQuery.toLowerCase()
  const act = store.searchActivity
  return store.destinations.filter((d) =>
    (store.activeFilter === 'all' || d.category === store.activeFilter) &&
    (!q || (d.name + d.overview).toLowerCase().includes(q)) &&
    (!act || d.category === act || d.activities.includes(act))
  )
})
</script>

<template>
  <div class="px-7 py-9 md:px-14">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-extrabold uppercase tracking-widest text-lime-700" style="color: #6f9d10">Discover · Demo content</p>
        <h2 class="mt-2 font-['Fraunces'] font-bold text-blue-950" style="font-size: 24px">Choose your Caraga story</h2>
      </div>
      <button type="button" class="rounded-full border border-slate-200 p-2 text-blue-800" @click="router.push('/home')" aria-label="Back to home">
        <i data-lucide="arrow-left" class="w-5 h-5"></i>
      </button>
    </div>

    <div class="mt-6 flex flex-wrap gap-2" role="group" aria-label="Destination filters">
      <button
        v-for="f in filters"
        :key="f"
        class="chip rounded-full border px-4 py-2 text-sm font-bold"
        :class="{ active: store.activeFilter === f }"
        type="button"
        @click="store.activeFilter = f"
      >{{ f === 'all' ? 'All' : f }}</button>
    </div>

    <p class="mt-5 text-sm text-slate-500" aria-live="polite">
      {{ list.length ? `${list.length} sample destination${list.length === 1 ? '' : 's'} found` : '' }}
    </p>

    <div class="mt-4 grid gap-5 md:grid-cols-2">
      <article v-for="d in list" :key="d.id" class="rounded-2xl border border-slate-100 p-4 shadow-sm flex gap-4">
        <img :src="d.img" alt="" class="h-24 w-24 shrink-0 rounded-xl object-cover">
        <div class="min-w-0">
          <p class="text-xs font-extrabold uppercase text-lime-700">{{ d.category }}</p>
          <h3 class="mt-1 font-bold text-blue-950">{{ d.name }}</h3>
          <p class="mt-1 text-sm text-slate-600 line-clamp-2">{{ d.overview }}</p>
          <button type="button" class="mt-2 text-sm font-extrabold text-blue-800" @click="router.push(`/detail/${d.id}`)">View sample →</button>
        </div>
      </article>
    </div>

    <div v-if="!list.length" class="mt-5 rounded-2xl bg-slate-50 p-8 text-center">
      <p class="text-slate-600">No sample experiences match that search. Try another category or keyword.</p>
    </div>
  </div>
</template>
