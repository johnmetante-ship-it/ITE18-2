<script setup>
import { useBookingStore } from '../stores/booking'

const store = useBookingStore()

function reset() {
  store.reset()
  store.toast('Demo reset')
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-7 py-12 text-center">
    <div class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blue-800 text-white">
      <i data-lucide="sprout" class="w-8 h-8"></i>
    </div>
    <h2 class="mt-5 font-['Fraunces'] font-bold text-blue-950" style="font-size: 24px">Travel rooted in community</h2>
    <p class="mt-3 leading-relaxed text-slate-600">AgriSuroy Booking is a visual, demo-safe prototype for discovering community-centered experiences throughout Caraga.</p>

    <div class="mt-7 rounded-2xl bg-slate-50 p-5 text-left">
      <p class="text-xs font-extrabold uppercase tracking-widest text-lime-700" style="color: #6f9d10">Connect with AgriSuroy</p>
      <p class="mt-2 font-bold text-blue-900" style="color: #264ab3">CARAGRISUROY@GMAIL.COM</p>
      <p class="mt-1 text-sm font-bold text-blue-800" style="color: #264ab3">WWW.AGRISUROY.COM</p>
    </div>

    <button type="button" class="mt-7 rounded-xl px-5 py-3 font-extrabold" style="background: #a8dc2f; color: #18202a" @click="reset">Reset demo</button>
  </div>
</template>
