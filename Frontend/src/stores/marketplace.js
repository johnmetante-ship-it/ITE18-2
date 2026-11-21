import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

const STORAGE_KEY = 'agrisuroy.marketplace'

function loadPersisted() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function persistMarketplace(userListings, purchases) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ userListings, purchases }))
  } catch {
    /* storage may be unavailable */
  }
}

const seedSellers = {
  coOp: { name: 'AgriSuroy Co-op', accountType: 'Group / Organization', email: 'agrisuroy@gmail.com', phone: '+63 917 000 1001', address: 'Butuan City, Agusan del Norte', avatar: '' },
  farmers: { name: 'Cabadbaran Farmers', accountType: 'Group / Organization', email: 'cabadbaran.farmers@gmail.com', phone: '+63 918 000 2002', address: 'Cabadbaran City, Agusan del Norte', avatar: '' },
  growers: { name: 'Jabonga Growers', accountType: 'Group / Organization', email: 'jabonga.growers@gmail.com', phone: '+63 919 000 3003', address: 'Jabonga, Agusan del Norte', avatar: '' },
  craft: { name: 'Craft Collective', accountType: 'Group / Organization', email: 'craftcollective@gmail.com', phone: '+63 920 000 4004', address: 'Butuan City, Agusan del Norte', avatar: '' },
  flavors: { name: 'Caraga Flavors', accountType: 'Group / Organization', email: 'caraga.flavors@gmail.com', phone: '+63 921 000 5005', address: 'Butuan City, Agusan del Norte', avatar: '' },
}

export const useMarketplaceStore = defineStore('marketplace', () => {
  const listings = ref([
    { id: 'm1', name: 'Caraga Wild Honey', category: 'Produce', price: 320, img: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Raw forest honey from local beekeepers.', seller: seedSellers.coOp, stock: 12 },
    { id: 'm2', name: 'Heirloom Rice (5kg)', category: 'Produce', price: 450, img: 'https://images.pexels.com/photos/4110256/pexels-photo-4110256.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Aromatic local rice from Caraga paddies.', seller: seedSellers.farmers, stock: 20 },
    { id: 'm3', name: 'Robusta Coffee Beans (250g)', category: 'Food', price: 280, img: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Sun-dried beans from highland growers.', seller: seedSellers.growers, stock: 15 },
    { id: 'm4', name: 'Handwoven Bamboo Basket', category: 'Crafts', price: 550, img: 'https://images.pexels.com/photos/3104369/pexels-photo-3104369.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Woven by local artisans.', seller: seedSellers.craft, stock: 6 },
    { id: 'm5', name: 'Organic Seedling Kit', category: 'Plants', price: 190, img: 'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Start your own farm garden.', seller: seedSellers.coOp, stock: 30 },
    { id: 'm6', name: 'Caraga Spiced Vinegar', category: 'Food', price: 160, img: 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Small-batch flavored vinegar.', seller: seedSellers.flavors, stock: 25 },
  ])

  const persisted = loadPersisted()
  const userListings = ref(Array.isArray(persisted.userListings) ? persisted.userListings : [])
  const purchases = ref(Array.isArray(persisted.purchases) ? persisted.purchases : [])
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
    persistMarketplace(userListings.value, purchases.value)
    return true
  }

  function listItem(data) {
    const auth = useAuthStore()
    const u = auth.user || {}
    userListings.value.unshift({
      id: 'u' + Date.now(),
      name: String(data.name || '').trim(),
      category: data.category || 'Produce',
      price: Number(data.price) || 0,
      stock: Number(data.stock) || 1,
      description: String(data.description || '').trim(),
      img: String(data.img || '').trim() || 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=600',
      seller: {
        name: u.name || 'You',
        accountType: u.accountType || 'Personal',
        email: u.email || '',
        phone: u.phone || '',
        address: u.address || '',
        avatar: u.avatar || '',
      },
    })
    persistMarketplace(userListings.value, purchases.value)
  }

  function seedDemoListing(seller) {
    userListings.value.unshift({
      id: 'demo-' + Date.now(),
      name: 'Cabadbaran Mangoes (1 kg)',
      category: 'Produce',
      price: 180,
      stock: 8,
      description: 'Sweet ripe mangoes from a demo farm in Cabadbaran.',
      img: 'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=600',
      seller: {
        name: seller.name,
        accountType: seller.accountType,
        email: seller.email,
        phone: seller.phone,
        address: seller.address,
        avatar: seller.avatar,
      },
    })
    persistMarketplace(userListings.value, purchases.value)
  }

  function unlistItem(id) {
    const index = userListings.value.findIndex((x) => x.id === id)
    if (index === -1) return false
    userListings.value.splice(index, 1)
    persistMarketplace(userListings.value, purchases.value)
    return true
  }

  function clearMarketplaceData() {
    userListings.value = []
    purchases.value = []
    activeCategory.value = 'All'
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
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
    seedDemoListing,
    unlistItem,
    clearMarketplaceData,
  }
})
