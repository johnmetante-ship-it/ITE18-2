<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="px-7 py-16 text-center">
    <div class="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lime-200 text-blue-900">
      <i data-lucide="check" class="w-8 h-8"></i>
    </div>
    <h2 class="mt-5 font-['Fraunces'] font-bold text-blue-950" style="font-size: 24px">Your demo trip is in the plan!</h2>
    <p class="mx-auto mt-3 max-w-lg leading-relaxed text-slate-600">Your sample booking has been prepared locally for this prototype. No real reservation, payment, or availability request was made.</p>
    <div class="mt-7 flex justify-center gap-3">
      <button type="button" class="rounded-xl px-5 py-3 font-extrabold" style="background: #264ab3; color: #fff" @click="router.push('/dashboard')">View my itinerary</button>
      <button type="button" class="rounded-xl border border-blue-200 bg-white px-5 py-3 font-extrabold text-blue-800" @click="router.push('/explore')">Keep exploring</button>
    </div>
  </div>
</template>
