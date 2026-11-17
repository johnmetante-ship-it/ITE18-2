<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'
import { useMarketplaceStore } from '../stores/marketplace'

const auth = useAuthStore()
const store = useBookingStore()
const market = useMarketplaceStore()

const view = ref('home')
const tabs = [
  { key: 'home', icon: 'house', label: 'Home' },
  { key: 'explore', icon: 'compass', label: 'Explore' },
  { key: 'market', icon: 'store', label: 'Market' },
  { key: 'bookings', icon: 'calendar-days', label: 'Bookings' },
  { key: 'profile', icon: 'circle-user-round', label: 'Profile' },
]
const primary = ['home', 'explore', 'market', 'bookings', 'profile']
const isPrimary = computed(() => primary.includes(view.value))

const current = computed(() => store.current)
const all = computed(() => store.destinations)

const form = reactive({ date: '', guests: '', activity: '', name: '', email: '' })
const error = ref('')

// Guest-only mobile flow
const guestView = ref('landing')
const regForm = reactive({ name: '', email: '', password: '' })
const loginForm = reactive({ email: '' })
const authError = ref('')

// Marketplace
const marketForm = reactive({ name: '', category: 'Produce', price: '', stock: '', description: '' })
const marketError = ref('')

function refresh() {
  requestAnimationFrame(() => window.lucide?.createIcons?.())
}

function go(viewName) {
  view.value = viewName
}

function guestGo(viewName) {
  guestView.value = viewName
}

function buyNow(id) {
  if (market.buy(id)) store.toast('Purchased! This is a demo order.')
  else store.toast('That item is out of stock.')
}

