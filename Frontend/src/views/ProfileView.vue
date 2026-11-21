<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'
import { useMarketplaceStore } from '../stores/marketplace'

const auth = useAuthStore()
const store = useBookingStore()
const market = useMarketplaceStore()
const router = useRouter()

const editing = ref(false)
const deleteConfirmation = ref(false)
const form = reactive({ name: '', email: '', phone: '', address: '', accountType: 'Personal', avatar: '' })
const error = ref('')

const initials = computed(() =>
  (auth.user?.name || '?')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
)

const memberSince = computed(() => {
  if (!auth.user?.registeredAt) return ''
  return new Date(auth.user.registeredAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
})

function startEdit() {
  form.name = auth.user?.name || ''
  form.email = auth.user?.email || ''
  form.phone = auth.user?.phone || ''
  form.address = auth.user?.address || ''
  form.accountType = auth.user?.accountType || 'Personal'
  form.avatar = auth.user?.avatar || ''
  error.value = ''
  editing.value = true
}

function cancelEdit() {
  editing.value = false
  error.value = ''
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    form.avatar = reader.result
  }
  reader.readAsDataURL(file)
}

function save() {
  if (!form.name.trim() || !form.email.trim()) {
    error.value = 'Name and email are required.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    error.value = 'Please enter a valid email address.'
    return
  }
  error.value = ''
  auth.updateProfile({ ...form, avatar: form.avatar || auth.user?.avatar || '' })
  editing.value = false
  store.toast('Profile updated')
}

function reset() {
  store.reset()
  store.toast('Demo reset')
}

function unlist(id) {
  if (market.unlistItem(id)) store.toast('Item unlisted')
}

function deleteAccount() {
  market.clearMarketplaceData()
  store.reset()
  auth.deleteAccount()
  deleteConfirmation.value = false
  router.replace('/welcome')
}
</script>

