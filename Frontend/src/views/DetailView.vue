<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from '../stores/booking'

const route = useRoute()
const router = useRouter()
const store = useBookingStore()

watch(
  () => route.params.id,
  (id) => {
    const exists = store.destinations.some((d) => d.id === id)
    if (!exists) {
      router.replace('/explore')
      return
    }
    store.openDetail(id)
  },
  { immediate: true }
)

const current = computed(() => store.current)
const saved = computed(() => store.isSaved(current.value.id))

function toggleSave() {
  const nowSaved = !saved.value
  store.toggleSave(current.value.id)
  store.toast(nowSaved ? 'Saved to your trip ideas' : 'Removed from saved destinations')
}
</script>

<template>
  <div>
    <div class="px-7 pt-7 md:px-14">
      <button type="button" class="inline-flex items-center gap-2 text-sm font-bold text-blue-800" @click="router.push('/explore')">
        <i data-lucide="arrow-left" class="w-4 h-4"></i>Back to explore
      </button>
    </div>

    <div class="px-7 py-6 md:px-14 md:grid md:grid-cols-2 md:gap-10">
      <div class="grid grid-cols-3 gap-2">
        <img loading="lazy" class="col-span-3 h-64 w-full rounded-3xl object-cover" :src="current.img" :alt="current.name">
        <img loading="lazy" class="h-24 w-full rounded-xl object-cover" :src="store.detailImages.second" alt="Green terraced rice fields">
        <img loading="lazy" class="col-span-2 h-24 w-full rounded-xl object-cover" :src="store.detailImages.third" alt="Filipino street vendors serving traditional food">
      </div>

      <div class="pt-7 md:pt-0">
        <p class="text-xs font-extrabold uppercase tracking-widest text-lime-700" style="color: #6f9d10">Sample destination ·</p>
        <h2 class="mt-2 font-['Fraunces'] text-3xl font-bold text-blue-950">{{ current.name }}</h2>
        <p class="mt-4 leading-relaxed text-slate-600">{{ current.overview }}</p>

        <div class="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div class="rounded-xl bg-slate-50 p-4">
            <p class="font-extrabold text-blue-900">Available activities</p>
            <p class="mt-1 text-slate-600">{{ current.activities }}</p>
          </div>
          <div class="rounded-xl bg-slate-50 p-4">
            <p class="font-extrabold text-blue-900">Includes</p>
            <p class="mt-1 text-slate-600">Sample guide, welcome snack, shared stories</p>
          </div>
        </div>

        <div class="mt-4 rounded-xl border border-lime-200 bg-lime-50 p-4">
          <p class="text-xs font-extrabold uppercase text-lime-700" style="color: #6f9d10">Host &amp; community</p>
          <p class="mt-1 text-sm text-slate-700">{{ current.host }}</p>
        </div>

        <div class="mt-6 flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-bold text-slate-500">Sample price</p>
            <p class="font-extrabold text-blue-900">{{ current.price }}</p>
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              class="rounded-xl border border-slate-200 p-3"
              :class="saved ? 'saved' : 'text-slate-600'"
              :aria-label="saved ? 'Remove saved destination' : 'Save destination'"
              @click="toggleSave"
            ><i data-lucide="heart" class="w-5 h-5"></i></button>
            <button type="button" class="rounded-xl px-5 py-3 font-extrabold" style="background: #264ab3; color: #fff" @click="router.push('/booking')">Book now</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