function submitListing() {
  if (!marketForm.name.trim() || !marketForm.price || !marketForm.description.trim()) {
    marketError.value = 'Please provide a name, price, and description for your item.'
    return
  }
  marketError.value = ''
  market.listItem(marketForm)
  view.value = 'market'
  store.toast('Your item is now listed!')
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

function submitRegister() {
  if (!regForm.name.trim() || !regForm.email.trim() || !regForm.password) {
    authError.value = 'Please fill in your name, email, and a password to continue.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regForm.email.trim())) {
    authError.value = 'Please enter a valid email address.'
    return
  }
  authError.value = ''
  auth.register({ name: regForm.name, email: regForm.email })
  view.value = 'home'
  guestView.value = 'landing'
  store.toast(`Welcome to AgriSuroy, ${regForm.name.trim().split(' ')[0]}!`)
  refresh()
}

function submitLogin() {
  if (!loginForm.email.trim()) {
    authError.value = 'Please enter your email address to sign in.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email.trim())) {
    authError.value = 'Please enter a valid email address.'
    return
  }
  authError.value = ''
  auth.login({ email: loginForm.email })
  view.value = 'home'
  guestView.value = 'landing'
  store.toast('Welcome back!')
  refresh()
}

function signOut() {
  auth.logout()
  view.value = 'home'
  guestView.value = 'landing'
  store.toast('Signed out')
  refresh()
}

function reset() {
  store.reset()
  Object.assign(form, { date: '', guests: '', activity: '', name: '', email: '' })
  error.value = ''
  view.value = 'home'
  store.toast('Demo reset')
}

onMounted(refresh)
</script>

<template>
  <section class="mx-auto">
    <div class="phone">
      <div class="mobile-content">
        <!-- GUEST MOBILE EXPERIENCE -->
        <template v-if="!auth.isRegistered">
          <div class="flex items-center justify-between p-5">
            <div>
              <p class="text-[10px] font-extrabold text-blue-800" style="color: #264ab3">TARPHA CORP.</p>
              <h2 class="text-lg font-extrabold text-blue-950">AgriSuroy</h2>
            </div>
            <button type="button" class="rounded-full border border-slate-200 px-3 py-2 text-xs font-extrabold text-blue-800" @click="guestGo('login')">Sign in</button>
          </div>

          <div v-show="guestView === 'landing'" class="px-5">
            <img loading="lazy" class="h-40 w-full rounded-3xl object-cover" src="https://images.pexels.com/photos/27138224/pexels-photo-27138224.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Rice field and mountain landscape">
            <p class="mt-4 font-['Fraunces'] text-2xl font-bold text-blue-950">Discover nature, one local story at a time.</p>
            <p class="mt-2 text-sm text-slate-600">Browse Caraga experiences as a guest. Create a free account to save and book your trip.</p>
            <button class="mt-4 w-full rounded-xl py-3 font-extrabold" type="button" style="background: #264ab3; color: #fff" @click="guestGo('register')">Create free account</button>
            <button class="mt-3 w-full rounded-xl border border-blue-200 py-3 font-extrabold text-blue-800" type="button" @click="guestGo('browse')">Browse experiences</button>
            <button class="mt-3 w-full rounded-xl border border-blue-200 py-3 font-extrabold text-blue-800" type="button" @click="guestGo('market')">Browse marketplace</button>

            <h3 class="mt-7 font-bold text-blue-950">Featured samples</h3>
            <div class="mt-3 space-y-3">
              <button v-for="d in all.slice(0, 3)" :key="d.id" class="w-full rounded-2xl border border-slate-100 p-3 text-left flex gap-3 shadow-sm" @click="guestGo('register')">
                <img :src="d.img" alt="" class="h-14 w-14 rounded-xl object-cover">
                <span>
                  <b class="block text-sm text-blue-950">{{ d.name }}</b>
                  <small class="text-slate-500">{{ d.category }} · Register to view</small>
                </span>
              </button>
            </div>
          </div>

          <div v-show="guestView === 'browse'" class="px-5">
            <button type="button" class="inline-flex items-center gap-2 text-sm font-bold text-blue-800" @click="guestGo('landing')">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>Back
            </button>
            <h3 class="mt-3 font-['Fraunces'] text-2xl font-bold text-blue-950">Explore Caraga</h3>
            <p class="mt-2 text-sm text-slate-600">Browse sample experiences. Register to unlock full details and booking.</p>
            <div class="mt-4 space-y-3">
              <button v-for="d in all" :key="d.id" class="w-full rounded-2xl border border-slate-100 p-3 text-left flex gap-3 shadow-sm" @click="guestGo('register')">
                <img :src="d.img" alt="" class="h-14 w-14 rounded-xl object-cover">
                <span>
                  <b class="block text-sm text-blue-950">{{ d.name }}</b>
                  <small class="text-slate-500">{{ d.category }} · {{ d.overview }}</small>
                </span>
              </button>
            </div>
          </div>

          <div v-show="guestView === 'market'" class="px-5">
            <button type="button" class="inline-flex items-center gap-2 text-sm font-bold text-blue-800" @click="guestGo('landing')">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>Back
            </button>
            <h3 class="mt-3 font-['Fraunces'] text-2xl font-bold text-blue-950">Marketplace</h3>
            <p class="mt-2 text-sm text-slate-600">Browse Caraga farm &amp; craft goods. Register to purchase or list items.</p>
            <div class="mt-4 space-y-3">
              <div v-for="item in market.all" :key="item.id" class="rounded-2xl border border-slate-100 p-3 flex gap-3 shadow-sm">
                <img :src="item.img" alt="" class="h-14 w-14 rounded-xl object-cover">
                <span class="min-w-0 flex-1">
                  <b class="block text-sm text-blue-950">{{ item.name }}</b>
                  <small class="text-slate-500">{{ item.category }} · ₱{{ item.price }}</small>
                </span>
                <button type="button" class="shrink-0 rounded-lg px-3 py-2 text-xs font-extrabold" style="background: #a8dc2f; color: #18202a" @click="guestGo('register')">Register</button>
              </div>
            </div>
          </div>

          <div v-show="guestView === 'register'" class="px-5">
            <button type="button" class="inline-flex items-center gap-2 text-sm font-bold text-blue-800" @click="guestGo('landing')">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>Back
            </button>
            <h2 class="mt-3 font-['Fraunces'] text-2xl font-bold text-blue-950">Create your free account</h2>
            <p class="mt-2 text-sm text-slate-600">Save destinations and plan demo bookings across Caraga.</p>

            <form class="mt-5 space-y-4" @submit.prevent="submitRegister">
              <div>
                <label class="mb-2 block font-bold text-sm" for="m-reg-name">Full name</label>
                <input id="m-reg-name" v-model="regForm.name" type="text" class="w-full rounded-xl border border-slate-200 px-4 py-3">
              </div>
              <div>
                <label class="mb-2 block font-bold text-sm" for="m-reg-email">Email address</label>
                <input id="m-reg-email" v-model="regForm.email" type="email" class="w-full rounded-xl border border-slate-200 px-4 py-3">
              </div>
              <div>
                <label class="mb-2 block font-bold text-sm" for="m-reg-password">Password</label>
                <input id="m-reg-password" v-model="regForm.password" type="password" class="w-full rounded-xl border border-slate-200 px-4 py-3">
              </div>
              <p v-if="authError" class="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{{ authError }}</p>
              <button type="submit" class="w-full rounded-xl px-5 py-3 font-extrabold" style="background: #264ab3; color: #fff">Create account</button>
            </form>

            <p class="mt-5 text-center text-sm text-slate-600">
              Already have an account?
              <button type="button" class="font-bold text-blue-800" @click="guestGo('login')">Sign in</button>
            </p>
          </div>

          <div v-show="guestView === 'login'" class="px-5">
            <button type="button" class="inline-flex items-center gap-2 text-sm font-bold text-blue-800" @click="guestGo('landing')">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>Back
            </button>
            <h2 class="mt-3 font-['Fraunces'] text-2xl font-bold text-blue-950">Welcome back</h2>
            <p class="mt-2 text-sm text-slate-600">Sign in to continue planning your Caraga trip.</p>

            <form class="mt-5 space-y-4" @submit.prevent="submitLogin">
              <div>
                <label class="mb-2 block font-bold text-sm" for="m-login-email">Email address</label>
                <input id="m-login-email" v-model="loginForm.email" type="email" class="w-full rounded-xl border border-slate-200 px-4 py-3">
              </div>
              <p v-if="authError" class="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{{ authError }}</p>
              <button type="submit" class="w-full rounded-xl px-5 py-3 font-extrabold" style="background: #264ab3; color: #fff">Sign in</button>
            </form>

            <p class="mt-5 text-center text-sm text-slate-600">
              New to AgriSuroy?
              <button type="button" class="font-bold text-blue-800" @click="guestGo('register')">Create an account</button>
            </p>
          </div>
        </template>

        <!-- REGISTERED MOBILE EXPERIENCE -->
        <template v-else>
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

        <!-- MARKET -->
        <div v-show="view === 'market'" class="px-5">
          <div class="flex items-center justify-between gap-3">
            <h3 class="font-['Fraunces'] text-2xl font-bold text-blue-950">Marketplace</h3>
            <button type="button" class="rounded-full px-3 py-2 text-xs font-extrabold" style="background: #264ab3; color: #fff" @click="view = 'list'">List item</button>
          </div>
          <div class="mt-4 space-y-3">
            <div v-for="item in market.all" :key="item.id" class="rounded-2xl border border-slate-100 p-3 flex gap-3 shadow-sm">
              <img :src="item.img" alt="" class="h-14 w-14 rounded-xl object-cover">
              <span class="min-w-0 flex-1">
                <b class="block text-sm text-blue-950">{{ item.name }}</b>
                <small class="text-slate-500">{{ item.category }} · {{ item.seller }}</small>
                <small class="block text-xs font-bold text-blue-900">₱{{ item.price }} · {{ item.stock > 0 ? `${item.stock} left` : 'Sold out' }}</small>
              </span>
              <button type="button" class="shrink-0 rounded-lg px-3 py-2 text-xs font-extrabold" :disabled="item.stock <= 0" :class="item.stock > 0 ? '' : 'opacity-50'" style="background: #264ab3; color: #fff" @click="buyNow(item.id)">Buy</button>
            </div>
          </div>
        </div>

        <!-- LIST -->
        <div v-show="view === 'list'" class="px-5">
          <button type="button" class="inline-flex items-center gap-2 text-sm font-bold text-blue-800" @click="view = 'market'">
            <i data-lucide="arrow-left" class="w-4 h-4"></i>Back to marketplace
          </button>
          <h2 class="mt-3 font-['Fraunces'] text-2xl font-bold text-blue-950">List an item</h2>
          <form class="mt-4 space-y-3" @submit.prevent="submitListing">
            <div>
              <label class="mb-2 block font-bold text-sm" for="ml-name">Item name</label>
              <input id="ml-name" v-model="marketForm.name" type="text" class="w-full rounded-xl border border-slate-200 px-4 py-3">
            </div>
            <div>
              <label class="mb-2 block font-bold text-sm" for="ml-category">Category</label>
              <select id="ml-category" v-model="marketForm.category" class="w-full rounded-xl border border-slate-200 px-4 py-3">
                <option>Produce</option><option>Food</option><option>Crafts</option><option>Plants</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-2 block font-bold text-sm" for="ml-price">Price (₱)</label>
                <input id="ml-price" v-model="marketForm.price" type="number" min="1" class="w-full rounded-xl border border-slate-200 px-4 py-3">
              </div>
              <div>
                <label class="mb-2 block font-bold text-sm" for="ml-stock">Stock</label>
                <input id="ml-stock" v-model="marketForm.stock" type="number" min="1" class="w-full rounded-xl border border-slate-200 px-4 py-3">
              </div>
            </div>
            <div>
              <label class="mb-2 block font-bold text-sm" for="ml-desc">Description</label>
              <textarea id="ml-desc" v-model="marketForm.description" rows="3" class="w-full rounded-xl border border-slate-200 px-4 py-3"></textarea>
            </div>
            <p v-if="marketError" class="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{{ marketError }}</p>
            <button type="submit" class="w-full rounded-xl px-5 py-3 font-extrabold" style="background: #264ab3; color: #fff">Publish listing</button>
          </form>
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
          <h3 class="font-['Fraunces'] text-2xl font-bold text-blue-950">{{ auth.user.name }}</h3>
          <p class="mt-1 text-sm text-slate-500">{{ auth.user.email }}</p>
          <p class="mt-4 text-sm leading-relaxed text-slate-600">Relaxing farm stays, hands-on experiences, and cultural moments across Caraga. All listings in this prototype are demos.</p>
          <div class="mt-5 rounded-2xl bg-slate-50 p-4 text-left">
            <p class="text-xs font-extrabold uppercase tracking-widest text-lime-700" style="color: #6f9d10">Connect with AgriSuroy</p>
            <p class="mt-2 text-sm font-bold text-blue-900" style="color: #264ab3">CARAGRISUROY@GMAIL.COM</p>
            <p class="mt-1 text-sm font-bold text-blue-800" style="color: #264ab3">WWW.AGRISUROY.COM</p>
          </div>
          <button class="mt-6 w-full rounded-xl py-3 font-extrabold" type="button" style="background: #a8dc2f; color: #18202a" @click="reset">Reset demo</button>
          <button class="mt-3 w-full rounded-xl border border-slate-200 py-3 font-extrabold text-slate-600" type="button" @click="signOut">Sign out</button>
        </div>
        </template>
      </div>

      <nav v-show="isPrimary && auth.isRegistered" class="mobile-bottom" aria-label="Mobile app navigation">
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
