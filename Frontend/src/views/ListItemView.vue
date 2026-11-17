<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../stores/booking'
import { useMarketplaceStore } from '../stores/marketplace'

const store = useBookingStore()
const market = useMarketplaceStore()
const router = useRouter()

const form = reactive({ name: '', category: 'Produce', price: '', stock: '', description: '', img: '' })
const error = ref('')

function submit() {
  if (!form.name.trim() || !form.price || !form.description.trim()) {
    error.value = 'Please provide a name, price, and description for your item.'
    return
  }
  if (Number(form.price) <= 0) {
    error.value = 'Please enter a valid price.'
    return
  }
  error.value = ''
  market.listItem(form)
  store.toast('Your item is now listed!')
  router.push('/marketplace')
}
</script>

<template>
  <div class="max-w-xl mx-auto px-7 py-10">
    <button type="button" class="inline-flex items-center gap-2 text-sm font-bold text-blue-800" @click="router.push('/marketplace')">
      <i data-lucide="arrow-left" class="w-5 h-5"></i>Back to marketplace
    </button>

    <div class="mt-6 rounded-3xl border border-slate-100 bg-white p-7 shadow-sm">
      <h1 class="font-['Fraunces'] font-bold text-blue-950" style="font-size: 26px">List an item</h1>
      <p class="mt-2 text-sm text-slate-600">Share your Caraga produce or craft with the AgriSuroy community.</p>

      <form class="mt-7 space-y-4" @submit.prevent="submit">
        <div>
          <label class="mb-2 block font-bold text-sm" for="list-name">Item name</label>
          <input id="list-name" v-model="form.name" type="text" class="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="e.g. Dried mango chips">
        </div>
        <div>
          <label class="mb-2 block font-bold text-sm" for="list-category">Category</label>
          <select id="list-category" v-model="form.category" class="w-full rounded-xl border border-slate-200 px-4 py-3">
            <option>Produce</option><option>Food</option><option>Crafts</option><option>Plants</option>
          </select>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-2 block font-bold text-sm" for="list-price">Price (₱)</label>
            <input id="list-price" v-model="form.price" type="number" min="1" class="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="450">
          </div>
          <div>
            <label class="mb-2 block font-bold text-sm" for="list-stock">Stock</label>
            <input id="list-stock" v-model="form.stock" type="number" min="1" class="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="10">
          </div>
        </div>
        <div>
          <label class="mb-2 block font-bold text-sm" for="list-desc">Description</label>
          <textarea id="list-desc" v-model="form.description" rows="3" class="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="Tell buyers what makes this special"></textarea>
        </div>
        <div>
          <label class="mb-2 block font-bold text-sm" for="list-img">Image URL (optional)</label>
          <input id="list-img" v-model="form.img" type="url" class="w-full rounded-xl border border-slate-200 px-4 py-3" placeholder="https://…">
        </div>
        <p v-if="error" class="rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{{ error }}</p>
        <button type="submit" class="w-full rounded-xl px-5 py-3 font-extrabold" style="background: #264ab3; color: #fff">Publish listing</button>
      </form>
    </div>
  </div>
</template>
