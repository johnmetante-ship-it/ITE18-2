import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMarketplaceStore = defineStore('marketplace', () => {
  const listings = ref([
    { id: 'm1', name: 'Caraga Wild Honey', category: 'Produce', price: 320, img: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Raw forest honey from local beekeepers.', seller: 'AgriSuroy Co-op', stock: 12 },
    { id: 'm2', name: 'Heirloom Rice (5kg)', category: 'Produce', price: 450, img: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Aromatic local rice from Caraga paddies.', seller: 'Sibagat Farmers', stock: 20 },
    { id: 'm3', name: 'Robusta Coffee Beans (250g)', category: 'Food', price: 280, img: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Sun-dried beans from highland growers.', seller: 'Lakewood Growers', stock: 15 },
    { id: 'm4', name: 'Handwoven Bamboo Basket', category: 'Crafts', price: 550, img: 'https://images.pexels.com/photos/3104369/pexels-photo-3104369.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Woven by local artisans.', seller: 'Craft Collective', stock: 6 },
    { id: 'm5', name: 'Organic Seedling Kit', category: 'Plants', price: 190, img: 'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Start your own farm garden.', seller: 'AgriSuroy Co-op', stock: 30 },
    { id: 'm6', name: 'Caraga Spiced Vinegar', category: 'Food', price: 160, img: 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Small-batch flavored vinegar.', seller: 'Caraga Flavors', stock: 25 },
  ])

  const userListings = ref([])
  const purchases = ref([])
  const activeCategory = ref('All')

  const all = computed(() => [...userListings.value, ...listings.value])
  const categories = computed(() => ['All', ...new Set(all.value.map((x) => x.category))])
  const filtered = computed(() =>
    activeCategory.value === 'All'
      ? all.value
      : all.value.filter((x) => x.category === activeCategory.value)
  )

  function setCategory(category) {
    activeCategory.value = category
  }

  function findItem(id) {
    return all.value.find((x) => x.id === id)
  }

  function buy(id) {
    const item = findItem(id)
    if (!item || item.stock <= 0) return false
    item.stock -= 1
    purchases.value.unshift({
      id: 'p' + Date.now() + Math.random().toString(36).slice(2, 7),
      name: item.name,
      price: item.price,
      img: item.img,
      seller: item.seller,
      purchasedAt: new Date().toISOString(),
    })
    return true
  }

  function listItem(data) {
    userListings.value.unshift({
      id: 'u' + Date.now(),
      name: String(data.name || '').trim(),
      category: data.category || 'Produce',
      price: Number(data.price) || 0,
      stock: Number(data.stock) || 1,
      description: String(data.description || '').trim(),
      img: String(data.img || '').trim() || 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=600',
      seller: 'You',
    })
  }

  return {
    listings,
    userListings,
    purchases,
    activeCategory,
    all,
    categories,
    filtered,
    setCategory,
    buy,
    listItem,
  }
})
