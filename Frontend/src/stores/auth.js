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

  function register({ name, email, password, phone, address, accountType }) {
    const record = {
      name: String(name || '').trim(),
      email: String(email || '').trim().toLowerCase(),
      password: String(password || ''),
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

  function login({ email, password }) {
    const previous = loadUser()
    const normalizedEmail = String(email || '').trim().toLowerCase()

    if (!previous) return { ok: false, message: 'No account is registered on this device.' }
    if (previous.email !== normalizedEmail) return { ok: false, message: 'No account was found with that email address.' }
    if (previous.password && String(password || '') !== previous.password) return { ok: false, message: 'Incorrect password.' }

    user.value = previous
    persist(previous)
    return { ok: true, user: previous }
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

  function logout() {
    user.value = null
  }

  function deleteAccount() {
    user.value = null
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }

  return { user, isRegistered, register, login, updateProfile, logout, deleteAccount }
})
