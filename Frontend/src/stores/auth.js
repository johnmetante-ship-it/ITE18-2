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

  function register({ name, email }) {
    const record = {
      name: String(name || '').trim(),
      email: String(email || '').trim().toLowerCase(),
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
      registeredAt: previous?.registeredAt || new Date().toISOString(),
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

  return { user, isRegistered, register, login, logout }
})