<template>
  <div class="mx-auto h-[calc(100vh-110px)] max-w-[1600px] overflow-hidden px-8 pb-4 pt-5">
    <div class="mb-4 flex items-end justify-between">
      <div>
        <p class="text-xs font-extrabold uppercase tracking-widest text-lime-700" style="color: #6f9d10">My profile · Demo</p>
        <h2 class="mt-1 font-['Fraunces'] font-bold text-blue-950" style="font-size: 28px">Account details</h2>
      </div>
    </div>

    <div class="grid h-[calc(100%-52px)] items-stretch gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside>
        <section class="h-full rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
          <div class="flex items-center gap-4">
            <img v-if="auth.user?.avatar" :src="auth.user.avatar" class="h-16 w-16 shrink-0 rounded-full object-cover" alt="Profile photo">
            <div v-else class="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-blue-800 text-xl font-extrabold text-white">{{ initials }}</div>
            <div class="min-w-0">
              <h3 class="font-['Fraunces'] text-xl font-bold text-blue-950 break-words">{{ auth.user?.name }}</h3>
              <span class="mt-2 inline-block rounded-full px-3 py-1 text-xs font-extrabold" style="background: #ecfccb; color: #264ab3">{{ auth.user?.accountType || 'Personal' }}</span>
            </div>
          </div>

          <form v-if="editing" class="mt-6 space-y-3" @submit.prevent="save">
            <div class="flex items-center gap-3">
              <img v-if="form.avatar" :src="form.avatar" class="h-14 w-14 rounded-full object-cover" alt="Avatar preview">
              <div v-else class="grid h-14 w-14 place-items-center rounded-full bg-blue-800 text-lg font-extrabold text-white">{{ initials }}</div>
              <label class="cursor-pointer">
                <span class="inline-block rounded-xl px-3 py-2 text-sm font-extrabold" style="background: #ecfccb; color: #264ab3">Choose photo</span>
                <input type="file" accept="image/*" class="hidden" @change="onFileChange">
              </label>
            </div>

            <div>
              <label class="mb-1 block text-sm font-bold" for="pf-name">Name</label>
              <input id="pf-name" v-model="form.name" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2.5">
            </div>
            <div>
              <label class="mb-1 block text-sm font-bold" for="pf-type">Account type</label>
              <select id="pf-type" v-model="form.accountType" class="w-full rounded-xl border border-slate-200 px-3 py-2.5">
                <option>Personal</option><option>Business / Corporation</option><option>Group / Organization</option>
              </select>
            </div>
            <div>
              <label class="mb-1 block text-sm font-bold" for="pf-email">Email address</label>
              <input id="pf-email" v-model="form.email" type="email" class="w-full rounded-xl border border-slate-200 px-3 py-2.5">
            </div>
            <div>
              <label class="mb-1 block text-sm font-bold" for="pf-phone">Contact number</label>
              <input id="pf-phone" v-model="form.phone" type="tel" class="w-full rounded-xl border border-slate-200 px-3 py-2.5">
            </div>
            <div>
              <label class="mb-1 block text-sm font-bold" for="pf-address">Address</label>
              <input id="pf-address" v-model="form.address" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2.5">
            </div>

            <p v-if="error" class="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{{ error }}</p>
            <div class="flex gap-2 pt-1">
              <button type="submit" class="rounded-xl px-4 py-2.5 text-sm font-extrabold" style="background: #264ab3; color: #fff">Save</button>
              <button type="button" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-extrabold text-slate-600" @click="cancelEdit">Cancel</button>
            </div>
          </form>

          <dl v-else class="mt-4 grid grid-cols-2 gap-2">
            <div class="rounded-xl bg-slate-50 p-3">
              <dt class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Email address</dt>
              <dd class="mt-1 text-sm font-bold text-blue-950 break-words">{{ auth.user?.email || 'Not provided' }}</dd>
            </div>
            <div class="rounded-xl bg-slate-50 p-3">
              <dt class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Contact number</dt>
              <dd class="mt-1 text-sm font-bold text-blue-950">{{ auth.user?.phone || 'Not provided' }}</dd>
            </div>
            <div class="col-span-2 rounded-xl bg-slate-50 p-2.5">
              <dt class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Address</dt>
              <dd class="mt-1 text-sm font-bold text-blue-950">{{ auth.user?.address || 'Not provided' }}</dd>
            </div>
            <div class="rounded-xl bg-slate-50 p-3">
              <dt class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Member since</dt>
              <dd class="mt-1 text-sm font-bold text-blue-950">{{ memberSince || 'Just now' }}</dd>
            </div>
          </dl>

          <button v-if="!editing" type="button" class="mt-5 w-full rounded-xl px-5 py-3 font-extrabold" style="background: #264ab3; color: #fff" @click="startEdit">Edit profile</button>
        </section>
      </aside>

      <main class="min-w-0 space-y-3">
        <section class="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h3 class="font-['Fraunces'] font-bold text-blue-950" style="font-size: 20px">My listings</h3>
              <p class="mt-1 text-sm text-slate-500">Manage products available in the marketplace</p>
            </div>
            <button type="button" class="shrink-0 rounded-full px-4 py-2 text-sm font-extrabold" style="background: #264ab3; color: #fff" @click="router.push('/marketplace/list')">
              {{ market.userListings.length ? 'List an item' : 'List now' }}
            </button>
          </div>

          <div v-if="market.userListings.length" class="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div v-for="item in market.userListings" :key="item.id" class="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
              <img :src="item.img" class="h-14 w-14 shrink-0 rounded-lg object-cover" alt="">
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-bold text-blue-950">{{ item.name }}</p>
                <p class="text-xs text-slate-500">{{ item.category }} · {{ item.stock }} left</p>
                <span class="mt-1 block font-extrabold text-sm text-blue-900">₱{{ item.price }}</span>
              </div>
              <button type="button" class="rounded-full px-2.5 py-1 text-xs font-extrabold" style="background: #fee2e2; color: #b91c1c" @click="unlist(item.id)">Unlist</button>
            </div>
          </div>
          <p v-else class="mt-5 rounded-xl bg-slate-50 p-5 text-sm text-slate-600">You haven't listed anything yet. Head to the Marketplace to add your first item.</p>
        </section>

        <div class="grid gap-6 md:grid-cols-2">
          <section class="rounded-3xl border border-slate-100 bg-slate-50 p-6">
            <p class="text-xs font-extrabold uppercase tracking-widest text-lime-700" style="color: #6f9d10">Connect with AgriSuroy</p>
            <p class="mt-3 font-bold text-blue-900" style="color: #264ab3">CARAGRISUROY@GMAIL.COM</p>
            <p class="mt-1 text-sm font-bold text-blue-800" style="color: #264ab3">WWW.AGRISUROY.COM</p>
          </section>

          <section class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 class="font-['Fraunces'] font-bold text-blue-950" style="font-size: 18px">Demo controls</h3>
            <p class="mt-2 text-sm text-slate-600">Reset your current demo bookings, searches, and saved destinations.</p>
            <button type="button" class="mt-4 rounded-xl px-5 py-3 font-extrabold" style="background: #a8dc2f; color: #18202a" @click="reset">Reset demo</button>
          </section>
        </div>

        <section class="flex flex-col gap-4 rounded-3xl border border-red-200 bg-red-50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 class="font-['Fraunces'] font-bold text-red-900" style="font-size: 20px">Delete account</h3>
            <p class="mt-1 max-w-xl text-sm text-red-800">This permanently removes your profile, listings, purchases, and saved demo data from this device.</p>
          </div>
          <button type="button" class="shrink-0 rounded-xl bg-red-700 px-5 py-3 font-extrabold text-white" @click="deleteConfirmation = true">Delete my account</button>
        </section>
      </main>
    </div>

    <div v-if="deleteConfirmation" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-5" role="dialog" aria-modal="true" aria-labelledby="desktop-delete-title">
      <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h3 id="desktop-delete-title" class="font-['Fraunces'] text-xl font-bold text-red-900">Permanently delete account?</h3>
        <p class="mt-3 text-sm leading-relaxed text-slate-600">This action cannot be undone. Your profile and account data will be removed.</p>
        <div class="mt-6 flex justify-end gap-3">
          <button type="button" class="rounded-xl border border-slate-200 px-4 py-3 font-extrabold text-slate-600" @click="deleteConfirmation = false">Cancel</button>
          <button type="button" class="rounded-xl bg-red-700 px-4 py-3 font-extrabold text-white" @click="deleteAccount">Yes, delete account</button>
        </div>
      </div>
    </div>
  </div>
</template>
