<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useBookingStore } from '../stores/booking'
import { useMarketplaceStore } from '../stores/marketplace'

const auth = useAuthStore()
const store = useBookingStore()
const market = useMarketplaceStore()
const router = useRouter()

const sellerInfo = ref(null)

const sellerInitials = computed(() =>
  (sellerInfo.value?.name || '?')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
)

function viewSeller(seller) {
  sellerInfo.value = seller
}

function closeSeller() {
  sellerInfo.value = null
}

function buy(id) {
  if (market.buy(id)) {
    store.toast('Purchased! This is a demo order.')
  } else {
    store.toast('That item is out of stock.')
  }
}
</script>

<template>
  <div class="px-7 py-9 md:px-14">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-extrabold uppercase tracking-widest text-lime-700" style="color: #6f9d10">Marketplace · Demo</p>
        <h2 class="mt-2 font-['Fraunces'] font-bold text-blue-950" style="font-size: 24px">Caraga farm &amp; craft goods</h2>
      </div>
      <button
        v-if="auth.isRegistered"
        type="button"
        class="rounded-full px-5 py-2 text-sm font-extrabold"
        style="background: #264ab3; color: #fff"
        @click="router.push('/marketplace/list')"
      >List an item</button>
      <button
        v-else
        type="button"
        class="rounded-full px-5 py-2 text-sm font-extrabold"
        style="background: #a8dc2f; color: #18202a"
        @click="router.push('/register')"
      >Register to list</button>
    </div>

    <div v-if="!auth.isRegistered" class="mt-5 rounded-2xl p-4 text-sm font-bold text-slate-700" style="background: #ecfccb">
      You're browsing as a guest. Register to purchase or list your own items.
    </div>

    <div class="mt-6 flex flex-wrap gap-2" role="group" aria-label="Marketplace categories">
      <button
        v-for="c in market.categories"
        :key="c"
        class="chip rounded-full border px-4 py-2 text-sm font-bold"
        :class="{ active: market.activeCategory === c }"
        type="button"
        @click="market.setCategory(c)"
      >{{ c }}</button>
    </div>

    <div class="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <article v-for="item in market.filtered" :key="item.id" class="flex flex-col overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
        <img loading="lazy" class="h-36 w-full object-cover" :src="item.img" :alt="item.name">
        <div class="flex flex-1 flex-col p-5">
          <div class="flex items-center justify-between gap-3">
            <p class="text-xs font-extrabold uppercase text-lime-700" style="color: #6f9d10">{{ item.category }}</p>
            <span class="text-xs font-bold text-slate-400">{{ item.stock > 0 ? `${item.stock} left` : 'Sold out' }}</span>
          </div>
          <h3 class="mt-1 font-bold text-lg text-blue-950">{{ item.name }}</h3>
          <p class="mt-2 text-sm text-slate-600">{{ item.description }}</p>
          <div class="mt-2 flex items-center justify-between gap-2">
            <p class="text-xs font-bold text-slate-500">Seller: {{ item.seller.name }}</p>
            <button type="button" class="text-xs font-extrabold text-blue-800 hover:underline" @click="viewSeller(item.seller)">View seller info</button>
          </div>
          <div class="mt-auto pt-4 flex items-center justify-between gap-3">
            <span class="font-extrabold text-blue-900">₱{{ item.price }}</span>
            <button
              v-if="auth.isRegistered"
              type="button"
              class="rounded-xl px-4 py-2 text-sm font-extrabold"
              :class="item.stock > 0 ? '' : 'opacity-50 cursor-not-allowed'"
              style="background: #264ab3; color: #fff"
              :disabled="item.stock <= 0"
              @click="buy(item.id)"
            >Buy now</button>
            <button
              v-else
              type="button"
              class="rounded-xl px-4 py-2 text-sm font-extrabold"
              style="background: #a8dc2f; color: #18202a"
              @click="router.push('/register')"
            >Register to buy</button>
          </div>
        </div>
      </article>
    </div>

    <div v-if="!market.filtered.length" class="mt-5 rounded-2xl bg-slate-50 p-8 text-center">
      <p class="text-slate-600">No items in this category yet.</p>
    </div>

    <section v-if="auth.isRegistered && market.purchases.length" class="mt-10">
      <h3 class="font-['Fraunces'] font-bold text-blue-950" style="font-size: 20px">Your purchases</h3>
      <div class="mt-4 space-y-2">
        <div v-for="p in market.purchases" :key="p.id" class="flex items-center gap-3 rounded-xl bg-white px-4 py-3 border border-slate-100">
          <img :src="p.img" alt="" class="h-10 w-10 rounded-lg object-cover">
          <div class="min-w-0 flex-1">
            <p class="font-bold text-sm text-blue-950">{{ p.name }}</p>
            <p class="text-xs text-slate-500">{{ p.seller.name }} · demo purchase</p>
          </div>
          <span class="font-extrabold text-blue-900">₱{{ p.price }}</span>
        </div>
      </div>
    </section>

    <div v-if="sellerInfo" class="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" @click.self="closeSeller">
      <div class="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
        <div class="flex items-center gap-3">
          <img v-if="sellerInfo.avatar" :src="sellerInfo.avatar" class="h-12 w-12 shrink-0 rounded-full object-cover" alt="Seller photo">
          <div v-else class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-800 text-white font-extrabold">{{ sellerInitials }}</div>
          <div class="min-w-0">
            <h3 class="font-bold text-blue-950">{{ sellerInfo.name }}</h3>
            <span class="text-xs font-extrabold" style="color: #6f9d10">{{ sellerInfo.accountType }}</span>
          </div>
        </div>

        <dl class="mt-5 space-y-3">
          <div class="rounded-xl bg-slate-50 p-3">
            <dt class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Email address</dt>
            <dd class="mt-1 text-sm font-bold text-blue-950 break-words">{{ sellerInfo.email || 'Not provided' }}</dd>
          </div>
          <div class="rounded-xl bg-slate-50 p-3">
            <dt class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Contact number</dt>
            <dd class="mt-1 text-sm font-bold text-blue-950">{{ sellerInfo.phone || 'Not provided' }}</dd>
          </div>
          <div class="rounded-xl bg-slate-50 p-3">
            <dt class="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Address</dt>
            <dd class="mt-1 text-sm font-bold text-blue-950">{{ sellerInfo.address || 'Not provided' }}</dd>
          </div>
        </dl>

        <button type="button" class="mt-6 w-full rounded-xl py-3 font-extrabold" style="background: #264ab3; color: #fff" @click="closeSeller">Close</button>
      </div>
    </div>
  </div>
</template>
