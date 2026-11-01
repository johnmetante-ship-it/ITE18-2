<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="flex items-center justify-between px-7 py-4 border-b border-slate-100">
    <button type="button" class="font-extrabold text-2xl text-blue-800" @click="router.push('/home')">
      AgriSuroy Booking
    </button>
    <nav class="flex gap-5 text-sm font-bold text-slate-600" aria-label="Primary navigation">
      <button type="button" class="hover:text-blue-800" @click="router.push('/home')">Home</button>
      <button type="button" class="hover:text-blue-800" @click="router.push('/explore')">Explore</button>
      <button type="button" class="hover:text-blue-800" @click="router.push('/dashboard')">My trips</button>
      <button type="button" class="hover:text-blue-800" @click="router.push('/profile')">Profile</button>
    </nav>
  </div>
</template>
