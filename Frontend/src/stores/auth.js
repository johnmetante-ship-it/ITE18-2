import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'agrisuroy.user'

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persist(record) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  } catch {
    /* storage may be unavailable in private browsing */
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref(loadUser())
  const isRegistered = computed(() => !!user.value)

  function register({ name, email, phone, address, accountType }) {
    const record = {
      name: String(name || '').trim(),
      email: String(email || '').trim().toLowerCase(),
      phone: String(phone || '').trim(),
      address: String(address || '').trim(),
      accountType: accountType || 'Personal',
      avatar: '',
      registeredAt: new Date().toISOString(),
    }
    user.value = record
    persist(record)
    return record
  }

  function login({ email }) {
    const previous = loadUser()
    const record = {
      name: previous?.name || String(email || '').split('@')[0] || 'Traveler',
      email: String(email || '').trim().toLowerCase(),
      phone: previous?.phone || '',
      address: previous?.address || '',
      accountType: previous?.accountType || 'Personal',
      avatar: previous?.avatar || '',
      registeredAt: previous?.registeredAt || new Date().toISOString(),
    }
    user.value = record
    persist(record)
    return record
  }

  function updateProfile(data) {
    const base = user.value || loadUser() || {}
    const record = {
      ...base,
      name: String(data.name || '').trim(),
      email: String(data.email || '').trim().toLowerCase(),
      phone: String(data.phone || '').trim(),
      address: String(data.address || '').trim(),
      accountType: data.accountType || base.accountType || 'Personal',
      avatar: data.avatar !== undefined ? data.avatar : base.avatar || '',
    }
    user.value = record
    persist(record)
    return record
  }

  function seedDemoAccount() {
    const record = {
      name: 'Demo Farmer',
      email: 'demo@agrisuroy.com',
      phone: '+63 917 123 4567',
      address: 'Cabadbaran City, Agusan del Norte',
      accountType: 'Business / Corporation',
      avatar: '',
      registeredAt: new Date().toISOString(),
    }
    user.value = record
    persist(record)
    return record
  }

  function logout() {
    user.value = null
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }

  return { user, isRegistered, register, login, updateProfile, seedDemoAccount, logout }
})
