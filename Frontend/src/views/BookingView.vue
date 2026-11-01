<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../stores/booking'

const store = useBookingStore()
const router = useRouter()

const form = reactive({ date: '', guests: '', activity: '', name: '', email: '' })
const error = ref('')

const summaryDate = () => form.date || 'Choose a demo date'
const summaryGuests = () => form.guests || 'Choose guests'

function submit() {
  if (!form.date || !form.guests || !form.activity || !form.name.trim() || !form.email.trim()) {
    error.value = 'Please complete each field to continue with this demo booking.'
    return
  }
  error.value = ''
  store.confirmBooking({
    date: form.date,
    guests: form.guests,
    activity: form.activity,
    name: form.name.trim(),
    destination: store.current.name,
  })
  router.push('/confirmation')
  store.toast('Booking prepared')
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-7 py-9">
    <button type="button" class="inline-flex items-center gap-2 text-sm font-bold text-blue-800" @click="router.push('/detail/' + store.current.id)">
      <i data-lucide="arrow-left" class="w-4 h-4"></i>Back to destination
    </button>
    <h2 class="mt-5 font-['Fraunces'] font-bold text-blue-950" style="font-size: 24px">Plan your demo escape</h2>
    <p class="mt-2 text-slate-600">This is a client-side booking prototype. Dates, availability, and prices are sample only.</p>

    <form class="mt-7 grid gap-6 md:grid-cols-[1.2fr_.8fr]" @submit.prevent="submit">
      <div class="space-y-4">
        <div>
          <label class="mb-2 block font-bold text-sm" for="booking-date">Preferred demo date</label>
          <input id="booking-date" v-model="form.date" type="date" class="w-full rounded-xl border border-slate-200 px-4 py-3">
        </div>
        <div>
          <label class="mb-2 block font-bold text-sm" for="guests">Guest count</label>
          <select id="guests" v-model="form.guests" class="w-full rounded-xl border border-slate-200 px-4 py-3">
            <option value="">Select guests</option>
            <option>1 guest</option><option>2 guests</option><option>3–4 guests</option><option>5+ guests</option>
          </select>
        </div>
        <div>
          <label class="mb-2 block font-bold text-sm" for="booking-activity">Preferred activity</label>
          <select id="booking-activity" v-model="form.activity" class="w-full rounded-xl border border-slate-200 px-4 py-3">
            <option value="">Select an activity</option>
            <option>Farm walk</option><option>Rice-field tour</option><option>Local food tasting</option><option>Viewpoint hike</option>
          </select>
        </div>
        <div>
          <label class="mb-2 block font-bold text-sm" for="guest-name">Your name</label>
          <input id="guest-name" v-model="form.name" type="text" class="w-full rounded-xl border border-slate-200 px-4 py-3">
        </div>
        <div>
          <label class="mb-2 block font-bold text-sm" for="guest-email">Email address</label>
          <input id="guest-email" v-model="form.email" type="email" class="w-full rounded-xl border border-slate-200 px-4 py-3">
        </div>
        <p v-if="error" class="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{{ error }}</p>
      </div>

      <aside class="h-fit rounded-2xl p-5" style="background: #eff6ff">
        <h3 class="font-bold text-blue-950">Booking summary</h3>
        <dl class="mt-4 space-y-3 text-sm text-slate-600">
          <div class="flex justify-between gap-4">
            <dt>Destination</dt>
            <dd class="font-bold text-right">{{ store.current.name }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt>Date</dt>
            <dd class="font-bold text-right">{{ summaryDate() }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt>Guests</dt>
            <dd class="font-bold text-right">{{ summaryGuests() }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt>Price</dt>
            <dd class="font-bold text-right">price on request</dd>
          </div>
        </dl>
        <button type="submit" class="mt-6 w-full rounded-xl px-5 py-3 font-extrabold" style="background: #264ab3; color: #fff">Confirm demo booking</button>
      </aside>
    </form>
  </div>
</template>
