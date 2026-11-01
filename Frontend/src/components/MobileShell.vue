<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useBookingStore } from '../stores/booking'

const store = useBookingStore()

const view = ref('home')
const tabs = [
  { key: 'home', icon: 'house', label: 'Home' },
  { key: 'explore', icon: 'compass', label: 'Explore' },
  { key: 'bookings', icon: 'calendar-days', label: 'Bookings' },
  { key: 'profile', icon: 'circle-user-round', label: 'Profile' },
]
const primary = ['home', 'explore', 'bookings', 'profile']
const isPrimary = computed(() => primary.includes(view.value))

const current = computed(() => store.current)
const all = computed(() => store.destinations)

const form = reactive({ date: '', guests: '', activity: '', name: '', email: '' })
const error = ref('')

function go(viewName) {
  view.value = viewName
}

function openDetail(id) {
  store.openDetail(id)
  view.value = 'detail'
}

function toggleSave() {
  const nowSaved = !store.isSaved(current.value.id)
  store.toggleSave(current.value.id)
  store.toast(nowSaved ? 'Saved to your trip ideas' : 'Removed from saved destinations')
}

function submitBooking() {
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
    destination: current.value.name,
  })
  view.value = 'confirmation'
  store.toast('Booking prepared')
}

function reset() {
  store.reset()
  Object.assign(form, { date: '', guests: '', activity: '', name: '', email: '' })
  error.value = ''
  view.value = 'home'
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
          <button type="button" class="rounded-full bg-lime-200 p-2 text-blue-900" @click="go('profile')" aria-label="Open profile">
            <i data-lucide="user" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- HOME -->
        <div v-show="view === 'home'" class="px-5">
          <img loading="lazy" class="h-40 w-full rounded-3xl object-cover" src="https://images.pexels.com/photos/27138224/pexels-photo-27138224.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Rice field and mountain landscape">
          <p class="mt-4 font-['Fraunces'] text-2xl font-bold text-blue-950">Discover nature, one local story at a time.</p>
          <button class="mt-4 w-full rounded-xl py-3 font-extrabold" type="button" style="background: #264ab3; color: #fff" @click="go('explore')">Explore destinations</button>
          <h3 class="mt-7 font-bold text-blue-950">Featured samples</h3>
          <div class="mt-3 space-y-3">
            <button v-for="d in all.slice(0, 3)" :key="d.id" class="w-full rounded-2xl border border-slate-100 p-3 text-left flex gap-3 shadow-sm" @click="openDetail(d.id)">
              <img :src="d.img" alt="" class="h-14 w-14 rounded-xl object-cover">
              <span>
                <b class="block text-sm text-blue-950">{{ d.name }}</b>
                <small class="text-slate-500">{{ d.category }} · Demo</small>
              </span>
            </button>
          </div>
        </div>

        <!-- EXPLORE -->
        <div v-show="view === 'explore'" class="px-5">
          <h3 class="font-['Fraunces'] text-2xl font-bold text-blue-950">Explore Caraga</h3>
          <div class="mt-4 space-y-3">
            <button v-for="d in all" :key="d.id" class="w-full rounded-2xl border border-slate-100 p-3 text-left flex gap-3 shadow-sm" @click="openDetail(d.id)">
              <img :src="d.img" alt="" class="h-14 w-14 rounded-xl object-cover">
              <span>
                <b class="block text-sm text-blue-950">{{ d.name }}</b>
                <small class="text-slate-500">{{ d.category }} · Demo</small>
              </span>
            </button>
          </div>
        </div>

        <!-- DETAIL -->
        <div v-show="view === 'detail'" class="px-5">
          <button type="button" class="inline-flex items-center gap-2 text-sm font-bold text-blue-800" @click="go('explore')">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>Back to explore
          </button>
          <img loading="lazy" class="mt-4 h-44 w-full rounded-3xl object-cover" :src="current.img" :alt="current.name">
          <p class="mt-4 text-xs font-extrabold uppercase tracking-widest text-lime-700" style="color: #6f9d10">Sample destination ·</p>
          <h2 class="mt-1 font-['Fraunces'] text-2xl font-bold text-blue-950">{{ current.name }}</h2>
          <p class="mt-2 text-sm leading-relaxed text-slate-600">{{ current.overview }}</p>

          <div class="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div class="rounded-xl bg-slate-50 p-3">
              <p class="font-extrabold text-blue-900">Activities</p>
              <p class="mt-1 text-slate-600">{{ current.activities }}</p>
            </div>
            <div class="rounded-xl bg-slate-50 p-3">
              <p class="font-extrabold text-blue-900">Includes</p>
              <p class="mt-1 text-slate-600">Guide, welcome snack, shared stories</p>
            </div>
          </div>

          <div class="mt-3 rounded-xl border border-lime-200 bg-lime-50 p-3">
            <p class="text-xs font-extrabold uppercase text-lime-700" style="color: #6f9d10">Host &amp; community</p>
            <p class="mt-1 text-sm text-slate-700">{{ current.host }}</p>
          </div>

          <div class="mt-4 flex items-center justify-between gap-3">
            <div>
              <p class="text-xs font-bold text-slate-500">Sample price</p>
              <p class="font-extrabold text-blue-900">{{ current.price }}</p>
            </div>
            <div class="flex gap-2">
              <button type="button" class="rounded-xl border border-slate-200 p-3" :class="store.isSaved(current.id) ? 'saved' : 'text-slate-600'" :aria-label="store.isSaved(current.id) ? 'Remove saved destination' : 'Save destination'" @click="toggleSave">
                <i data-lucide="heart" class="w-5 h-5"></i>
              </button>
              <button type="button" class="rounded-xl px-5 py-3 font-extrabold" style="background: #264ab3; color: #fff" @click="go('booking')">Book now</button>
            </div>
          </div>
        </div>

        <!-- BOOKING -->
        <div v-show="view === 'booking'" class="px-5">
          <button type="button" class="inline-flex items-center gap-2 text-sm font-bold text-blue-800" @click="go('detail')">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>Back to destination
          </button>
          <h2 class="mt-4 font-['Fraunces'] text-2xl font-bold text-blue-950">Plan your demo escape</h2>
          <p class="mt-2 text-sm text-slate-600">Client-side demo. Dates, availability, and prices are sample only.</p>

          <form class="mt-5 space-y-4" @submit.prevent="submitBooking">
            <div>
              <label class="mb-2 block font-bold text-sm" for="m-date">Preferred demo date</label>
              <input id="m-date" v-model="form.date" type="date" class="w-full rounded-xl border border-slate-200 px-4 py-3">
            </div>
            <div>
              <label class="mb-2 block font-bold text-sm" for="m-guests">Guest count</label>
              <select id="m-guests" v-model="form.guests" class="w-full rounded-xl border border-slate-200 px-4 py-3">
                <option value="">Select guests</option>
                <option>1 guest</option><option>2 guests</option><option>3–4 guests</option><option>5+ guests</option>
              </select>
            </div>
            <div>
              <label class="mb-2 block font-bold text-sm" for="m-activity">Preferred activity</label>
              <select id="m-activity" v-model="form.activity" class="w-full rounded-xl border border-slate-200 px-4 py-3">
                <option value="">Select an activity</option>
                <option>Farm walk</option><option>Rice-field tour</option><option>Local food tasting</option><option>Viewpoint hike</option>
              </select>
            </div>
            <div>
              <label class="mb-2 block font-bold text-sm" for="m-name">Your name</label>
              <input id="m-name" v-model="form.name" type="text" class="w-full rounded-xl border border-slate-200 px-4 py-3">
            </div>
            <div>
              <label class="mb-2 block font-bold text-sm" for="m-email">Email address</label>
              <input id="m-email" v-model="form.email" type="email" class="w-full rounded-xl border border-slate-200 px-4 py-3">
            </div>
            <p v-if="error" class="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{{ error }}</p>

            <aside class="rounded-2xl p-4" style="background: #eff6ff">
              <h3 class="font-bold text-blue-950">Booking summary</h3>
              <dl class="mt-3 space-y-2 text-sm text-slate-600">
                <div class="flex justify-between gap-4"><dt>Destination</dt><dd class="font-bold text-right">{{ current.name }}</dd></div>
                <div class="flex justify-between gap-4"><dt>Date</dt><dd class="font-bold text-right">{{ form.date || 'Choose a demo date' }}</dd></div>
                <div class="flex justify-between gap-4"><dt>Guests</dt><dd class="font-bold text-right">{{ form.guests || 'Choose guests' }}</dd></div>
                <div class="flex justify-between gap-4"><dt>Price</dt><dd class="font-bold text-right">price on request</dd></div>
              </dl>
              <button type="submit" class="mt-4 w-full rounded-xl px-5 py-3 font-extrabold" style="background: #264ab3; color: #fff">Confirm demo booking</button>
            </aside>
          </form>
        </div>

        <!-- CONFIRMATION -->
        <div v-show="view === 'confirmation'" class="px-5 py-8 text-center">
          <div class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-lime-200 text-blue-900">
            <i data-lucide="check" class="w-7 h-7"></i>
          </div>
          <h2 class="mt-4 font-['Fraunces'] text-2xl font-bold text-blue-950">Your demo trip is in the plan!</h2>
          <p class="mx-auto mt-3 text-sm leading-relaxed text-slate-600">Your sample booking has been prepared locally. No real reservation or payment was made.</p>
          <div class="mt-5 space-y-3">
            <button type="button" class="w-full rounded-xl px-5 py-3 font-extrabold" style="background: #264ab3; color: #fff" @click="go('bookings')">View my itinerary</button>
            <button type="button" class="w-full rounded-xl border border-blue-200 bg-white px-5 py-3 font-extrabold text-blue-800" @click="go('explore')">Keep exploring</button>
          </div>
        </div>

        <!-- BOOKINGS -->
        <div v-show="view === 'bookings'" class="px-5">
          <h3 class="font-['Fraunces'] text-2xl font-bold text-blue-950">My bookings</h3>
          <div class="mt-4 rounded-2xl bg-lime-100 p-4 text-sm text-slate-700">
            {{ store.booked ? `${store.booked.destination} · ${store.booked.date} · ${store.booked.guests}` : 'No demo booking yet. Explore an experience to plan your trip.' }}
          </div>
          <h4 class="mt-6 font-bold text-blue-950">Saved destinations</h4>
          <div v-if="store.savedList.length" class="mt-2 space-y-2 text-sm text-slate-600">
            <div v-for="d in store.savedList" :key="d.id" class="rounded-lg bg-white px-3 py-2">{{ d.name }}</div>
          </div>
          <div v-else class="mt-2 text-sm text-slate-600">No saved destinations yet. Tap the heart on any listing.</div>
          <button class="mt-4 w-full rounded-xl py-3 font-extrabold" type="button" style="background: #264ab3; color: #fff" @click="go('explore')">Plan my trip</button>
        </div>

        <!-- PROFILE -->
        <div v-show="view === 'profile'" class="px-5">
          <h3 class="font-['Fraunces'] text-2xl font-bold text-blue-950">About AgriSuroy</h3>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">Relaxing farm stays, hands-on experiences, and cultural moments across Caraga. All listings in this prototype are demos.</p>
          <div class="mt-5 rounded-2xl bg-slate-50 p-4 text-left">
            <p class="text-xs font-extrabold uppercase tracking-widest text-lime-700" style="color: #6f9d10">Connect with AgriSuroy</p>
            <p class="mt-2 text-sm font-bold text-blue-900" style="color: #264ab3">CARAGRISUROY@GMAIL.COM</p>
            <p class="mt-1 text-sm font-bold text-blue-800" style="color: #264ab3">WWW.AGRISUROY.COM</p>
          </div>
          <button class="mt-6 w-full rounded-xl py-3 font-extrabold" type="button" style="background: #a8dc2f; color: #18202a" @click="reset">Reset demo</button>
        </div>
      </div>

      <nav v-show="isPrimary" class="mobile-bottom" aria-label="Mobile app navigation">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="bottom-nav grid place-items-center gap-1 text-[10px] font-bold"
          :class="{ active: view === t.key }"
          type="button"
          @click="view = t.key"
        >
          <i :data-lucide="t.icon" class="w-5 h-5"></i>
          <span>{{ t.label }}</span>
        </button>
      </nav>
    </div>
  </section>
</template>
